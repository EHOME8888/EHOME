"use client";
// app/components/ProcessThread.js
//
// The process as one thread: a faint line down the page with a gold line
// that fills as the reader scrolls, and four steps hung on it. Apply,
// assess, sign, move in. Under the steps, what to have ready, and two ways
// to go on.
//
// Not to be confused with ProcessStory.js, the four drawn scenes on the
// home page. This one is the reference version of the process: every step
// can be opened for the detail.
//
// How it behaves
//   · The gold fill is the thread's position against a line 55% of the way
//     down the screen. It is read on scroll, at most once a frame, and
//     written straight to the element, so scrolling never re-renders React.
//   · A step fades and lifts in when about a third of it is on screen, and
//     its numbered node lights up with it. It stays lit.
//   · "More" opens the detail with the grid-rows 0fr to 1fr technique, so
//     the height animates without being measured.
//   · prefers-reduced-motion: every step is shown, the thread is full, the
//     nodes are lit, nothing animates. The details still open.
//   · No IntersectionObserver (old WebViews): everything is shown.
//
// Gold is used for the thread, the node ring and for marks on navy. It is
// never text on white, where it fails contrast.
//
// Props
//   heading  "h1" on a page where this is the page title, "h2" (default)
//            where it is one section among others. Step titles follow one
//            level below.
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "./Reveal";
import IconDisc from "./IconDisc";
import {
  IconDocument, IconAssessCheck, IconSign, IconKey,
  IconIdentity, IconStudent, IconHome,
} from "./icons";
import { PORTAL_SIGNUP_URL } from "../lib/site";

// Apply, assess, sign, move in.
const STEP_ICONS = [IconDocument, IconAssessCheck, IconSign, IconKey];
// Passport, university offer, tenancy.
const PREP_ICONS = [IconIdentity, IconStudent, IconHome];
// How far down the screen the thread is "read" from.
const READ_LINE = 0.55;

