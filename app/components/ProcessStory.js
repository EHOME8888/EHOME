"use client";
// app/components/ProcessStory.js
//
// "The Golden Thread": four line-drawn scenes, and one filament of gold that
// runs through all of them without a break. Apply, family confirms, agreement
// signed, move in. Six seconds a scene, twenty-four a cycle.
//
// How it is put together
//   · The four scenes sit side by side in one wide drawing (3200 x 500) and
//     the frame pans from one to the next. That is what lets the thread be a
//     single path: it is drawn in the coordinates of the whole strip, so it
//     really does leave one scene and arrive in the next.
//   · Every rule in the stylesheet below describes the FINISHED scene. The
//     animation only exists on a scene marked data-st="live". So the server
//     render, a browser with no JavaScript, a paused jump and reduced motion
//     all show a complete drawing without any extra code.
//   · Only transform, opacity and stroke-dashoffset move. One easing.
//   · A scene ends when its six-second clock animation ends. Pausing pauses
//     the clock with everything else, so nothing can drift out of step.
//
// What is deliberately not drawn: no shield, umbrella, padlock, coin, note
// or badge. Gold is the thread, the signatures, the emblem and the key.
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

const W = 800;

// The thread, in strip coordinates. Six pieces of one path:
//   A  out of the laptop and off to the right           (scene 1)
//   B  over the sky and down to the phone               (scene 2)
//   C  the parent's signature                           (scene 2)
//   D  back across, onto the document                   (scene 3)
//   E  off the letter, a small knot, up to the key      (scene 4)
//   F  the run the key makes into the lock              (scene 4)
const T = [
  "M500 268C544 240 566 172 640 142C700 118 760 110 800 110",
  "C910 110 990 36 1100 36C1200 36 1236 120 1248 200C1258 268 1272 344 1300 370",
  "C1308 376 1314 378 1326 376c6-14 12-16 14-6s4 10 10-2 10-12 14 0 8 8 14-4 8-6 16 2c6 6 14 4 22-2",
  "C1432 330 1410 270 1450 250C1490 232 1560 250 1600 250C1670 250 1710 290 1770 334C1810 360 1860 366 1900 360L2000 356",
  "L2106 356C2180 352 2240 300 2300 296C2350 292 2380 300 2400 300C2460 300 2510 296 2530 320C2546 340 2520 356 2508 340C2498 324 2540 345 2580 345L2634 345",
  "L2834 345",
];
const THREAD = T.join("");
// Where each piece ends, in thousandths of the whole path. Measured with
// getTotalLength(); if a piece above changes, run measureThread() in the
// console of a development build and paste the numbers here.
const STOPS = [123, 377, 435, 678, 931, 1000];
const off = (k) => 1000 - STOPS[k];
// [from, middle, to] dash offsets for the thread in each scene, and where it
// rests when that scene is finished.
const RUNS = [
  [1000, off(0), off(0)],
  [off(0), off(1), off(2)],
  [off(2), off(3), off(3)],
  [off(3), off(4), off(5)],
];

/* A line that draws on. `t` is its delay in seconds. */
function P({ d, t = 0, g, c = "" }) {
  return <path className={`ps-d ${g ? "ps-g" : "ps-l"} ${c}`} pathLength="1" style={{ "--t": `${t}s` }} d={d} />;
}
function Head({ cx, cy, r = 22, t }) {
  return <circle className="ps-d ps-l" pathLength="1" style={{ "--t": `${t}s` }} cx={cx} cy={cy} r={r} />;
}

