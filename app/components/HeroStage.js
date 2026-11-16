"use client";
// app/components/HeroStage.js
//
// The homepage hero: a scene that answers the reader.
//
//   · Four paper cards float beside the headline. Each is one of the four
//     promises, drawn rather than photographed: the key, the six-hour clock,
//     the two languages, the letter.
//   · On a desktop they lean and drift with the pointer, each by its own
//     depth, and the bridge behind them moves the other way.
//   · On scroll the stage holds still while the scene plays: the cards fly
//     out past the edges, the headline lifts away, the bridge comes forward,
//     and the next section rises over it like a sheet of paper.
//
// How it is put together:
//
//   <section.hero>          taller than the screen; its extra height is the
//     <div.hero__stage>     scroll the scene plays over. The stage is
//                           position: sticky, so the browser does the
//                           pinning — nothing here ever intercepts a scroll.
//
// One scroll listener and one pointer listener, both passive, both batched
// into animation frames. They write numbers onto the stage as CSS variables
// and the stylesheet does the rest with transform and opacity.
//
// What happens when things are missing:
//   · no JavaScript      the variables keep their defaults, so the hero
//                        simply holds, complete, and the next section still
//                        rises over it
//   · reduced motion     no pin, no drift, no fly-out: the hero is an
//                        ordinary section with everything in place
//   · a short screen     the stage is as tall as its content needs, and
//                        pins by its bottom edge instead of its top
import { useEffect, useRef } from "react";
import { PORTAL_SIGNUP_URL } from "../lib/site";
import { useI18n } from "../i18n/LanguageProvider";
import HeroPhoto from "./HeroPhoto";
import Reveal from "./Reveal";

/* ------------------------------------------------------------------ */
/* The four drawings. One grid (160 x 84), one stroke, navy line and a  */
/* single gold part each — the same hand as the step scenes.            */
/* ------------------------------------------------------------------ */

