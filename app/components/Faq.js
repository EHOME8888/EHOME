"use client";

import { useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "./Reveal";

export default function Faq() {
  const { t } = useI18n();
  const f = t.faq;
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <Reveal className="sec-head">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2>{f.title}</h2>
        </Reveal>

        <div className="faq__list">
          {f.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 50} className="faq__item">
                <button
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{it.q}</span>
                  <span className="faq__icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div className={`faq__a ${isOpen ? "is-open" : ""}`}>
                  <p>{it.a}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .faq__list { max-width: 820px; }
        .faq__item {
          border: 1px solid var(--line); border-radius: var(--radius);
          background: var(--surface); margin-bottom: 12px; overflow: hidden;
        }
        .faq__q {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 20px; text-align: left; padding: 20px 24px; cursor: pointer;
          background: transparent; border: none; font: inherit; font-weight: 600;
          font-size: 1.05rem; color: var(--ink);
        }
        .faq__q:hover { color: var(--brand); }
        .faq__icon {
          flex: none; width: 28px; height: 28px; display: grid; place-items: center;
          border-radius: 999px; background: color-mix(in srgb, var(--gold) 16%, transparent);
          color: var(--brand); font-size: 1.2rem; line-height: 1;
        }
        .faq__a {
          max-height: 0; opacity: 0;
          transition: max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease;
          padding: 0 24px;
        }
        .faq__a.is-open { max-height: 400px; opacity: 1; padding: 0 24px 22px; }
        .faq__a p { color: var(--muted); }
        @media (prefers-reduced-motion: reduce) {
          .faq__a { transition: none; }
        }
      ` }} />
    </section>
  );
}
