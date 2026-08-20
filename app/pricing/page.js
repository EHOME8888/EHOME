"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";

export default function Pricing() {
  const { t } = useI18n();
  const p = t.pricing;

  return (
    <>
      <section className="section">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{p.eyebrow}</p>
            <h1>{p.title}</h1>
            <p className="lead">{p.lead}</p>
          </Reveal>

          <div className="tiers">
            {p.tiers.map((tier, i) => {
              const featured = i === 1;
              return (
                <Reveal as="article" key={tier.name} delay={i * 110} className={`tier ${featured ? "tier--featured" : ""}`}>
                  {featured && <span className="tier__badge">{p.popular}</span>}
                  <h3 className="tier__name">{tier.name}</h3>
                  <p className="tier__for">{tier.for}</p>
                  <div className="tier__price">
                    <strong>{tier.price}</strong>
                    <span>{p.unit}</span>
                  </div>
                  <ul>
                    {tier.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`btn ${featured ? "btn--gold" : "btn--ghost"} tier__cta`}
                  >
                    {p.cta}
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <p className="tiers__note">{p.note}</p>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .sec-head h1 { margin-top: 12px; }
        .tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; align-items: stretch; }
        .tier {
          position: relative; display: flex; flex-direction: column;
          background: var(--surface); border: 1px solid var(--line);
          border-radius: 18px; padding: 34px 30px;
        }
        .tier--featured { border-color: var(--brand); box-shadow: 0 18px 40px -24px rgba(18,35,63,0.4); }
        .tier__badge {
          position: absolute; top: -12px; left: 30px;
          background: var(--gold); color: #21160a; font-size: 0.76rem;
          font-weight: 700; letter-spacing: 0.04em; padding: 5px 12px; border-radius: 999px;
        }
        .tier__name { color: var(--brand); font-size: 1.3rem; }
        .tier__for { color: var(--muted); margin-top: 6px; }
        .tier__price {
          display: flex; align-items: baseline; gap: 8px;
          margin: 22px 0; padding-bottom: 22px; border-bottom: 1px solid var(--line);
        }
        .tier__price strong { font-family: var(--font-display); font-size: 3rem; color: var(--ink); font-weight: 500; }
        .tier__price span { color: var(--muted); font-size: 0.95rem; }
        .tier ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; flex: 1; }
        .tier li { position: relative; padding-left: 26px; color: var(--ink); }
        .tier li::before {
          content: "✓"; position: absolute; left: 0; color: var(--gold); font-weight: 700;
        }
        .tier__cta { justify-content: center; }
        .tiers__note { margin-top: 26px; color: var(--muted); font-size: 0.9rem; }
        @media (max-width: 860px) { .tiers { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