/* 1. Apply */
function Apply() {
  return (
    <>
      <P t={0} d="M60 420H740" />
      <P t={0.1} d="M180 330H660" />
      <P t={0.2} d="M214 330V420M626 330V420" />
      <P t={0.25} d="M176 256V420M176 352H236V420" />
      <Head t={0.3} cx={238} cy={212} r={23} />
      <P t={0.4} d="M196 330V296C196 264 214 250 238 250C262 250 280 264 280 296V330" />
      <P t={0.5} d="M276 286C304 294 326 306 346 320" />
      <rect className="ps-screen" x="394" y="250" width="100" height="62" />
      <P t={0.5} d="M392 244h104a4 4 0 0 1 4 4v70H388v-70a4 4 0 0 1 4-4z" />
      <P t={0.6} d="M372 330l12-12h120l12 12" />
      <P t={0.7} d="M556 330V274h30l8 10h52v46" />
      <path className="ps-l ps-tuck" d="M602 284V266h38v18" />
      {/* passport, offer letter, tenancy */}
      <g className="ps-doc" style={{ "--t": "1.2s", "--x": "60px", "--y": "98px" }}>
        <path className="ps-l" d="M543 170h34a3 3 0 0 1 3 3v50a3 3 0 0 1-3 3h-34a3 3 0 0 1-3-3v-50a3 3 0 0 1 3-3zM550 211h20" />
        <circle className="ps-l" cx="560" cy="190" r="7" />
      </g>
      <g className="ps-doc" style={{ "--t": "1.38s", "--x": "6px", "--y": "108px" }}>
        <path className="ps-l" d="M595 158h38a3 3 0 0 1 3 3v54a3 3 0 0 1-3 3h-38a3 3 0 0 1-3-3v-54a3 3 0 0 1 3-3zM601 174h26M601 185h26M601 196h16" />
      </g>
      <g className="ps-doc" style={{ "--t": "1.56s", "--x": "-50px", "--y": "98px" }}>
        <path className="ps-l" d="M651 170h38a3 3 0 0 1 3 3v50a3 3 0 0 1-3 3h-38a3 3 0 0 1-3-3v-50a3 3 0 0 1 3-3zM659 198l11-10 11 10M662 196v11h16v-11M659 216h22" />
      </g>
    </>
  );
}

/* 2. Family confirms */
function Family() {
  return (
    <>
      {/* London terraces, then a city in China: outlines, nothing more */}
      <P t={0.05} c="ps-slow" d="M24 212V176l22-22 22 22v-12h8v12l22-22 22 22v-12h8v12l22-22 22 22v-12h8v12l22-22 22 22v-12h8v12l22-22 22 22h10V126l10-18 10 18V212Z" />
      <P t={0.2} c="ps-slow" d="M520 212V150h26v-26h24v40h16V96h30v52h14v-34l15-20 15 20v52h16v-30h26v-22h22v52h14V212Z" />
      <P t={0.4} d="M762 212V118M762 98V80" />
      <circle className="ps-d ps-l" pathLength="1" style={{ "--t": "0.45s" }} cx="762" cy="108" r="10" />
      {/* the home */}
      <P t={0.4} d="M384 308L574 240L764 308" />
      <P t={0.5} d="M404 301V440M744 301V440M380 440H768" />
      <ellipse className="ps-d ps-l" pathLength="1" style={{ "--t": "0.6s" }} cx="566" cy="380" rx="92" ry="13" />
      <P t={0.7} d="M566 393V432M534 440q32-14 64 0" />
      <Head t={0.7} cx={694} cy={312} r={20} />
      <P t={0.8} d="M660 440V362C660 342 674 332 694 332C714 332 728 342 728 362V440" />
      <P t={0.85} d="M664 356C654 364 650 368 648 371" />
      {/* tea */}
      <P t={0.9} d="M626 362h20v7a7 7 0 0 1-7 7h-6a7 7 0 0 1-7-7zM646 365q7 3 0 7M621 379h30" />
      <path className="ps-l ps-steam" d="M632 355q-3-5 0-10M640 355q3-5 0-10" />
      {/* the phone, flat on the table */}
      <P t={0.9} d="M484 381l12-13h30l-12 13z" />
    </>
  );
}

/* A standing figure behind the table: head, shoulders, nothing else. */
function Figure({ cx, top, t }) {
  const a = cx - 46, b = cx + 46, y = top + 52;
  return (
    <>
      <Head t={t} cx={cx} cy={top + 22} />
      <P t={t + 0.08} d={`M${a} 318V${y + 40}C${a} ${y + 14} ${cx - 26} ${y} ${cx} ${y}C${cx + 26} ${y} ${b} ${y + 14} ${b} ${y + 40}V318`} />
    </>
  );
}

