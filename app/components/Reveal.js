"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts content into view when it is scrolled to.
 *
 * `delay` staggers siblings. `immediate` is for content that is already on
 * screen when the page loads — the hero — and is the difference between an
 * entrance and a gamble:
 *
 * Everything here starts at opacity 0 and is revealed by JavaScript. For
 * content below the fold that is fine; if the observer never runs, nobody
 * has scrolled to it anyway. For the hero it is not: an IntersectionObserver
 * that fails leaves the first screen blank, and a sizeable share of this
 * audience arrives through WeChat's in-app browser, which is the least
 * predictable WebView any of them will use. `immediate` reveals on the next
 * frame instead of waiting to be observed, so the first screen cannot depend
 * on an API working.
 *
 * Browsers without IntersectionObserver at all show everything at once,
 * which is the right failure: visible and unanimated beats invisible.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  immediate = false,
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate || typeof IntersectionObserver === "undefined") {
      // Next frame, not this one: the element has to be painted at opacity 0
      // first or the transition has nothing to run from.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
