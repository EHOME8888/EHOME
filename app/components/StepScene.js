"use client";
// app/components/StepScene.js
//
// Four short line-drawn explainers, one per step of the application. Drawn
// here, in the same stroke and colours as the icon set, and animated with
// CSS alone: stroke-dashoffset to draw a line on, transforms to move a pen
// or swing a door. No GIF, no library, no SMIL (which WebKit and the WeChat
// WebView support unevenly).
//
// Every path carries pathLength="1", so a line of any length draws on with
// the same two numbers — dasharray 1, dashoffset 1 → 0 — and nothing has to
// be measured.
//
// Playback is the component's business, not the page's:
//   · plays once, when 55% of it has scrolled into view
//   · desktop with a real pointer: hover replays it (the scene re-mounts,
//     which restarts every CSS animation at zero)
//   · prefers-reduced-motion: the final frame, drawn, no animation
//   · no IntersectionObserver at all: plays immediately
// The styles live once in globals.css.
//
// What is deliberately not drawn: no shield, no umbrella, no safe, no
// stamp that looks like a crest. The seal in step three is a plain ring —
// a signature is the guarantee; nothing here suggests cover.
import { useEffect, useRef, useState } from "react";

const S = { fill: "none", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const NAVY = "var(--navy)";
const GOLD = "var(--gold)";

/** 01 — Share your tenancy: the form draws, the details go in, it is sent. */
function SceneShare() {
  return (
    <svg viewBox="0 0 120 90" {...S}>
      <g className="sa-rise">
        <path className="sa-draw t0" pathLength="1" stroke={NAVY} d="M34 14h34l12 12v48a3 3 0 0 1-3 3H34a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z" />
        <path className="sa-draw t1" pathLength="1" stroke={NAVY} d="M68 14v12h12" />
        <path className="sa-draw t2" pathLength="1" stroke={NAVY} d="M41 38h30" />
        <path className="sa-draw t3" pathLength="1" stroke={NAVY} d="M41 48h30" />
        <path className="sa-draw t4" pathLength="1" stroke={GOLD} d="M41 58h20" />
        {/* the property: a small house, the thing the form is about */}
        <path className="sa-draw t5" pathLength="1" stroke={GOLD} d="M62 66l7-6 7 6M64.5 64.5v6.5h9v-6.5" />
      </g>
      {/* sent: the arrow leaves to the right */}
      <path className="sa-draw sa-send t6" pathLength="1" stroke={GOLD} d="M88 45h18m-5-5 5 5-5 5" />
    </svg>
  );
}

/** 02 — Quick assessment: the papers are read, the clock turns, it passes. */
function SceneAssess() {
  return (
    <svg viewBox="0 0 120 90" {...S}>
      <path className="sa-draw t0" pathLength="1" stroke={NAVY} d="M20 16h30l8 8v46a2.5 2.5 0 0 1-2.5 2.5H20a2.5 2.5 0 0 1-2.5-2.5V18.5A2.5 2.5 0 0 1 20 16z" />
      <path className="sa-draw t1" pathLength="1" stroke={NAVY} d="M25 34h22M25 42h22M25 50h16" />
      {/* the magnifier reads down the page */}
      <g className="sa-glide">
        <circle className="sa-draw t2" pathLength="1" stroke={GOLD} cx="38" cy="36" r="6.5" />
        <path className="sa-draw t2" pathLength="1" stroke={GOLD} d="M43 41l5 5" />
      </g>
      {/* 48 hours: the hand sweeps, the ring draws */}
      <circle className="sa-draw t3" pathLength="1" stroke={NAVY} cx="88" cy="42" r="15" />
      <path className="sa-draw sa-hand t3" pathLength="1" stroke={NAVY} d="M88 42V31" />
      <path className="sa-draw t3" pathLength="1" stroke={NAVY} d="M88 27v2M103 42h-2M88 57v-2M73 42h2" />
      {/* passed */}
      <path className="sa-draw t5" pathLength="1" stroke={GOLD} strokeWidth="2" d="M80 70l5 5 11-11" />
    </svg>
  );
}

/** 03 — We guarantee your lease: a pen signs, a plain seal settles. */
function SceneSign() {
  return (
    <svg viewBox="0 0 120 90" {...S}>
      <path className="sa-draw t0" pathLength="1" stroke={NAVY} d="M28 12h50l10 10v52a3 3 0 0 1-3 3H28a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" />
      <path className="sa-draw t1" pathLength="1" stroke={NAVY} d="M35 30h34M35 38h34M35 46h22" />
      {/* the signature line, then the signature itself, in gold */}
      <path className="sa-draw t2" pathLength="1" stroke={NAVY} d="M35 64h40" />
      <path className="sa-draw sa-sig t3" pathLength="1" stroke={GOLD} d="M37 61c3-7 6-8 7-3s2 5 5-1 5-6 7 0 4 4 7-2 4-3 8 1" />
      {/* the pen travels the same line as the signature draws */}
      <g className="sa-pen">
        <path stroke={NAVY} d="M38 58l12-12 4 4-12 12-5 1z" />
        <path stroke={NAVY} d="M48 48l4 4" />
      </g>
      {/* a plain ring: signed, and that is the guarantee */}
      <g className="sa-seal">
        <circle stroke={GOLD} cx="92" cy="70" r="9" />
        <circle stroke={GOLD} cx="92" cy="70" r="5.5" strokeDasharray="1.2 1.6" />
      </g>
    </svg>
  );
}

/** 04 — Move in: the key turns, the door opens, the light is on. */
function SceneMoveIn() {
  return (
    <svg viewBox="0 0 120 90" {...S}>
      {/* the room behind the door, lit as it opens */}
      <rect className="sa-light" fill={GOLD} stroke="none" x="46" y="18" width="30" height="54" />
      <path className="sa-draw t0" pathLength="1" stroke={NAVY} d="M40 76V20a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v56" />
      <path className="sa-draw t0" pathLength="1" stroke={NAVY} d="M30 76h60" />
      {/* the door, hinged on its left edge */}
      <g className="sa-door">
        <rect className="sa-draw t1" pathLength="1" stroke={NAVY} fill="var(--surface)" x="46" y="22" width="28" height="54" rx="1" />
        <circle className="sa-draw t1" pathLength="1" stroke={NAVY} cx="68" cy="50" r="1.6" />
      </g>
      {/* the key arrives at the lock, turns, and goes as the door opens */}
      <g className="sa-key">
        <g className="sa-keyturn">
          <circle className="sa-draw t1" pathLength="1" stroke={GOLD} cx="18" cy="50" r="4.5" />
          <path className="sa-draw t1" pathLength="1" stroke={GOLD} d="M22.5 50h12m-4 0v3m-3-3v2.5" />
        </g>
      </g>
    </svg>
  );
}

const SCENES = [SceneShare, SceneAssess, SceneSign, SceneMoveIn];

export default function StepScene({ step = 0, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [mode, setMode] = useState("idle"); // idle → play | static
  const [run, setRun] = useState(0);
  const [hoverable, setHoverable] = useState(false);
  // When the current run started. mouseenter also fires when a card scrolls
  // under a resting pointer, which would restart a scene mid-sequence every
  // time the page moved; a replay is only offered once a run has finished.
  const startedAt = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setHoverable(!reduced && window.matchMedia("(hover: hover)").matches);
    if (reduced) { setMode("static"); return; }
    if (typeof IntersectionObserver === "undefined") { setMode("play"); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { startedAt.current = Date.now(); setMode("play"); io.disconnect(); }
      },
      // 0.35, not 0.55: a scene a thumb-flick has left a third on screen
      // should still play. One that is scrolled straight past is not
      // watched either way, and the next time it is scrolled to it plays.
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Scene = SCENES[step % SCENES.length];
  return (
    <div
      ref={ref}
      className={`sa sa--${step} sa--${mode} ${className}`.trim()}
      style={{ "--sa-delay": `${delay}ms` }}
      onMouseEnter={
        hoverable && mode === "play"
          ? () => {
              // this scene's run ends a slot after it started, plus its wait
              if (Date.now() - startedAt.current > StepScene.SLOT_MS + delay) {
                startedAt.current = Date.now(); setRun((r) => r + 1);
              }
            }
          : undefined
      }
      aria-hidden="true"
    >
      {/* While a scene waits its turn, a faint sketch of its finished frame
          sits underneath, so the row is never a line of empty boxes. The
          live drawing then goes over it. Hidden on phones, where nothing
          waits, and under reduced motion, where the top copy is already
          the finished frame. */}
      <div className="sa-ghost"><Scene /></div>
      <div className="sa-live"><Scene key={run} /></div>
    </div>
  );
}

/** One scene's turn: its longest sequence plus a beat, at desktop speed. */
StepScene.SLOT_MS = 2900;