/* 3. Agreement signed: the room */
function Agreement() {
  return (
    <>
      <P t={0} d="M70 440H730" />
      <P t={0.1} d="M150 318H650L720 392H80Z" />
      <P t={0.2} d="M80 392v12H720v-12M112 404V440M688 404V440" />
      <Figure cx={236} top={152} t={0.3} />
      <Figure cx={400} top={120} t={0.4} />
      <Figure cx={564} top={136} t={0.5} />
    </>
  );
}
/* 3, above the thread: the page, the three signatures, the letter */
function AgreementTop() {
  return (
    <>
      <g className="ps-page">
        <path className="ps-l ps-d ps-fill" pathLength="1" style={{ "--t": "0.6s" }} d="M316 330H484L510 380H290Z" />
        <P t={0.8} d="M332 341H468M328 350H440" />
        <P t={0.9} d="M306 373h52M374 373h52M442 373h52" />
        <P g c="ps-sig" t={2.1} d="M310 370c4-9 8-10 9-4s3 6 6-1 6-8 9 0 5 5 9-3 5-4 10 1" />
        <P g c="ps-sig" t={2.7} d="M378 370c2-8 7-11 9-5s2 7 7-2 5-6 8 1 6 4 8-2 6-2 11 2" />
        <P g c="ps-sig" t={3.3} d="M446 369c5-8 6-9 8-2s4 5 6-2 7-7 9 1 4 5 8-2 5-3 11 3" />
      </g>
      <g className="ps-letter">
        <path className="ps-l ps-fill" d="M338 340H462L478 378H322Z" />
        <path className="ps-l" d="M338 340L400 359L462 340" />
        <ellipse className="ps-g" cx="400" cy="368" rx="8" ry="5" />
        <ellipse className="ps-g ps-gf" cx="400" cy="368" rx="2.5" ry="1.6" />
      </g>
    </>
  );
}

/* 4. Move in: the house */
function MoveIn() {
  return (
    <>
      <ellipse className="ps-glow" cx="570" cy="448" rx="230" ry="30" fill="url(#ps-glow)" />
      <P t={0} d="M40 440H770" />
      <P t={0.5} c="ps-dim" d="M60 440V398M420 440V398M60 410H420M90 410V440M120 410V440M150 410V440M180 410V440M210 410V440M240 410V440M270 410V440M300 410V440M330 410V440M360 410V440M390 410V440" />
      <P t={0.1} d="M452 440V132H752V440" />
      <P t={0.2} d="M440 132H764M452 132L470 98H734L752 132" />
      <P t={0.3} d="M486 164h76v70h-76zM524 164v70M486 199h76" />
      <rect className="ps-win" x="640" y="164" width="76" height="70" />
      <P t={0.35} d="M640 164h76v70h-76zM678 164v70M640 199h76" />
      <P t={0.45} d="M656 300h70v84h-70zM691 300v84M656 342h70" />
      <P t={0.4} d="M508 440V250h124V440" />
      <rect className="ps-inside" x="520" y="262" width="100" height="178" />
      <g className="ps-door">
        <path className="ps-l ps-d ps-leaf" pathLength="1" style={{ "--t": "0.5s" }} d="M520 262h100v178h-100z" />
        <P t={0.7} d="M544 280h60v58h-60zM544 356h60v66h-60z" />
        <circle className="ps-l" cx="532" cy="345" r="3" />
      </g>
    </>
  );
}
/* 4, above the thread: the key the thread tightens into */
function Key() {
  return (
    <g className="ps-key">
      <path className="ps-d ps-g" pathLength="1" style={{ "--t": "1.55s", "--u": "0.15s" }} d="M266 345H330" />
      <g className="ps-keyhead">
        <path className="ps-d ps-g" pathLength="1" style={{ "--t": "1.3s", "--u": "0.28s" }} d="M234 345a16 16 0 1 1 32 0a16 16 0 1 1-32 0" />
        <path className="ps-d ps-g" pathLength="1" style={{ "--t": "1.66s", "--u": "0.14s" }} d="M306 345v11h8v-11M321 345v8" />
      </g>
    </g>
  );
}