function Art({ children }) {
  return (
    <svg
      className="hcard__svg"
      viewBox="0 0 160 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** A key on its tag — more homes open, because the landlord says yes. */
function ArtKey() {
  return (
    <Art>
      <circle cx="54" cy="36" r="15" />
      <circle cx="48" cy="36" r="4.2" />
      <path d="M69 36h58" />
      <path d="M107 36v10M117 36v6.5M127 36v12" />
      <path d="M46.5 40c-5 7-6.5 12-4.5 17" className="hcard__gold" strokeWidth="1.4" />
      <g transform="rotate(-14 44 66)">
        <rect x="26" y="57" width="38" height="19" rx="3.5" className="hcard__goldfill" />
        <circle cx="33" cy="66.5" r="1.9" className="hcard__paperfill" stroke="none" />
        <path d="M41 63.5h16M41 69.5h10" stroke="#fff" strokeWidth="1.5" />
      </g>
    </Art>
  );
}

/** A dial with its hand swept round — a decision in as little as 6 hours. */
function ArtClock() {
  return (
    <Art>
      <circle cx="80" cy="42" r="29" />
      <path d="M80 17v4M105 42h-4M80 67v-4M55 42h4" strokeWidth="1.4" />
      <path
        d="M80 6a36 36 0 1 1-36 36"
        className="hcard__gold hcard__sweep"
        strokeWidth="3"
        pathLength="100"
      />
      <text x="74.5" y="51.5" textAnchor="middle" className="hcard__num" stroke="none">6</text>
      <text x="88" y="51.5" textAnchor="middle" className="hcard__unit" stroke="none">h</text>
    </Art>
  );
}

/** Two speech marks that overlap — the same conversation in both languages. */
function ArtTalk() {
  return (
    <Art>
      <path d="M26 8h56a9 9 0 0 1 9 9v19a9 9 0 0 1-9 9H44l-11 9v-9h-7a9 9 0 0 1-9-9V17a9 9 0 0 1 9-9z" />
      <text x="54" y="33.5" textAnchor="middle" className="hcard__cjk" stroke="none">你好</text>
      <path
        d="M78 32h56a9 9 0 0 1 9 9v19a9 9 0 0 1-9 9h-7v9l-11-9H78a9 9 0 0 1-9-9V41a9 9 0 0 1 9-9z"
        className="hcard__goldwash"
      />
      <text x="106" y="57.5" textAnchor="middle" className="hcard__latin" stroke="none">Hello</text>
    </Art>
  );
}

/** A signed, sealed letter — the thing itself, made for one student. */
function ArtLetter() {
  return (
    <Art>
      <rect x="44" y="5" width="62" height="74" rx="3" />
      <path d="M53 17h20" strokeWidth="2.6" />
      <path d="M53 28h44M53 36h44M53 44h30" strokeWidth="1.3" opacity="0.55" />
      <path d="M53 65c3.5-9 6.5-9.5 7.5-2 .8 5.5 3.6-6.5 7.6-6.5s2.4 8.5 8.4 4.5" strokeWidth="1.5" />
      <circle cx="107" cy="61" r="15.5" className="hcard__gold" strokeWidth="1.3" strokeDasharray="1.2 3.4" />
      <circle cx="107" cy="61" r="11.5" className="hcard__goldfill" stroke="none" />
      <path d="M101.5 61.5l4 4 7.5-8.5" stroke="#fff" strokeWidth="2" />
    </Art>
  );
}

/**
 * In the order the four hero bullets are written in the dictionary.
 *
 *   d       depth: how strongly the card answers the pointer. Nearer cards
 *           move further, lean further and grow more as they leave.
 *   x, y    where the card rests on a desktop stage, as a share of it
 *   r       its resting tilt on a desktop (phones set their own, smaller)
 *   fx, fy  where it goes when the scene plays: out past the nearest edge
 *   fr      how far it turns on the way
 *   mx, my  the same journey on a phone, where the cards sit in a block
 */
const CARDS = [
  { id: "key",    Art: ArtKey,    d: 1.1, x: "56.5%", y: "15%", r: "-6deg", fx: "-16vw", fy: "-64vh", fr: "-17deg", mx: "-62vw", my: "-20vh" },
  { id: "clock",  Art: ArtClock,  d: 0.8, x: "61%",   y: "54%", r: "4deg",  fx: "-5vw",  fy: "66vh",  fr: "-11deg", mx: "64vw",  my: "-16vh" },
  { id: "talk",   Art: ArtTalk,   d: 1.4, x: "80.5%", y: "48%", r: "-5deg", fx: "34vw",  fy: "52vh",  fr: "15deg",  mx: "-64vw", my: "22vh"  },
  { id: "letter", Art: ArtLetter, d: 0.6, x: "78.5%", y: "7%",  r: "5deg",  fx: "30vw",  fy: "-50vh", fr: "19deg",  mx: "62vw",  my: "24vh"  },
];

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** The sheet starts to rise when the scene is this far through. */
const HANDOVER_AT = 0.8;

/**
 * Turns scrolling and pointer movement into the stage's CSS variables.
 *
 *   --p     0..1  how far the scene has played
 *   --txt   0..1  how far the headline has lifted away
 *   --fly   0..1  how far the cards have travelled
 *   --gone  0..1  how far the cards have faded
 *   --mx, --my  -1..1  the pointer, eased, measured from the stage's centre
 */
function useHeroMotion(wrapRef, stageRef) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    // The stylesheet already lays the hero out as an ordinary section for
    // these readers. Attaching nothing is the whole of their code path.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const header = document.querySelector(".nav");
    const next = document.getElementById("what");
    const metrics = { stick: 73, run: 1, span: 1 };

    /* ---- scroll ---------------------------------------------------- */
    let scrollFrame = 0;
    let last = "";
    const play = () => {
      scrollFrame = 0;
      const scrolled = metrics.stick - wrap.getBoundingClientRect().top;
      // Well past the hero the stage is off screen. Leave it as it is.
      if (scrolled > metrics.span + 400) return;

      const p = clamp01(scrolled / (metrics.run / HANDOVER_AT));
      const lift = clamp01(p / 0.5);
      const txt = 1 - (1 - lift) * (1 - lift);
      const fly = Math.pow(clamp01(p / 0.9), 1.5);
      const gone = clamp01((p - 0.4) / 0.4);

      const key = `${p.toFixed(3)}|${txt.toFixed(3)}|${fly.toFixed(3)}|${gone.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const s = stage.style;
      s.setProperty("--p", p.toFixed(3));
      s.setProperty("--txt", txt.toFixed(3));
      s.setProperty("--fly", fly.toFixed(3));
      s.setProperty("--gone", gone.toFixed(3));
      // Faded text must not stay clickable, or reachable by Tab.
      if (txt > 0.985) stage.setAttribute("data-away", "");
      else stage.removeAttribute("data-away");
      // The cards leave later than the text does, so they get their own flag.
      if (gone > 0.985) stage.setAttribute("data-clear", "");
      else stage.removeAttribute("data-clear");
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(play);
    };

    /* ---- layout, measured once per resize, never per frame ---------- */
    const measure = () => {
      const navH = header ? header.offsetHeight : 73;
      if (navH !== 73) document.documentElement.style.setProperty("--nav-h", `${navH}px`);
      // A stage taller than the screen pins by its bottom edge: it is let
      // scroll until its last line is in view, and held there.
      const minH = parseFloat(getComputedStyle(stage).minHeight) || 0;
      const over = Math.max(0, stage.offsetHeight - minH);
      metrics.stick = navH - over;
      stage.style.setProperty("--hero-stick", `${metrics.stick}px`);

      // The pinned distance is the section's extra height. The last part of
      // it belongs to the next section, which is pulled up over the stage.
      const pin = wrap.offsetHeight - stage.offsetHeight;
      const cover = next ? Math.max(0, -(parseFloat(getComputedStyle(next).marginTop) || 0)) : 0;
      metrics.run = Math.max(1, pin - cover);
      metrics.span = pin;
      onScroll();
    };

    /* ---- pointer --------------------------------------------------- */
    let pointerFrame = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const ease = () => {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      stage.style.setProperty("--mx", cx.toFixed(3));
      stage.style.setProperty("--my", cy.toFixed(3));
      // Stop when it has arrived, so an idle page runs no frames at all.
      pointerFrame =
        Math.abs(tx - cx) + Math.abs(ty - cy) > 0.003 ? requestAnimationFrame(ease) : 0;
    };
    const onPointer = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      if (r.bottom < 0) return;
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      if (!pointerFrame) pointerFrame = requestAnimationFrame(ease);
    };
    const onLeave = () => {
      tx = 0; ty = 0;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(ease);
    };
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---- rest when out of sight ------------------------------------- */
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) stage.removeAttribute("data-idle");
        else stage.setAttribute("data-idle", "");
      });
      io.observe(stage);
    }
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(stage);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    if (finePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
    };
  }, [wrapRef, stageRef]);
}

function MultiLine({ text }) {
  const parts = text.split("\n");
  return parts.map((line, i) => (
    <span key={i}>
      {line}
      {i < parts.length - 1 && <br />}
    </span>
  ));
}

export default function HeroStage() {
  const { t } = useI18n();
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  useHeroMotion(wrapRef, stageRef);

  return (
    <section className="hero" ref={wrapRef}>
      <div className="hero__stage" ref={stageRef}>
        <HeroPhoto />

        <div className="container hero__inner">
          <div className="hero__text">
            <span className="hero__rule" aria-hidden="true" />
            <Reveal immediate className="reveal--lift"><p className="eyebrow">{t.hero.eyebrow}</p></Reveal>
            <Reveal immediate className="reveal--lift" delay={90}><h1><MultiLine text={t.hero.title} /></h1></Reveal>
            <Reveal immediate className="reveal--lift" delay={180}><p className="hero__lead">{t.hero.lead}</p></Reveal>
            <Reveal immediate className="reveal--lift hero__actions" delay={270}>
              {/* The first thing on the first page is the thing we want them
                  to do. It leaves for the portal rather than routing through
                  an enquiry form: someone who has decided should not have to
                  ask us first. */}
              <a href={PORTAL_SIGNUP_URL} className="btn btn--gold">{t.hero.ctaApply}</a>
              {/* Down to the next screen, not away to another page. */}
              <a href="#what" className="btn btn--on-dark">{t.hero.ctaLearn}</a>
            </Reveal>
          </div>
        </div>

        {/* The four promises. A real list, in the reading order, whatever
            the stylesheet does with where each one sits. */}
        <ul className="hero__cards">
          {t.hero.bullets.map((b, i) => {
            const c = CARDS[i % CARDS.length];
            const Drawing = c.Art;
            return (
              <li
                key={c.id}
                className={`hcard hcard--${c.id}`}
                style={{
                  "--k": i, "--d": c.d, "--x": c.x, "--y": c.y, "--r": c.r,
                  "--fx": c.fx, "--fy": c.fy, "--fr": c.fr, "--mfx": c.mx, "--mfy": c.my,
                }}
              >
                <div className="hcard__in">
                  <div className="hcard__bob">
                    <div className="hcard__body">
                      <div className="hcard__art"><Drawing /></div>
                      <p className="hcard__text">{b}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ---- The section and its pinned stage ------------------------- */
        /* --hero-cover is one screen below the nav: the height the stage
           fills, and the distance the next section is pulled up to slide
           over it. Small-viewport units where they exist, so nothing here
           changes size when a phone's address bar comes and goes.
           --hero-run is the scroll the scene plays over before that. */
        :root {
          --nav-h: 73px;
          --hero-cover: calc(100vh - var(--nav-h));
          --hero-run: 68vh;
        }
        @supports (height: 100svh) {
          :root { --hero-cover: calc(100svh - var(--nav-h)); }
        }

        .hero {
          position: relative;
          background: var(--navy-deep);
        }
        /* The room the stage is held in. It has to be content, not padding:
           a sticky box can only travel inside its parent's content area. */
        .hero::after {
          content: ""; display: block;
          height: calc(var(--hero-cover) + var(--hero-run));
        }
        .hero__stage {
          --p: 0; --txt: 0; --fly: 0; --gone: 0; --mx: 0; --my: 0;
          position: sticky; top: var(--hero-stick, var(--nav-h));
          min-height: var(--hero-cover);
          display: flex; flex-direction: column; justify-content: center;
          overflow: hidden;
          background: var(--navy-deep);
        }

        /* The next section rises over the held stage like a sheet laid on
           top of it. It needs its own ground to do that, and a shadow so
           the edge reads as paper above a picture. */
        .hero-next {
          position: relative; z-index: 2;
          background: var(--paper);
          margin-top: calc(-1 * var(--hero-cover));
          scroll-margin-top: var(--nav-h);
          box-shadow: 0 -1px 0 rgba(200,162,74,0.55), 0 -28px 56px -18px rgba(8,12,30,0.5);
        }

        /* ---- Text ------------------------------------------------------ */
        .hero__inner {
          position: relative; z-index: 4;
          padding-top: clamp(28px, 6vh, 72px);
          padding-bottom: clamp(28px, 6vh, 72px);
          opacity: calc(1 - var(--txt));
          transform: translate3d(0, calc(var(--txt) * -56px), 0);
        }
        .hero__stage[data-away] .hero__inner,
        .hero__stage[data-clear] .hero__cards { visibility: hidden; }

        /* The headline is not reading matter, so it gets a wider column
           than the lead does. */
        .hero__text { max-width: 760px; }
        .hero__rule {
          display: block; width: 72px; height: 2px;
          background: var(--gold); margin-bottom: var(--sp-6);
          transform-origin: left center;
        }
        .hero h1 { color: #fff; margin: var(--sp-4) 0 var(--sp-5); }
        .hero__lead {
          color: rgba(255,255,255,0.84);
          font-size: var(--step-1); max-width: 46ch;
        }
        .hero__actions { display: flex; gap: var(--sp-3); flex-wrap: wrap; margin-top: var(--sp-7); }

        /* One orchestrated entrance: the rule draws, the text rises behind
           it, and the cards arrive last from the edges they will leave by. */
        .hero__rule { animation: drawRule 620ms var(--ease) 80ms both; }
        .hero__text > *:not(.hero__rule) { animation: riseIn 620ms var(--ease) both; }
        .hero__text > *:nth-child(2) { animation-delay: 220ms; }
        .hero__text > *:nth-child(3) { animation-delay: 310ms; }
        .hero__text > *:nth-child(4) { animation-delay: 400ms; }
        .hero__text > *:nth-child(5) { animation-delay: 480ms; }

        /* ---- Cards ----------------------------------------------------- */
        /* Four nested boxes, one job each, so no two movements ever have to
           share a transform:
             li          where it is, the pointer drift, the flight out
             __in        the entrance, and the lift under the cursor
             __bob       the idle float
             __body      the paper itself, and its lean toward the pointer */
        .hero__cards { list-style: none; margin: 0; padding: 0; }
        .hcard {
          opacity: calc(1 - var(--gone));
          transform:
            translate3d(
              calc(var(--fly) * var(--tx) + var(--mx) * var(--d) * -18px),
              calc(var(--fly) * var(--ty) + var(--my) * var(--d) * -13px), 0)
            rotate(calc(var(--rot) + var(--fly) * var(--fr)))
            scale(calc(1 + var(--fly) * var(--d) * 0.28));
          will-change: transform, opacity;
        }
        .hcard__in {
          animation: hcardIn 900ms var(--ease) backwards;
          animation-delay: calc(640ms + var(--k) * 110ms);
          transition: transform 380ms var(--ease);
        }
        @keyframes hcardIn {
          from {
            opacity: 0;
            transform:
              translate3d(calc(var(--tx) * 0.16), calc(var(--ty) * 0.16), 0)
              rotate(calc(var(--fr) * 0.5)) scale(0.94);
          }
          to { opacity: 1; transform: none; }
        }
        .hcard__bob {
          animation: hcardBob calc(6.5s + var(--k) * 0.9s) ease-in-out infinite alternate;
          animation-delay: calc(var(--k) * -1.9s);
        }
        @keyframes hcardBob {
          from { transform: translate3d(0, -5px, 0) rotate(-0.7deg); }
          to   { transform: translate3d(0, 6px, 0) rotate(0.7deg); }
        }
        .hero__stage[data-idle] .hcard__bob,
        .hero__stage[data-clear] .hcard__bob { animation-play-state: paused; }

        .hcard__body {
          background: var(--surface);
          border-radius: var(--radius);
          padding: 12px 14px 15px;
          color: var(--ink);
          box-shadow:
            0 0 0 1px rgba(16,24,44,0.06),
            0 2px 5px rgba(6,10,28,0.28),
            0 30px 46px -22px rgba(6,10,28,0.8);
          transform:
            perspective(760px)
            rotateX(calc(var(--my) * var(--d) * 5deg))
            rotateY(calc(var(--mx) * var(--d) * -6deg));
          transition: box-shadow 380ms var(--ease);
        }
        .hcard__art {
          display: grid; place-items: center;
          height: 96px; border-radius: 6px;
          background: rgba(27,42,87,0.045);
          color: var(--navy);
        }
        .hcard__svg { display: block; height: 78px; width: auto; max-width: 100%; }
        .hcard__gold { stroke: var(--gold); }
        .hcard__goldfill { fill: var(--gold); stroke: var(--gold); }
        .hcard__goldwash { fill: #F6EFDC; stroke: var(--gold); }
        .hcard__paperfill { fill: #F5F6FA; }
        .hcard__num, .hcard__unit, .hcard__latin {
          font-family: var(--font-display); fill: var(--navy); font-weight: 500;
        }
        .hcard__num { font-size: 27px; letter-spacing: -0.02em; }
        .hcard__unit { font-size: 15px; }
        .hcard__latin { font-size: 19px; }
        .hcard__cjk {
          font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
          font-size: 17px; font-weight: 500; fill: var(--navy);
        }
        /* The gold arc winds on once, as the card arrives. */
        .hcard__sweep {
          stroke-dasharray: 100; stroke-dashoffset: 0;
          animation: hcardSweep 1100ms var(--ease) 1150ms backwards;
        }
        @keyframes hcardSweep { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }

        .hcard__text {
          margin-top: 11px;
          font-size: 0.9rem; line-height: 1.36; font-weight: 600;
          color: var(--ink); max-width: none;
          text-wrap: balance;
        }
        :lang(zh) .hcard__text { line-height: 1.5; }

        /* ---- Desktop: the cards stand in the open half of the picture --- */
        @media (min-width: 900px) {
          .hero__cards { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
          .hcard {
            --tx: var(--fx); --ty: var(--fy); --rot: var(--r);
            position: absolute; left: var(--x); top: var(--y);
            width: clamp(170px, 15.6vw, 226px);
            pointer-events: auto;
          }
          .hero__text { max-width: min(760px, 54vw); }
          /* The text column's box runs under the nearest cards. Only the
             words and the buttons take the pointer, so a card under that
             box can still be hovered. */
          .hero__inner { pointer-events: none; }
          .hero__text h1, .hero__text p { width: fit-content; pointer-events: auto; }
          .hero__actions > * { pointer-events: auto; }
        }
        /* Under the cursor a card squares itself up and comes forward: the
           one movement here that is an answer to a deliberate act. */
        @media (hover: hover) and (pointer: fine) {
          .hcard:hover { z-index: 2; }
          .hcard:hover .hcard__in {
            transform: translate3d(0, -6px, 0) rotate(calc(var(--rot) * -1)) scale(1.05);
          }
          .hcard:hover .hcard__body {
            box-shadow:
              0 0 0 1px rgba(200,162,74,0.55),
              0 4px 8px rgba(6,10,28,0.3),
              0 40px 60px -22px rgba(6,10,28,0.9);
          }
        }
        /* A short desktop window: tighter cards rather than a clipped row. */
        @media (min-width: 900px) and (max-height: 700px) {
          .hcard__art { height: 76px; }
          .hcard__svg { height: 62px; }
          .hcard__text { font-size: 0.84rem; margin-top: 9px; }
          .hcard--clock, .hcard--talk { margin-top: 12px; }
        }

        /* ---- Phones and tablets: the same four, in a block ------------- */
        @media (max-width: 899px) {
          :root { --hero-run: 58vh; }
          .hero__inner { padding-top: 28px; padding-bottom: 0; }
          .hero__text { max-width: none; }
          .hero__rule { margin-bottom: var(--sp-5); }
          .hero h1 { margin: var(--sp-3) 0 var(--sp-4); }
          .hero__actions { margin-top: var(--sp-5); }
          .hero__cards {
            position: relative; z-index: 3;
            width: 100%; max-width: 560px;
            display: grid; grid-template-columns: 1fr 1fr; gap: 12px 12px;
            padding: 26px var(--sp-5) 30px;
          }
          .hcard { --tx: var(--mfx); --ty: var(--mfy); }
          .hcard:nth-child(odd)  { --rot: -1.6deg; }
          .hcard:nth-child(even) { --rot: 1.4deg; margin-top: 10px; margin-bottom: -10px; }
          .hcard, .hcard__in, .hcard__bob, .hcard__body { height: 100%; }
          .hcard__body {
            padding: 9px 10px 11px;
            transform: none;
            box-shadow:
              0 0 0 1px rgba(16,24,44,0.06),
              0 2px 4px rgba(6,10,28,0.26),
              0 18px 26px -16px rgba(6,10,28,0.8);
          }
          .hcard__art { height: 52px; border-radius: 5px; }
          .hcard__svg { height: 44px; }
          .hcard__text { margin-top: 7px; font-size: 0.8rem; line-height: 1.3; }
          :lang(zh) .hcard__text { line-height: 1.42; }
        }
        @media (max-width: 599px) {
          .hero__inner { padding-top: 22px; }
          .hero__rule { margin-bottom: var(--sp-4); }
          .hero__lead { font-size: 1rem; line-height: 1.55; }
        }
        @media (min-width: 600px) and (max-width: 899px) {
          .hero__cards { max-width: 640px; gap: 16px; }
          .hcard__art { height: 72px; }
          .hcard__svg { height: 60px; }
          .hcard__text { font-size: 0.9rem; }
        }

        /* ---- Reduced motion: an ordinary section, everything in place --- */
        @media (prefers-reduced-motion: reduce) {
          .hero::after { content: none; }
          .hero__stage { position: relative; top: auto; }
          .hero-next { margin-top: 0; box-shadow: none; }
          .hero__rule, .hero__text > *, .hcard__in, .hcard__bob, .hcard__sweep { animation: none; }
          .hcard, .hcard__body { will-change: auto; }
        }
      ` }} />
    </section>
  );
}
