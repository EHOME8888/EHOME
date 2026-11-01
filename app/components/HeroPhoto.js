"use client";
// app/components/HeroPhoto.js
//
// The hero's visual layers, and the only place on the site that animates by
// itself. Four layers, back to front:
//
//   1. navy            — painted by CSS, so there is never a white frame
//   2. skyline SVG     — the existing lightweight artwork, and the fallback
//                        if the photograph is missing or fails to load
//   3. the photograph  — next/image, priority, Ken Burns
//   4. navy gradient   — carries the white text's contrast
//
// Why layer 2 exists: the photograph is dropped in later, and a hero that
// renders flat navy until someone uploads a JPEG is worse than the hero we
// already have. If the file 404s the <img> hides itself and the skyline
// shows through, so the page is never broken by a missing asset.
//
// Motion is CSS transform and opacity only — no layout properties, no
// background-attachment: fixed (which WeChat's WebView and iOS Safari get
// wrong), no scroll listener that writes to the DOM outside a frame.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** The photograph. Dropped into public/images/ later; absence is handled. */
const HERO_SRC = "/images/hero-towerbridge.jpg";

/**
 * Moves a layer at a fraction of scroll speed.
 *
 * Desktop and full-motion only. On a phone the gain is invisible and the
 * cost is a transform on every frame of a scroll the browser would
 * otherwise hand to the compositor untouched — which is exactly where a
 * mid-range Android inside WeChat drops frames. So it does not run there at
 * all, rather than running weakly.
 */
function useParallax(factor = 0.18) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const allowed =
      window.matchMedia("(min-width: 769px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!allowed) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Only while the hero is on screen. Past it, the work is wasted.
      const top = el.parentElement?.getBoundingClientRect().top ?? 0;
      const height = el.parentElement?.offsetHeight ?? 1;
      if (top < -height) return;
      el.style.transform = `translate3d(0, ${Math.round(-top * factor)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [factor]);

  return ref;
}

export default function HeroPhoto() {
  const parallaxRef = useParallax();
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <>
      {/* 2. the fallback artwork, always present and nearly free */}
      <img src="/hero-skyline.svg" alt="" className="hero__bg" aria-hidden="true" />

      {/* 1+3. parallax wrapper holds the Ken Burns wrapper holds the photo.
          Two nested transforms rather than one, so the slow drift and the
          scroll offset never have to be reconciled in JavaScript. */}
      <div className="hero__parallax" ref={parallaxRef} aria-hidden="true">
        <div className="hero__ken">
          {!photoFailed && (
            <Image
              src={HERO_SRC}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={78}
              className="hero__photo"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      <style dangerouslySetInnerHTML={{ __html: `
        .hero__parallax {
          position: absolute; inset: -8% 0 0 0; z-index: 1;
          will-change: transform;
        }
        .hero__ken { position: absolute; inset: 0; }
        .hero__photo { object-fit: cover; }

        /* Slow, and alternate rather than looping, so it breathes instead of
           snapping back to the start every cycle. The range is deliberately
           under 8%: at this speed the eye should never catch it moving. */
        @keyframes heroKenBurns {
          from { transform: scale(1.04) translate3d(0, 0, 0); }
          to   { transform: scale(1.12) translate3d(-1.4%, -1.2%, 0); }
        }
        .hero__ken {
          animation: heroKenBurns 22s ease-in-out infinite alternate;
          will-change: transform;
        }

        /* Phones: no drift, no parallax, one static slightly-cropped frame.
           Nothing to composite on every scroll frame. */
        @media (max-width: 768px) {
          .hero__ken { animation: none; transform: scale(1.03); }
          .hero__parallax { inset: 0; will-change: auto; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero__ken { animation: none; transform: none; }
          .hero__parallax { inset: 0; transform: none !important; will-change: auto; }
        }
      ` }} />
    </>
  );
}
