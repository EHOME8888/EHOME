"use client";
// app/components/StudentStory.js
//
// "Winnie gets her keys": the /students page told in twenty seconds. A
// student hands her rental application to the landlord, the UK guarantor
// line is the one she cannot fill, Ehome takes that role, the landlord is
// satisfied, the student moves in. Five beats of four seconds each.
//
// The picture is a silent, looping film drawn with the Ehome cast (Winnie,
// Alex, Arthur). It is one large panel across the page, and there are four
// files of it: a wide cut (16:9) for desktop and a tall cut (4:5) for
// phones, each in English and in Chinese, because the paperwork Winnie
// hands over can be read. The component picks the file from the viewport
// and the site language and swaps it, keeping its place, when either
// changes. The five captions are still real text, in the bar under the
// picture, taken from the dictionary.
//
// Playback is the component's business, not the page's:
//   · plays when a third of it is on screen, pauses when it is not
//   · a visible pause / play button; a pause the reader chose is kept
//   · no sound: the files have no audio track and the element is muted
//   · prefers-reduced-motion: no video at all. The final frame is shown as
//     a still and the five captions are listed beneath it. CSS hides the
//     moving parts before any script runs; the script never adds a source.
//   · autoplay refused (some in-app browsers): the first frame stays as the
//     poster and the button reads "play"
//
// Nothing here can move the page: the panel holds its 16:9 or 4:5 box in
// CSS before anything loads, the poster is the film's own first frame, and
// the five captions are stacked in one grid cell so the tallest sets the
// height.
//
// Wording rule for anything added here: this is a guarantee. Not insurance,
// and nothing in the picture suggests it (no shield, umbrella, coin or note).
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

const BEAT_SECONDS = 4;
const BEATS = 5;
const PHONE = "(max-width: 820px)"; // keep in step with the media query in the styles below
const FILE = "/videos/student-story";

const mq = (q) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(q) : null;
const reducedMotion = () => !!mq("(prefers-reduced-motion: reduce)")?.matches;