const SCENES = [
  { Base: Apply },
  { Base: Family },
  { Base: Agreement, Top: AgreementTop },
  { Base: MoveIn, Top: Key },
];

const Glow = () => (
  <defs>
    <radialGradient id="ps-glow">
      <stop offset="0" stopColor="#F7E2B8" stopOpacity="0.55" />
      <stop offset="1" stopColor="#F7E2B8" stopOpacity="0" />
    </radialGradient>
  </defs>
);

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window.measureThread = () => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const len = (d) => { p.setAttribute("d", d); return p.getTotalLength(); };
    const total = len(THREAD);
    let d = "";
    return T.map((s) => Math.round((len((d += s)) / total) * 1000));
  };
}

const PauseIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M7 4.5v11M13 4.5v11" /></svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M7 4.5l8 5.5-8 5.5z" /></svg>
);

export default function ProcessStory() {
  const { t } = useI18n();
  const s = t.story;
  const root = useRef(null);
  const art = useRef(null);
  // still: the current scene is shown finished, not playing. True until the
  // section is first seen, and after a jump made while paused.
  const [at, setAt] = useState({ scene: 0, run: 0, loop: 0, still: true });
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const { scene, run, loop, still } = at;

  useEffect(() => {
    setReady(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    if (mq.addEventListener) mq.addEventListener("change", on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", on);
      else mq.removeListener(on);
    };
  }, []);

  // Play only while it can be seen.
  useEffect(() => {
    const el = art.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (inView && playing && still) setAt((a) => ({ ...a, still: false, run: a.run + 1 }));
  }, [inView, playing, still]);

  // Lines stay 1.5px on screen whatever size the drawing is shown at.
  useEffect(() => {
    const el = root.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      entries.forEach((e) => {
        const w = e.contentRect.width;
        if (w > 0) e.target.style.setProperty("--ps-sw", ((1.5 * W) / w).toFixed(2));
      });
    });
    el.querySelectorAll(".ps__art").forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  }, [reduced]);

  const next = () =>
    setAt((a) => (a.scene === 3
      ? { scene: 0, run: a.run + 1, loop: a.loop + 1, still: false }
      : { ...a, scene: a.scene + 1, run: a.run + 1 }));
  const go = (i) => setAt((a) => ({ ...a, scene: i, run: a.run + 1, still: !playing }));
  const stateOf = (i) => (i < scene ? "done" : i > scene ? "todo" : still ? "done" : "live");
  const running = playing && inView && !still;
  const [a, b, c] = RUNS[scene];

  return (
    <section className="ps" ref={root} aria-labelledby="ps-h" data-run={running ? "" : undefined}>
      <div className="container">
        <header className="ps__head">
          <h2 id="ps-h">{s.title}</h2>
          <p>{s.lead}</p>
        </header>

        {reduced ? (
          <ol className="ps__row">
            {s.steps.map((step, i) => {
              const { Base, Top } = SCENES[i];
              return (
                <li key={step.t}>
                  <div className="ps__art">
                    <svg viewBox={`0 0 ${W} 500`} role="img" aria-labelledby={`ps-t${i} ps-x${i}`}>
                      <title id={`ps-t${i}`}>{step.t}</title>
                      <desc id={`ps-x${i}`}>{step.alt}</desc>
                      {i === 3 && <Glow />}
                      <Base />
                      <path className="ps-thread ps-g" pathLength="1000" d={THREAD} transform={`translate(${-i * W})`}
                        style={{ strokeDashoffset: RUNS[i][2], opacity: i === 3 ? 0 : 1 }} />
                      {Top && <Top />}
                    </svg>
                  </div>
                  <p className="ps__n" aria-hidden="true">0{i + 1}</p>
                  <h3>{step.t}</h3>
                  <p>{step.d}</p>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="ps__body">
            <div className="ps__art" ref={art}>
              <svg key={loop} className="ps__svg" viewBox={`0 0 ${W * 4} 500`} data-scene={scene}
                data-out={scene === 3 && !still ? "" : undefined} data-in={loop > 0 ? "" : undefined}>
                <Glow />
                {SCENES.map(({ Base }, i) => (
                  <svg key={i === scene ? `r${run}` : i} x={i * W} width={W} height="500" viewBox={`0 0 ${W} 500`}
                    data-st={stateOf(i)} role="img" aria-labelledby={`ps-t${i} ps-x${i}`}
                    aria-hidden={i === scene ? undefined : "true"}>
                    <title id={`ps-t${i}`}>{s.steps[i].t}</title>
                    <desc id={`ps-x${i}`}>{s.steps[i].alt}</desc>
                    <Base />
                  </svg>
                ))}
                <path key={`t${run}`} className="ps-thread ps-g" pathLength="1000" d={THREAD}
                  data-run={still ? undefined : scene}
                  style={still
                    ? { strokeDashoffset: c, opacity: scene === 3 ? 0 : 1 }
                    : { "--a": a, "--b": b, "--c": c }} />
                {SCENES.map(({ Top }, i) => Top && (
                  <g key={i === scene ? `r${run}` : i} transform={`translate(${i * W})`} data-st={stateOf(i)}>
                    <Top />
                  </g>
                ))}
              </svg>
              {!still && <i key={run} className="ps__clock" onAnimationEnd={next} />}
            </div>

            <div className="ps__text" aria-live={playing ? "off" : "polite"}>
              {s.steps.map((step, i) => (
                <div key={step.t} className="ps__step" data-on={i === scene ? "" : undefined}>
                  <p className="ps__n" aria-hidden="true">0{i + 1}</p>
                  <h3>{step.t}</h3>
                  <p>{step.d}</p>
                </div>
              ))}
            </div>

            <div className="ps__bar">
              <div className="ps__marks">
                <span className="ps__track" aria-hidden="true">
                  <span key={still ? "s" : run} className="ps__fill" data-still={still ? "" : undefined}
                    style={{ "--f": scene / 4, "--g": (scene + 1) / 4 }} />
                </span>
                <ol aria-label={s.marks}>
                  {s.steps.map((step, i) => (
                    <li key={step.t}>
                      <button type="button" onClick={() => go(i)} aria-current={i === scene ? "step" : undefined}
                        data-done={i < scene ? "" : undefined}>
                        <span className="ps__dot" aria-hidden="true" />
                        <span className="ps__mt"><span className="ps__mn">0{i + 1}</span> {step.t}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <button type="button" className="ps__toggle" hidden={!ready}
                onClick={() => setPlaying((p) => !p)}>
                {playing ? <PauseIcon /> : <PlayIcon />}
                <span>{playing ? s.pause : s.play}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </section>
  );
}

const CSS = `
.ps { --e: cubic-bezier(0.22, 1, 0.36, 1); --ps-ink: #F4F1EA; --ps-gold: #C8A24A; --ps-bg: #141F42;
  background: var(--ps-bg); color: var(--ps-ink); padding: var(--section-md, 96px) 0; margin-top: var(--section-join, 72px); }
.ps h2, .ps h3 { color: var(--ps-ink); }
.ps__head { max-width: 46ch; margin-bottom: var(--sp-8, 56px); }
.ps__head h2 { word-break: keep-all; }
.ps__head p { margin: var(--sp-4, 16px) 0 0; color: rgba(244, 241, 234, 0.74); font-size: var(--step-1, 1.06rem); }

.ps__body { display: grid; grid-template-columns: 3fr 2fr; gap: var(--sp-6, 32px) clamp(32px, 5vw, 72px); align-items: center; }
.ps__art { --ps-sw: 1.9; position: relative; overflow: hidden; border: 1px solid rgba(244, 241, 234, 0.16); border-radius: 3px; }
.ps__art::before { content: ""; display: block; padding-top: 62.5%; }
.ps__art > svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; }
.ps__art > .ps__svg { width: 400%; transform: translate3d(0, 0, 0); transition: transform 0.9s var(--e); will-change: transform; }
.ps__svg[data-scene="1"] { transform: translate3d(-25%, 0, 0); }
.ps__svg[data-scene="2"] { transform: translate3d(-50%, 0, 0); }
.ps__svg[data-scene="3"] { transform: translate3d(-75%, 0, 0); }

/* ---- the drawing, finished ---- */
.ps-l, .ps-g { fill: none; stroke: var(--ps-ink); stroke-width: var(--ps-sw); stroke-linecap: round; stroke-linejoin: round; }
.ps-g { stroke: var(--ps-gold); }
.ps-gf { fill: var(--ps-gold); stroke: none; }
.ps-fill { fill: var(--ps-bg); }
.ps-leaf { fill: #1B2A57; }
/* The gap is longer than the line, and an undrawn line is hidden outright:
   WebKit paints a round cap wherever a zero-length dash falls. */
.ps-d { stroke-dasharray: 1 2; }
.ps-thread { stroke-dasharray: 1000 2000; }
.ps-screen { fill: var(--ps-ink); opacity: 0.16; }
.ps-steam { opacity: 0.7; }
.ps-doc { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; }
.ps-page { opacity: 0; transform-box: fill-box; transform-origin: 50% 100%; }
.ps-dim { stroke-opacity: 0.45; }
.ps-inside { fill: #F7E2B8; opacity: 0.82; }
.ps-win { fill: #F7E2B8; opacity: 0.9; }
.ps-glow { transform-box: fill-box; transform-origin: 50% 50%; }
.ps-door { transform-box: fill-box; transform-origin: 100% 50%; transform: scaleX(0.3); }
.ps-key { opacity: 0; }
.ps-keyhead { transform-box: fill-box; transform-origin: 50% 50%; }
.ps [data-st="todo"] { opacity: 0; }

/* ---- the drawing, playing ---- */
.ps:not([data-run]) .ps__body * { animation-play-state: paused !important; }
.ps-sig { --u: 0.6s; }
.ps-slow { --u: 1s; }
.ps [data-st="live"] .ps-d { animation: psDraw var(--u, 0.7s) var(--e) var(--t, 0s) both; }
.ps [data-st="live"] .ps-doc { animation: psDoc 1.7s var(--e) var(--t) both; }
.ps [data-st="live"] .ps-tuck { animation: psIn 0.4s var(--e) 2.8s both; }
.ps [data-st="live"] .ps-screen { animation: psIn 0.5s var(--e) 2.8s both; }
.ps [data-st="live"] .ps-steam { animation: psIn 0.8s var(--e) 1.3s both; }
.ps [data-st="live"] .ps-page { animation: psPage 6s linear both; }
.ps [data-st="live"] .ps-letter { animation: psLetter 6s linear both; }
.ps [data-st="live"] .ps-key { animation: psKey 6s linear both; }
.ps [data-st="live"] .ps-keyhead { animation: psTurn 6s linear both; }
.ps [data-st="live"] .ps-door { animation: psDoor 6s linear both; }
.ps [data-st="live"] .ps-inside { animation: psInside 6s linear both; }
.ps [data-st="live"] .ps-glow { animation: psGlow 6s linear both; }
.ps [data-st="live"] .ps-win { animation: psWin 6s linear both; }
.ps-thread[data-run="0"] { animation: psT0 6s linear both; }
.ps-thread[data-run="1"] { animation: psT1 6s linear both; }
.ps-thread[data-run="2"] { animation: psT2 6s linear both; }
.ps-thread[data-run="3"] { animation: psT3 6s linear both; }
.ps__svg[data-in] { animation: psFade 0.5s var(--e) both; }
.ps__svg[data-out] { animation: psOut 0.4s var(--e) 5.6s both; }
.ps__clock { position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0; pointer-events: none; animation: psClock 6s linear both; }

@keyframes psClock { to { transform: translateX(1px); } }
@keyframes psFade { from { opacity: 0; } }
@keyframes psOut { to { opacity: 0; } }
@keyframes psIn { from { opacity: 0; } }
@keyframes psDraw { from { stroke-dashoffset: 1; opacity: 0; } 8% { opacity: 1; } to { stroke-dashoffset: 0; opacity: 1; } }
@keyframes psDoc {
  0% { opacity: 0; transform: translate(0, 60px) scale(1); }
  40%, 60% { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.45); }
}
@keyframes psPage {
  0%, 67% { opacity: 1; transform: scale(1, 1); animation-timing-function: var(--e); }
  77% { opacity: 1; transform: scale(0.74, 0.6); }
  80%, 100% { opacity: 0; transform: scale(0.74, 0.6); }
}
@keyframes psLetter { 0%, 74% { opacity: 0; animation-timing-function: var(--e); } 80%, 100% { opacity: 1; } }
@keyframes psKey {
  0%, 30% { opacity: 1; transform: translateX(0); animation-timing-function: var(--e); }
  42%, 48% { opacity: 1; transform: translateX(200px); }
  60%, 100% { opacity: 0; transform: translateX(200px); }
}
@keyframes psTurn { 0%, 42% { transform: scaleY(1); animation-timing-function: var(--e); } 47.5%, 100% { transform: scaleY(0.14); } }
@keyframes psDoor { 0%, 47.5% { transform: scaleX(1); animation-timing-function: var(--e); } 58%, 100% { transform: scaleX(0.3); } }
@keyframes psInside { 0%, 47.5% { opacity: 0; animation-timing-function: var(--e); } 57%, 100% { opacity: 0.92; } }
@keyframes psGlow { 0%, 48% { opacity: 0; transform: scale(0.25); animation-timing-function: var(--e); } 62%, 100% { opacity: 1; transform: scale(1); } }
@keyframes psWin { 0%, 54% { opacity: 0; animation-timing-function: var(--e); } 60%, 100% { opacity: 0.9; } }
@keyframes psT0 {
  0%, 53% { stroke-dashoffset: var(--a); opacity: 0; }
  53.4% { stroke-dashoffset: var(--a); opacity: 1; animation-timing-function: var(--e); }
  77%, 100% { stroke-dashoffset: var(--b); opacity: 1; }
}
@keyframes psT1 {
  0%, 15% { stroke-dashoffset: var(--a); animation-timing-function: var(--e); }
  47%, 48.5% { stroke-dashoffset: var(--b); animation-timing-function: var(--e); }
  70%, 100% { stroke-dashoffset: var(--c); }
}
@keyframes psT2 { 0%, 5% { stroke-dashoffset: var(--a); animation-timing-function: var(--e); } 34%, 100% { stroke-dashoffset: var(--b); } }
@keyframes psT3 {
  0%, 3% { stroke-dashoffset: var(--a); opacity: 1; animation-timing-function: var(--e); }
  22%, 30% { stroke-dashoffset: var(--b); opacity: 1; animation-timing-function: var(--e); }
  42%, 48% { stroke-dashoffset: var(--c); opacity: 1; animation-timing-function: var(--e); }
  60%, 100% { stroke-dashoffset: var(--c); opacity: 0; }
}

/* ---- the words ---- */
.ps__text { display: grid; }
.ps__step { grid-area: 1 / 1; visibility: hidden; opacity: 0; }
.ps__step[data-on] { visibility: visible; opacity: 1; transition: opacity 0.5s var(--e) 0.15s; }
.ps__n { margin: 0 0 var(--sp-3, 12px); font-family: var(--font-display); font-size: var(--step-2, 1.3rem); color: var(--ps-gold); font-variant-numeric: tabular-nums; }
.ps__step h3 { font-size: clamp(1.7rem, 2.7vw, 2.35rem); line-height: 1.12; }
.ps__step p:last-child, .ps__row li > p:last-child { margin: var(--sp-4, 16px) 0 0; max-width: 34ch; color: rgba(244, 241, 234, 0.78); line-height: 1.6; }

/* ---- markers and the pause control ---- */
.ps__bar { grid-column: 1 / -1; display: flex; align-items: flex-start; gap: var(--sp-6, 32px); margin-top: var(--sp-5, 24px); }
.ps__marks { position: relative; flex: 1; }
.ps__track { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: rgba(244, 241, 234, 0.2); }
.ps__fill { display: block; height: 1px; background: var(--ps-gold); transform-origin: 0 50%; transform: scaleX(var(--g)); animation: psFill 6s linear both; }
.ps__fill[data-still] { animation: none; }
@keyframes psFill { from { transform: scaleX(var(--f)); } }
.ps__marks ol { display: grid; grid-template-columns: repeat(4, 1fr); list-style: none; margin: 0; padding: 0; }
.ps__marks button { position: relative; display: block; width: 100%; min-height: 48px; padding: 18px 12px 6px 0; border: 0; background: transparent;
  font: inherit; font-size: 0.95rem; text-align: left; color: rgba(244, 241, 234, 0.62); cursor: pointer; transition: color 0.2s ease; }
.ps__marks button:hover, .ps__marks button[aria-current] { color: var(--ps-ink); }
.ps__dot { position: absolute; top: -4px; left: 0; width: 9px; height: 9px; border-radius: 50%; background: var(--ps-bg); border: 1px solid rgba(244, 241, 234, 0.55); }
.ps__marks button[aria-current] .ps__dot, .ps__marks button[data-done] .ps__dot { background: var(--ps-gold); border-color: var(--ps-gold); }
.ps__mn { margin-right: 6px; color: var(--ps-gold); font-variant-numeric: tabular-nums; }
.ps__toggle { display: inline-flex; align-items: center; gap: 8px; flex: none; min-height: 44px; padding: 0 16px 0 12px; border: 1px solid rgba(244, 241, 234, 0.32);
  border-radius: 999px; background: transparent; font: inherit; font-size: 0.92rem; color: var(--ps-ink); cursor: pointer; transition: border-color 0.2s ease; }
.ps__toggle[hidden] { display: none; }
.ps__toggle:hover { border-color: var(--ps-ink); }
.ps__toggle svg { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.ps button:focus-visible { outline: 2px solid var(--ps-gold); outline-offset: 3px; border-radius: 4px; }
.ps__toggle:focus-visible { border-radius: 999px; }
.ps__marks button:focus-visible { outline-offset: -2px; }

/* ---- reduced motion: four finished scenes, side by side ---- */
.ps__row { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--sp-7, 40px) var(--sp-6, 32px); list-style: none; margin: 0; padding: 0; }
.ps__row .ps__art { --ps-sw: 4.6; margin-bottom: var(--sp-5, 24px); }
.ps__row h3 { font-size: var(--step-3, 1.5rem); }
.ps__row .ps__n { font-size: var(--step-1, 1.06rem); margin-bottom: var(--sp-2, 8px); }

@media (max-width: 1040px) { .ps__row { grid-template-columns: repeat(2, 1fr); } .ps__row .ps__art { --ps-sw: 3; } }
@media (max-width: 820px) {
  .ps__body { grid-template-columns: 1fr; gap: var(--sp-5, 24px); }
  .ps__art { --ps-sw: 3.2; }
  .ps__bar { align-items: center; justify-content: space-between; margin-top: 0; }
  .ps__marks { flex: none; }
  .ps__track { display: none; }
  .ps__marks ol { display: flex; gap: 2px; margin-left: -16px; }
  .ps__marks button { display: grid; place-items: center; width: 44px; height: 44px; min-height: 0; padding: 0; }
  .ps__dot { position: static; width: 10px; height: 10px; }
  .ps__marks button[aria-current] .ps__dot { transform: scale(1.4); }
  .ps__mt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
}
@media (max-width: 560px) { .ps__row { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) {
  .ps *, .ps *::before { animation: none !important; transition: none !important; }
}
`;