export default function ProcessThread({ heading = "h2" }) {
  const { t } = useI18n();
  const p = t.process;
  const uid = useId();
  const lineRef = useRef(null);
  const fillRef = useRef(null);
  const [seen, setSeen] = useState([]);
  const [open, setOpen] = useState({});

  const Title = heading === "h1" ? "h1" : "h2";
  const Sub = heading === "h1" ? "h2" : "h3";

  // The gold fill follows the scroll.
  useEffect(() => {
    const line = lineRef.current;
    const fill = fillRef.current;
    if (!line || !fill) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const draw = () => {
      raf = 0;
      if (still.matches) {
        fill.style.transform = "";
        return;
      }
      const r = line.getBoundingClientRect();
      const done = r.height > 0 ? (window.innerHeight * READ_LINE - r.top) / r.height : 0;
      fill.style.transform = `scaleY(${Math.min(1, Math.max(0, done)).toFixed(4)})`;
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    still.addEventListener?.("change", ask);
    // An opened detail makes the thread longer without any scroll.
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(ask);
    ro?.observe(line);
    return () => {
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
      still.removeEventListener?.("change", ask);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Steps arrive as they are reached.
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const steps = Array.from(line.querySelectorAll(".pt__step"));
    if (typeof IntersectionObserver === "undefined") {
      setSeen(steps.map(() => true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = steps.indexOf(e.target);
          io.unobserve(e.target);
          setSeen((prev) => {
            if (prev[i]) return prev;
            const next = prev.slice();
            next[i] = true;
            return next;
          });
        });
      },
      { threshold: 0.35 }
    );
    steps.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="pt">
      <Reveal className="sec-head pt__head">
        <p className="eyebrow">{p.eyebrow}</p>
        <Title>{p.title}</Title>
        <p className="lead">{p.lede}</p>
      </Reveal>

      <div className="pt__line" ref={lineRef}>
        <span className="pt__track" aria-hidden="true" />
        <span className="pt__fill" ref={fillRef} aria-hidden="true" />
        <ol className="pt__steps">
          {p.steps.map((s, i) => {
            const isOpen = !!open[i];
            const detailId = `${uid}-d${i}`;
            return (
              <li key={s.n} className={`pt__step${seen[i] ? " is-in" : ""}`}>
                <span className="pt__node" aria-hidden="true">{s.n}</span>
                <div className="pt__card">
                  <div className="pt__top">
                    <span className="pt__icon" role="img" aria-label={s.icon}>
                      <IconDisc icon={STEP_ICONS[i % STEP_ICONS.length]} tone="dark" size="md" enter={false} />
                    </span>
                    <div>
                      {/* The English tag sits above the title. Where the
                          title is the same word, it would only repeat it. */}
                      {s.label.toLowerCase() !== s.t.toLowerCase() ? (
                        <p className="pt__label" lang="en">{s.label}</p>
                      ) : null}
                      <Sub className="pt__title">{s.t}</Sub>
                    </div>
                  </div>
                  <p className="pt__desc">{s.d}</p>
                  <button
                    type="button"
                    className="pt__more"
                    aria-expanded={isOpen}
                    aria-controls={detailId}
                    onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                  >
                    <span>
                      {p.more}
                      <span className="pt__sr">: {s.t}</span>
                    </span>
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor"
                      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="m3.5 6 4.5 4.5L12.5 6" />
                    </svg>
                  </button>
                  <div className="pt__detail" id={detailId} data-open={isOpen}>
                    <div className="pt__detail-in">
                      <p>{s.more}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <Reveal className="pt__prep">
        <Sub className="pt__prep-title">{p.prepTitle}</Sub>
        <ul className="pt__prep-list">
          {p.prep.map((item, i) => (
            <li key={item}>
              <IconDisc icon={PREP_ICONS[i % PREP_ICONS.length]} tone="dark" size="md" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="pt__cta">
        <a href={PORTAL_SIGNUP_URL} className="btn btn--gold">{p.ctaApply}</a>
        <Link href="/contact" className="btn btn--primary">{p.ctaTalk}</Link>
      </Reveal>

      <style dangerouslySetInnerHTML={{ __html: `
        .pt__head { margin-bottom: var(--sp-8); }
        .pt__sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
          overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

        /* ---- The thread ---- */
        .pt__line { position: relative; }
        .pt__track, .pt__fill { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px;
          margin-left: -1px; border-radius: 2px; }
        .pt__track { background: var(--mist); }
        .pt__fill { background: var(--gold); transform: scaleY(0); transform-origin: 50% 0;
          will-change: transform; }

        /* ---- Steps: left, right, left, right of the thread ---- */
        .pt__steps { list-style: none; margin: 0; padding: 0; position: relative; }
        .pt__step { display: grid; grid-template-columns: minmax(0, 1fr) 96px minmax(0, 1fr);
          padding: 20px 0; opacity: 0; transform: translateY(14px);
          transition: opacity 450ms var(--ease), transform 450ms var(--ease); }
        .pt__step.is-in { opacity: 1; transform: none; }

        .pt__node { grid-column: 2; grid-row: 1; justify-self: center; align-self: start;
          margin-top: 22px; width: 44px; height: 44px; border-radius: 50%;
          display: grid; place-items: center; position: relative; z-index: 1;
          background: var(--surface); border: 2px solid var(--mist); color: var(--muted);
          font-family: var(--font-body); font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.04em;
          transition: background-color 320ms var(--ease) 180ms, border-color 320ms var(--ease) 180ms,
            color 320ms var(--ease) 180ms; }
        /* Gold ring and gold numeral, on navy so the numeral can be read. */
        .pt__step.is-in .pt__node { background: var(--navy); border-color: var(--gold); color: var(--gold); }

        .pt__card { grid-column: 1; grid-row: 1; position: relative; min-width: 0;
          background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
          padding: 22px 24px 10px; }
        .pt__step:nth-child(even) .pt__card { grid-column: 3; }
        /* A short rule ties each card to its node. */
        .pt__card::before { content: ""; position: absolute; top: 43px; right: -27px; width: 26px; height: 1px;
          background: var(--mist); }
        .pt__step:nth-child(even) .pt__card::before { right: auto; left: -27px; }

        .pt__top { display: flex; align-items: center; gap: 14px; }
        .pt__icon { display: inline-flex; flex: none; }
        .pt__icon .icon-disc { background: var(--navy); border-color: var(--navy); }
        .pt__label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--muted); line-height: 1.2; margin-bottom: 4px; }
        .pt .pt__title { font-size: var(--step-3); line-height: 1.15; color: var(--navy); }
        :lang(zh) .pt .pt__title { line-height: 1.3; }
        .pt__desc { margin-top: 14px; color: var(--ink); }

        .pt__more { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; margin-top: 4px;
          padding: 0 10px 0 0; border: 0; background: none; cursor: pointer;
          font-family: var(--font-body); font-size: 0.875rem; font-weight: 600; color: var(--navy); }
        .pt__more:hover { color: var(--navy-lift); }
        .pt__more svg { transition: transform 260ms var(--ease); }
        .pt__more[aria-expanded="true"] svg { transform: rotate(180deg); }

        .pt__detail { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 320ms var(--ease); }
        .pt__detail[data-open="true"] { grid-template-rows: 1fr; }
        /* Hidden from the keyboard and screen readers while closed, and only
           after the closing movement has finished. */
        .pt__detail-in { min-height: 0; overflow: hidden; visibility: hidden;
          transition: visibility 0s linear 320ms; }
        .pt__detail[data-open="true"] .pt__detail-in { visibility: visible; transition-delay: 0s; }
        .pt__detail p { margin: 0 0 12px; padding-top: 12px; border-top: 1px solid var(--line);
          color: var(--muted); font-size: 0.9375rem; }

        /* ---- What to have ready ---- */
        .pt__prep { margin-top: var(--sp-6); background: var(--navy); color: #fff;
          border-radius: var(--radius); padding: 32px 36px 36px; }
        .pt .pt__prep-title { font-size: var(--step-3); line-height: 1.15; color: #fff; margin-bottom: 24px; }
        .pt__prep-list { list-style: none; margin: 0; padding: 0; display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 28px; }
        .pt__prep-list li { display: flex; align-items: center; gap: 14px; color: rgba(255, 255, 255, 0.92); }

        .pt__cta { margin-top: var(--sp-6); display: flex; flex-wrap: wrap; gap: 12px; }
        .pt__cta .btn { min-height: 48px; }

        @media (max-width: 820px) {
          .pt__head { margin-bottom: var(--sp-6); }
          .pt__track, .pt__fill { left: 20px; }
          .pt__step { grid-template-columns: 40px minmax(0, 1fr); column-gap: 16px; padding: 14px 0; }
          .pt__node { grid-column: 1; width: 40px; height: 40px; margin-top: 20px; font-size: 0.75rem; }
          .pt__card, .pt__step:nth-child(even) .pt__card { grid-column: 2; padding: 18px 18px 6px; }
          .pt__card::before, .pt__step:nth-child(even) .pt__card::before { top: 39px; right: auto; left: -17px; width: 16px; }
          .pt__prep { padding: 26px 22px 28px; }
          .pt__prep-list { grid-template-columns: 1fr; gap: 16px; }
          .pt__cta .btn { flex: 1 1 140px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pt__step { opacity: 1; transform: none; transition: none; }
          .pt__fill { transform: none !important; }
          .pt__node { background: var(--navy); border-color: var(--gold); color: var(--gold); transition: none; }
          .pt__detail, .pt__detail-in, .pt__more svg { transition: none; }
        }
      ` }} />
    </div>
  );
}
