"use client";
// app/components/StudentStory.js
//
// "Winnie gets her keys": the /students page told in twenty seconds. A
// landlord asks for a UK guarantor, a student with family overseas cannot
// provide one, Ehome takes that role, the landlord is satisfied, the
// student moves in. Five beats of four seconds each.
//
// The picture is a silent, looping video drawn with the Ehome cast (Winnie,
// Alex, Arthur). There are no words in it. The captions are real text under
// the frame, taken from the dictionary, so they follow the site language
// and can be read, translated and selected.
//
// Playback is the component's business, not the page's:
//   · plays when a third of it is on screen, pauses when it is not
//   · a visible pause / play button; a pause the reader chose is kept
//   · no sound: the file has no audio track and the element is muted
//   · prefers-reduced-motion: no video at all. The final frame is shown as
//     a still and the five captions are listed beneath it. CSS makes that
//     switch, so it is right before any script runs; the script only makes
//     sure the video is never started.
//   · autoplay refused (some in-app browsers): the first frame stays as the
//     poster and the button reads "play"
//
// Nothing here can move the page: the frame holds a 4:3 box before the
// video loads, the poster is the film's own first frame, and the five
// captions are stacked in one grid cell so the tallest sets the height.
//
// Wording rule for anything added here: this is a guarantee. Not insurance,
// and nothing in the picture suggests it (no shield, umbrella, coin or note).
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

const BEAT_SECONDS = 4;
const BEATS = 5;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function StudentStory({ className = "" }) {
  const { t } = useI18n();
  const s = t.students.story;
  const descId = useId();

  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useRef(false);
  const userPaused = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  // Play on screen, pause off screen.
  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame) return;

    const start = () => {
      if (userPaused.current || reducedMotion()) return;
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {}); // autoplay refused: the poster stays
    };

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
          else video.pause();
        });
      },
      { threshold: 0.35 }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

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
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <figure className={`ss ${className}`.trim()}>
      <div className="ss__frame" ref={frameRef}>
        <video
          ref={videoRef}
          className="ss__video"
          width="960"
          height="720"
          poster="/videos/student-story-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          x5-playsinline="true"
          aria-label={s.title}
          aria-describedby={descId}
        >
          <source src="/videos/student-story.webm" type="video/webm" />
          <source src="/videos/student-story.mp4" type="video/mp4" />
        </video>

        {/* Reduced motion only. display:none until then, and lazy, so it is not fetched otherwise. */}
        <img
          className="ss__still"
          src="/videos/student-story-final.jpg"
          width="960"
          height="720"
          loading="lazy"
          decoding="async"
          alt={s.stillAlt}
        />

        <button type="button" className="ss__btn" onClick={toggle} aria-label={playing ? s.pause : s.play}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            ) : (
              <path d="M8 5l11 7-11 7z" fill="currentColor" />
            )}
          </svg>
        </button>
      </div>

      <figcaption className="ss__text">
        <p id={descId} className="ss__sr">{s.desc}</p>

        {/* One line at a time, in step with the picture. Screen readers get the list below instead. */}
        <div className="ss__now" aria-hidden="true">
          <div className="ss__steps">
            {s.captions.map((c, i) => (
              <span key={c} className={i <= beat ? "is-on" : ""} />
            ))}
          </div>
          <div className="ss__caps">
            {s.captions.map((c, i) => (
              <p key={c} className={i === beat ? "is-on" : ""}>{c}</p>
            ))}
          </div>
        </div>

        {/* All five. Hidden from sight while the film plays, shown as the caption list under reduced motion. */}
        <ol className="ss__all">
          {s.captions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </figcaption>

      <style dangerouslySetInnerHTML={{ __html: `
        .ss { margin: 0; width: 100%; }
        .ss__frame { position: relative; aspect-ratio: 4 / 3; overflow: hidden;
          background: #F4EFE4; border: 1px solid var(--line); border-radius: var(--radius); }
        @supports not (aspect-ratio: 1) {
          .ss__frame { height: 0; padding-top: 75%; }
        }
        .ss__video, .ss__still { position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: contain; display: block; }
        .ss__still { display: none; }
        .ss__btn { position: absolute; right: 12px; top: 12px; width: 44px; height: 44px;
          display: grid; place-items: center; padding: 0; border: 0; border-radius: 50%;
          background: rgba(27, 42, 87, 0.9); color: #fff; cursor: pointer;
          transition: background-color 160ms var(--ease); }
        .ss__btn:hover { background: var(--navy-lift); }
        .ss__btn:focus-visible { border-radius: 50%; }

        .ss__text { position: relative; margin-top: 14px; }
        .ss__steps { display: flex; gap: 6px; margin-bottom: 10px; }
        .ss__steps span { width: 28px; height: 3px; border-radius: 2px; background: var(--line);
          transition: background-color 200ms var(--ease); }
        .ss__steps span.is-on { background: var(--brand); }
        .ss__caps { display: grid; }
        .ss__caps p { grid-area: 1 / 1; margin: 0; color: var(--brand); font-size: var(--step-0);
          line-height: 1.5; font-weight: 500; opacity: 0; transition: opacity 220ms var(--ease); }
        .ss__caps p.is-on { opacity: 1; }

        .ss__sr, .ss__all { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
          overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }

        @media (prefers-reduced-motion: reduce) {
          .ss__video, .ss__btn, .ss__now { display: none; }
          .ss__still { display: block; }
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
