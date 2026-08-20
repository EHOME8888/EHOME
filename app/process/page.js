"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";

export default function Process() {
  const { t } = useI18n();
  const p = t.process;

  return (
    <>
      <section className="section">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{p.eyebrow}</p>
            <h1>{p.title}</h1>
            <p className="lead">{p.intro}</p>
          </Reveal>

          {/* Steps */}
          <Reveal><h2 className="proc-h">{p.stepsTitle}</h2></Reveal>
          <ol className="proc-steps">
            {p.steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 70} className="proc-step">
                <span className="proc-step__n">{s.n}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* Two-column: what you'll need + checks */}
          <div className="proc-cols">
            <Reveal className="proc-card">
              <h2 className="proc-h">{p.needTitle}</h2>
              <ul className="proc-list">
                {p.need.map((n) => (<li key={n}>{n}</li>))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="proc-card">
              <h2 className="proc-h">{p.checksTitle}</h2>
              <div className="proc-checks">
                {p.checks.map((c) => (
                  <div key={c.t} className="proc-check">
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Data note */}
          <Reveal className="proc-data">
            <h2 className="proc-h">{p.dataTitle}</h2>
            <p>{p.dataBody}</p>
          </Reveal>

          <Reveal className="proc-cta">
            <Link href="/contact" className="btn btn--primary">{p.cta}</Link>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .sec-head h1 { margin-top: 12px; }
        .proc-h { font-size: 1.5rem; margin: 56px 0 24px; }
        .proc-steps { list-style: none; padding: 0; display: grid; gap: 16px; }
        .proc-step { display: flex; gap: 18px; align-items: flex-start;
          background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 22px 24px; }
        .proc-step__n { flex: none; display: inline-grid; place-items: center; width: 44px; height: 44px;
          border: 1px solid var(--gold-soft); border-radius: 999px; font-family: var(--font-display); color: var(--gold); }
        .proc-step h3 { margin-bottom: 4px; }
        .proc-step p { color: var(--muted); }

        .proc-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .proc-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 8px 28px 28px; }
        .proc-card .proc-h { margin-top: 28px; }
        .proc-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 12px; }
        .proc-list li { color: var(--ink); }
        .proc-list li::marker { color: var(--gold); }
        .proc-checks { display: flex; flex-direction: column; gap: 18px; }
        .proc-check h3 { color: var(--brand); margin-bottom: 4px; }
        .proc-check p { color: var(--muted); }

        .proc-data { margin-top: 40px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 8px 28px 28px; }
        .proc-data p { color: var(--muted); max-width: 70ch; }
        .proc-cta { margin-top: 40px; }

        @media (max-width: 820px) { .proc-cols { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
