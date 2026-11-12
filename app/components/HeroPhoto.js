"use client";
// app/components/HeroPhoto.js
//
// The hero's visual layers. Five layers, back to front:
//
//   1. navy            — painted by CSS, so there is never a white frame
//   2. skyline SVG     — the existing lightweight artwork, and the fallback
//                        if the photograph is missing or fails to load
//   3. the photograph  — next/image, priority, Ken Burns
//   4. bottom-up navy  — sets the mood and never moves
//   5. left-hand navy  — carries the white text's contrast, and lifts as the
//                        text leaves so the bridge is seen whole
//
// Why layer 2 exists: a hero that renders flat navy until a JPEG arrives is
// worse than the artwork we already have. If the file 404s the <img> hides
// itself and the skyline shows through, so the page is never broken by a
// missing asset.
//
// This component owns no listeners. HeroStage writes three numbers onto the
// stage as CSS variables — how far the scene has played (--p), how far the
// text has gone (--txt) and where the pointer is (--mx, --my) — and the
// layers here read them. Transform and opacity only, no layout properties,
// no background-attachment: fixed (which WeChat's WebView and iOS Safari
// get wrong).
import { useState } from "react";
import Image from "next/image";

/** The photograph. Absence is handled. */
const HERO_SRC = "/images/hero-towerbridge.jpg";

export default function HeroPhoto() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <>
      {/* 2. the fallback artwork, always present and nearly free */}
      <img src="/hero-skyline.svg" alt="" className="hero__bg" aria-hidden="true" />

      {/* 3. the drift wrapper holds the Ken Burns wrapper holds the photo.
          Two nested transforms rather than one, so the slow breathing and
          the scene's own movement never have to be reconciled. */}
      <div className="hero__parallax" aria-hidden="true">
        <div className="hero__ken">
          {!photoFailed && (
            <Image
              src={HERO_SRC}
              alt=""
              fill
              priority
              sizes="(max-width: 899px) 150vh, 100vw"
              quality={78}
              className="hero__photo"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>
      </div>

      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />

      <style dangerouslySetInnerHTML={{ __html: `
        .hero__bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0;
        }

        /* A little larger than the stage on every side, so neither the
           pointer drift nor the slow push-in can expose an edge. Every
           percent of overhang at the top is a percent of the photograph
           hidden — and the top of this photograph is where the spires are —
           so the margin is kept small. */
        .hero__parallax {
          position: absolute; inset: -3% -1.5% -1.5% -1.5%; z-index: 1;
          will-change: transform;
          /* Against the pointer and well behind the cards, so the bridge
             reads as the far plane. The push-in is tied to the scroll. */
          transform:
            translate3d(calc(var(--mx, 0) * -9px), calc(var(--my, 0) * -6px), 0)
            scale(calc(1 + var(--p, 0) * 0.06));
        }
        .hero__ken { position: absolute; inset: 0; }
        .hero__photo {
          object-fit: cover;
          /* Bias the frame upward: sky and spires in, a band of water out. */
          object-position: 50% 34%;
        }

        /* Slow, and alternate rather than looping, so it breathes instead of
           snapping back. Scaled about a point near the top, so the zoom
           takes its crop out of the water and the skyline stays put. */
        @keyframes heroKenBurns {
          from { transform: scale(1.02) translate3d(0, 0, 0); }
          to   { transform: scale(1.07) translate3d(-1.1%, -0.6%, 0); }
        }
        .hero__ken {
          transform-origin: 50% 12%;
          animation: heroKenBurns 22s ease-in-out infinite alternate;
          will-change: transform;
        }

        /* Bottom-up. Finishes at solid navy on the last pixel, so the stage
           meets the navy ground beneath it without a visible edge. */
        .hero__overlay {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(to top,
            rgba(20,31,66,1) 0%,
            rgba(20,31,66,0.9) 6%,
            rgba(20,31,66,0.42) 46%,
            rgba(20,31,66,0.12) 100%);
        }
        /* Left to right. Behind the headline the two passes combine to about
           0.96 navy, which keeps white text over 10:1 against anything the
           photograph can do, including the pale sky. It thins as the text
           goes, never to nothing: the picture stays a night picture. */
        .hero__scrim {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(96deg,
            rgba(20,31,66,0.95) 0%,
            rgba(20,31,66,0.82) 40%,
            rgba(20,31,66,0.34) 72%,
            rgba(20,31,66,0.04) 100%);
          opacity: calc(1 - var(--txt, 0) * 0.72);
        }

        /* Phones: no drift and no push-in, one static frame. Nothing large
           to composite on every scroll frame, which is where a mid-range
           Android inside WeChat drops them. The picture is cropped sideways
           here, so it is nudged left to hold the near tower and the span. */
        @media (max-width: 899px) {
          .hero__ken { animation: none; transform: scale(1.02); transform-origin: 50% 50%; }
          .hero__parallax { inset: 0; transform: none; will-change: auto; }
          .hero__photo { object-position: 42% 38%; }
          /* The text runs the full width here, so the contrast pass does too. */
          .hero__scrim {
            background: linear-gradient(to bottom,
              rgba(20,31,66,0.78) 0%,
              rgba(20,31,66,0.7) 55%,
              rgba(20,31,66,0.5) 100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero__ken { animation: none; transform: none; }
          .hero__parallax { inset: 0; transform: none; will-change: auto; }
          .hero__scrim { opacity: 1; }
        }
      ` }} />
    </>
  );
}
