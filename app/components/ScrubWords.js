"use client";
// app/components/ScrubWords.js
//
// A heading that is read into view. Its words start faint and come up to
// full strength one after another as the heading is scrolled up the screen,
// so the reader's own movement sets the pace of the sentence.
//
// One way only: once a word has come up it stays up. Scrolling back does
// not dim it again, and when the last word is up the listener is removed.
//
// The faint state exists only while this script is running. Without it,
// and for readers who ask for reduced motion, --r keeps its default of 1
// and the heading is simply there. The two rules it needs are in
// HomeClient.js beside the section that uses it.
import { useEffect, useRef } from "react";

export default function ScrubWords({ text }) {
  const ref = useRef(null);
  // English is taken a word at a time. Chinese has no spaces to split on,
  // so it is taken a character at a time, which reads the same way.
  const spaced = text.includes(" ");
  const units = spaced ? text.split(" ") : Array.from(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let best = -1;
    let frame = 0;
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const update = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      const top = el.getBoundingClientRect().top;
      // Starts as the heading clears the bottom of the screen and is
      // finished by the time it is a little above the middle.
      const r = Math.max(0, Math.min(1, (vh * 0.94 - top) / (vh * 0.46)));
      if (r > best) {
        best = r;
        el.style.setProperty("--r", r.toFixed(3));
      }
      if (best >= 1) stop();
    };
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    if (best < 1) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    return () => {
      stop();
      el.style.removeProperty("--r");
    };
  }, [text]);

  return (
    <span ref={ref} className="scrub" style={{ "--n": units.length }}>
      {units.map((u, i) => (
        <span key={i} className="scrub__u" style={{ "--i": i }}>
          {u}
          {spaced && i < units.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
