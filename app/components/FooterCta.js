"use client";
// app/components/FooterCta.js
//
// The photographed "any questions?" band that sits above the footer proper.
//
// It renders inside Footer, and Footer is in app/layout.js, so this appears
// on every page without any page having to import it. That is the whole
// reason it lives here rather than in HomeClient: one place to change, and
// no page can accidentally be left without it.
//
// On /contact the button would be inviting someone to go where they already
// are, so it becomes a way back to the homepage instead. The band itself
// stays — the photograph and the line still do their job there.
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

const PHOTO = "/images/footer-home.jpg";

export default function FooterCta() {
  const { t } = useI18n();
  const c = t.footerCta;
  const pathname = usePathname();
  // "optimised" is the resized copy from the image optimiser. If that request
  // fails, the band falls back to the file as uploaded before it gives up: a
  // single bad response used to take the photograph away for the whole visit,
  // because the footer lives in the layout and keeps its state across pages.
  const [source, setSource] = useState("optimised"); // optimised | original | none
  // Lazy until the page itself has finished loading, then fetched while the
  // browser is idle. Lazy alone meant the request only started once the band
  // was nearly on screen, so anyone who scrolled straight to the bottom met a
  // bare navy band while the photograph was still on its way.
  const [warm, setWarm] = useState(false);
  const onContact = pathname === "/contact";

  useEffect(() => {
    let idle = 0;
    let timer = 0;
    const start = () => {
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(() => setWarm(true), { timeout: 2500 });
      } else {
        timer = window.setTimeout(() => setWarm(true), 800);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="fcta" aria-labelledby="fcta-line">
      {source !== "none" && (
        <Image
          // A new element per source, so the fallback starts from a clean
          // <img> rather than one that has already reported an error.
          key={source}
          src={PHOTO}
          alt=""
          fill
          sizes="100vw"
          quality={74}
          unoptimized={source === "original"}
          // Below the fold on every page, so it must never compete with the
          // hero for bandwidth: nothing is requested before the page's own
          // load has finished.
          loading={warm ? "eager" : "lazy"}
          className="fcta__photo"
          onError={() => setSource((s) => (s === "optimised" ? "original" : "none"))}
        />
      )}
      <div className="fcta__scrim" aria-hidden="true" />

      <div className="container fcta__inner">
        <p className="fcta__line" id="fcta-line">{c.line}</p>
        {onContact ? (
          <Link href="/" className="btn btn--gold">{c.home}</Link>
        ) : (
          <Link href="/contact" className="btn btn--gold">{c.button}</Link>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .fcta {
          position: relative;
          /* Navy underneath, always. If the photograph is slow, missing or
             blocked, the band is a navy band — never a white gap. */
          background: var(--navy-deep);
          overflow: hidden;
          isolation: isolate;
        }
        .fcta__photo {
          object-fit: cover;
          /* The source is a tall interior shot and this is a wide band, so
             the crop is done here rather than baked into the file: at 58%
             the sofa and the kitchen behind it stay in frame, and a phone
             showing a taller band simply sees more of the room. One file,
             framed correctly at every width. */
          object-position: center 58%;
          z-index: 0;
        }
        .fcta__scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(to top,
              rgba(20,31,66,0.93) 0%,
              rgba(20,31,66,0.80) 55%,
              rgba(20,31,66,0.72) 100%);
        }
        .fcta__inner {
          position: relative; z-index: 2;
          padding: var(--section-md) var(--sp-5);
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: var(--sp-6);
        }
        .fcta__line {
          margin: 0; max-width: 30ch;
          color: #fff;
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.6vw, 2.1rem);
          line-height: 1.3;
        }
        @media (max-width: 640px) {
          .fcta__inner { gap: var(--sp-5); }
        }
      ` }} />
    </section>
  );
}
