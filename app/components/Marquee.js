"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/**
 * One row of cards that rolls sideways without an end. The university
 * logos and the student reviews both use it.
 *
 * The row is the same set of cards several times over, moved left by
 * exactly one set and then started again, so the join never shows. What is
 * left after one set has gone has to be wider than the screen, which is
 * what `copies` is for: a short set needs more of them.
 *
 * Only the first set is real to a screen reader. The rest are copies for
 * the eye: hidden from it, and `renderItem` is told so it can drop alt text.
 *
 * Things that move by themselves need a way to be stopped. There is a
 * pause button; pointing at the row holds it; a finger on the row holds it
 * and for a few seconds after, long enough to finish reading a card. It
 * stops by itself while off screen. With reduced motion there is no
 * rolling at all: the cards are laid out as a plain grid.
 */
const HOLD_AFTER_TOUCH_MS = 3000;

export default function Marquee({
  items,
  renderItem,
  itemKey,
  itemClassName = "",
  variant,
  copies = 3,
  pauseLabel,
  playLabel,
  children,
}) {
  const ref = useRef(null);
  const holdTimer = useRef(0);
  const [paused, setPaused] = useState(false);
  const [idle, setIdle] = useState(false);
  const [held, setHeld] = useState(false);
  // The button does nothing until the page is interactive, so it is not
  // shown until then.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setIdle(!e.isIntersecting)),
      { rootMargin: "80px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(holdTimer.current);
    };
  }, []);

  const onDown = (e) => {
    if (e.pointerType === "mouse") return;
    clearTimeout(holdTimer.current);
    setHeld(true);
  };
  const onUp = (e) => {
    if (e.pointerType === "mouse") return;
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setHeld(false), HOLD_AFTER_TOUCH_MS);
  };

  const sets = Array.from({ length: copies }, (_, i) => i);

  return (
    <div
      className={`mq mq--${variant}`}
      ref={ref}
      style={{ "--mq-n": copies, "--mq-count": items.length }}
      data-paused={paused || held ? "" : undefined}
      data-idle={idle ? "" : undefined}
    >
      <Reveal className="mq__view">
        <div
          className="mq__track"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {sets.map((copy) => (
            <ul className="mq__set" key={copy} aria-hidden={copy > 0 ? "true" : undefined}>
              {items.map((item, i) => (
                <li className={`mq__item ${itemClassName}`.trim()} key={itemKey ? itemKey(item) : i}>
                  {renderItem(item, copy > 0)}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Reveal>

      <div className={`container mq__foot${children ? "" : " mq__foot--solo"}`}>
        {children}
        <button
          type="button"
          className="mq__toggle"
          hidden={!ready}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            {paused ? (
              <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
            ) : (
              <path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z" fill="currentColor" />
            )}
          </svg>
          <span>{paused ? playLabel : pauseLabel}</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .mq {
          --mq-gap: 18px;
          --mq-fade: clamp(24px, 9vw, 160px);
          --mq-per: 6s;      /* seconds each card takes to pass */
          --mq-cols: 4;      /* the still grid, under reduced motion */
        }
        /* Edge to edge, and the only thing that clips the row. The fade at
           each side is a mask, so it works over any background. */
        .mq__view {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 var(--mq-fade), #000 calc(100% - var(--mq-fade)), transparent 100%);
                  mask-image: linear-gradient(90deg, transparent 0, #000 var(--mq-fade), #000 calc(100% - var(--mq-fade)), transparent 100%);
        }
        .mq__track {
          display: flex; width: max-content;
          animation: mqRoll calc(var(--mq-count) * var(--mq-per)) linear infinite;
          will-change: transform;
        }
        /* Each card carries its own trailing space, so a set is an exact
           fraction of the track and the loop lands on itself. */
        .mq__set { display: flex; flex: none; list-style: none; margin: 0; padding: 0; }
        .mq__item { flex: none; margin-right: var(--mq-gap); }

        @keyframes mqRoll { to { transform: translate3d(calc(-100% / var(--mq-n)), 0, 0); } }

        .mq[data-paused] .mq__track,
        .mq[data-idle] .mq__track { animation-play-state: paused; }
        @media (hover: hover) {
          .mq__view:hover .mq__track { animation-play-state: paused; }
        }

        .mq__foot {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: var(--sp-2) var(--sp-5); margin-top: var(--sp-5);
        }
        .mq__foot--solo { justify-content: flex-end; margin-top: var(--sp-4); }
        .mq__toggle {
          display: inline-flex; align-items: center; gap: var(--sp-2);
          min-height: 44px; padding: 0; border: 0; border-radius: 4px; background: transparent;
          font: inherit; font-size: 0.92rem; color: var(--muted); cursor: pointer;
          outline-offset: 4px; transition: color 0.2s ease;
        }
        .mq__toggle:hover { color: var(--brand); }
        .mq__toggle[hidden] { display: none; }

        /* ---- University logos ---- */
        .mq--logos { --mq-per: 5.75s; }
        .mq--logos .uni {
          display: flex; align-items: center; justify-content: center;
          width: clamp(168px, 17vw, 232px); height: clamp(104px, 10vw, 128px);
          padding: clamp(16px, 2vw, 24px);
          border: 1px solid var(--line); border-radius: var(--radius); background: #ffffff;
          transition: border-color 0.2s ease;
        }
        .mq--logos .uni:hover { border-color: var(--gold); }
        .mq--logos .uni__logo {
          max-height: min(66px, 100%); max-width: 100%; width: auto; height: auto;
          user-select: none; -webkit-user-drag: none;
        }

        /* ---- Reviews: words, so slower than the logos ---- */
        .mq--reviews { --mq-gap: 24px; --mq-per: 15s; --mq-cols: 3; }
        .mq--reviews .tm { width: min(400px, 78vw); }

        @media (max-width: 599px) {
          .mq { --mq-gap: 12px; }
          .mq--logos { --mq-per: 4.25s; }
          .mq--reviews { --mq-gap: 14px; --mq-per: 12s; }
        }
        @media (max-width: 820px) {
          .mq--logos { --mq-cols: 2; }
          .mq--reviews { --mq-cols: 1; }
        }

        /* No rolling: a plain grid, one set, nothing hidden at the sides. */
        @media (prefers-reduced-motion: reduce) {
          .mq__view {
            max-width: var(--maxw); margin: 0 auto; padding: 0 var(--sp-5);
            -webkit-mask-image: none; mask-image: none;
          }
          .mq__track { display: block; width: auto; animation: none; will-change: auto; }
          .mq__set { display: grid; grid-template-columns: repeat(var(--mq-cols), 1fr); gap: var(--mq-gap); }
          .mq__set[aria-hidden] { display: none; }
          .mq__item { margin-right: 0; }
          .mq--logos .uni { width: auto; height: 128px; }
          .mq--reviews .tm { width: auto; }
          .mq__foot--solo, .mq__toggle { display: none; }
        }
      ` }} />
    </div>
  );
}