export default function StudentStory({ className = "" }) {
  const { lang, t } = useI18n();
  const s = t.students.story;
  const descId = useId();

  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useRef(false);
  const userPaused = useRef(false);

  // Which cut to show. Unknown until the browser has been asked, so the
  // server sends the empty panel and no file is fetched twice.
  const [shape, setShape] = useState(null); // "wide" | "tall"
  const [still, setStill] = useState(false); // reduced motion
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const phone = mq(PHONE);
    const calm = mq("(prefers-reduced-motion: reduce)");
    const read = () => {
      setShape(phone?.matches ? "tall" : "wide");
      setStill(!!calm?.matches);
    };
    read();
    phone?.addEventListener?.("change", read);
    calm?.addEventListener?.("change", read);
    return () => {
      phone?.removeEventListener?.("change", read);
      calm?.removeEventListener?.("change", read);
    };
  }, []);

  const film = shape && !still ? `${FILE}-${shape}-${lang === "zh" ? "zh" : "en"}` : null;

  const start = () => {
    const video = videoRef.current;
    if (!video || userPaused.current || reducedMotion()) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {}); // autoplay refused: the poster stays
  };

  // Play on screen, pause off screen.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (typeof IntersectionObserver === "undefined") {
      inView.current = true;
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          inView.current = e.isIntersecting;
          if (e.isIntersecting) start();
          else videoRef.current?.pause();
        });
      },
      { threshold: 0.35 }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  // A new cut (the language or the viewport changed): load it and carry on
  // from the same moment of the story.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !film) return;
    const at = video.currentTime || 0;
    const seek = () => {
      try { video.currentTime = at; } catch (e) { /* not seekable yet: start from the top */ }
    };
    video.load();
    if (at > 0.05) video.addEventListener("loadedmetadata", seek, { once: true });
    if (inView.current) start();
    return () => video.removeEventListener("loadedmetadata", seek);
  }, [film]);

  // The button follows what the video is really doing, not what was asked.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // Caption follows the picture. Read once a frame while playing; React
  // only re-renders on the five moments the beat changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const read = () =>
      setBeat(Math.min(BEATS - 1, Math.max(0, Math.floor(video.currentTime / BEAT_SECONDS))));
    read();
    if (!playing) return;
    let id;
    const tick = () => {
      read();
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      start();
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <figure className={`ss ${className}`.trim()}>
      <div className="ss__frame" ref={frameRef}>
        {/* The film's own first frame, under the video until it has something to show. */}
        {film && <img className="ss__poster" src={`${film}-poster.jpg`} alt="" aria-hidden="true" decoding="async" />}

        <video
          ref={videoRef}
          className="ss__video"
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          x5-playsinline="true"
          aria-label={s.title}
          aria-describedby={descId}
        >
          {film && <source key={`${film}.webm`} src={`${film}.webm`} type="video/webm" />}
          {film && <source key={`${film}.mp4`} src={`${film}.mp4`} type="video/mp4" />}
        </video>

        {/* Reduced motion only: the last frame, which has no wording in it, so one file serves both languages. */}
        {shape && still && (
          <img className="ss__still" src={`${FILE}-${shape}-final.jpg`} alt={s.stillAlt} decoding="async" />
        )}
      </div>

      <figcaption className="ss__bar">
        <p id={descId} className="ss__sr">{s.desc}</p>

        <button type="button" className="ss__btn" onClick={toggle} aria-label={playing ? s.pause : s.play}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            ) : (
              <path d="M8 5l11 7-11 7z" fill="currentColor" />
            )}
          </svg>
        </button>

        {/* One line at a time, in step with the picture. Screen readers get the list below instead. */}
        <div className="ss__caps" aria-hidden="true">
          {s.captions.map((c, i) => (
            <p key={c} className={i === beat ? "is-on" : ""}>{c}</p>
          ))}
        </div>
        <div className="ss__steps" aria-hidden="true">
          {s.captions.map((c, i) => (
            <span key={c} className={i <= beat ? "is-on" : ""} />
          ))}
        </div>

        {/* All five. Hidden from sight while the film plays, shown as the caption list under reduced motion. */}
        <ol className="ss__all">
          {s.captions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </figcaption>

      <style dangerouslySetInnerHTML={{ __html: `
        /* One panel across the page. It is as wide as the page allows; on a short, wide
           window it gives up a little width so the picture and its caption fit under the nav. */
        .ss { margin: 0 auto; width: 100%; max-width: max(78%, calc((100svh - 176px) * 16 / 9));
          overflow: hidden; background: var(--surface, #fff);
          border: 1px solid var(--line); border-radius: 20px; }
        .ss__frame { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #F3EFE3; }
        @supports not (aspect-ratio: 1) {
          .ss__frame { height: 0; padding-top: 56.25%; }
        }
        .ss__poster, .ss__video, .ss__still { position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; display: block; }

        .ss__bar { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center; column-gap: 18px; padding: 14px 22px 14px 16px;
          border-top: 1px solid var(--line); }
        .ss__btn { width: 44px; height: 44px; display: grid; place-items: center; padding: 0; border: 0;
          border-radius: 50%; background: var(--brand); color: #fff; cursor: pointer;
          transition: background-color 160ms var(--ease); }
        .ss__btn:hover { background: var(--navy-lift); }
        .ss__btn:focus-visible { border-radius: 50%; }
        .ss__caps { display: grid; }
        .ss__caps p { grid-area: 1 / 1; margin: 0; color: var(--brand);
          font-size: clamp(1rem, 0.3vw + 0.95rem, 1.2rem); line-height: 1.45; font-weight: 500;
          opacity: 0; transition: opacity 220ms var(--ease); }
        .ss__caps p.is-on { opacity: 1; }
        .ss__steps { display: flex; gap: 6px; }
        .ss__steps span { width: 28px; height: 3px; border-radius: 2px; background: var(--line);
          transition: background-color 200ms var(--ease); }
        .ss__steps span.is-on { background: var(--brand); }

        .ss__sr, .ss__all { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
          overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }

        @media ${PHONE} {
          .ss { max-width: none; border-radius: 14px; }
          .ss__frame { aspect-ratio: 4 / 5; }
          @supports not (aspect-ratio: 1) {
            .ss__frame { padding-top: 125%; }
          }
          .ss__bar { grid-template-columns: auto minmax(0, 1fr); row-gap: 12px; column-gap: 14px;
            padding: 12px 16px 14px 12px; }
          .ss__caps { align-items: center; }
          .ss__steps { grid-column: 1 / -1; }
          .ss__steps span { flex: 1; width: auto; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ss__poster, .ss__video, .ss__btn, .ss__caps, .ss__steps { display: none; }
          .ss__bar { display: block; padding: 18px 22px 20px; }
          .ss__all { position: static; width: auto; height: auto; margin: 0; padding: 0 0 0 1.4em;
            overflow: visible; clip: auto; clip-path: none; white-space: normal;
            display: flex; flex-direction: column; gap: 6px;
            color: var(--brand); font-size: var(--step-0); line-height: 1.5; }
          .ss__all li::marker { color: var(--muted); }
        }
      ` }} />
    </figure>
  );
}
