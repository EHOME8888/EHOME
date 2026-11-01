"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";
import IconDisc from "../components/IconDisc";
import {
  IconDocument, IconIdentity, IconAssess, IconFast, IconSign,
  IconStudent, IconHome, IconFinance, IconPeople, IconConfidential,
} from "../components/icons";

// Apply, Verify, Assess, Decide, Guarantee.
const STEP_ICONS = [IconDocument, IconIdentity, IconAssess, IconFast, IconSign];
// Passport, university, property, financial evidence, sponsor.
const NEED_ICONS = [IconIdentity, IconStudent, IconHome, IconFinance, IconPeople];
// Identity, financial strength, sponsor review, fraud checks.
const CHECK_ICONS = [IconIdentity, IconFinance, IconPeople, IconAssess];

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
                <IconDisc icon={STEP_ICONS[i % STEP_ICONS.length]} size="md" />
                <div>
                  <span className="proc-step__n">{s.n}</span>
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
                {p.need.map((n, i) => (
                  <li key={n}>
                    <IconDisc icon={NEED_ICONS[i % NEED_ICONS.length]} size="sm" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="proc-card">
              <h2 className="proc-h">{p.checksTitle}</h2>
              <div className="proc-checks">
                {p.checks.map((c, i) => (
                  <div key={c.t} className="proc-check">
                    <IconDisc icon={CHECK_ICONS[i % CHECK_ICONS.length]} size="md" />
                    <div>
                      <h3>{c.t}</h3>
                      <p>{c.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Data note */}
          <Reveal className="proc-data">
            <div className="proc-data__head">
              <IconDisc icon={IconConfidential} size="md" />
              <h2 className="proc-h">{p.dataTitle}</h2>
            </div>
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
        /* The ring now carries the icon; the number becomes a small caption
           above the title, so the step keeps its order without two badges. */
        .proc-step__n { display: block; font-size: 0.76rem; letter-spacing: 0.12em; color: var(--gold); margin-bottom: 4px; }
        .proc-step h3 { margin-bottom: 4px; }
        .proc-step p { color: var(--muted); }

        .proc-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .proc-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 8px 28px 28px; }
        .proc-card .proc-h { margin-top: 28px; }
        .proc-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .proc-list li { color: var(--ink); display: flex; align-items: flex-start; gap: 14px; }
        .proc-list li .icon-disc { margin-top: -3px; }
        .proc-checks { display: flex; flex-direction: column; gap: 22px; }
        .proc-check { display: flex; gap: 16px; align-items: flex-start; }
        .proc-check h3 { color: var(--brand); margin-bottom: 4px; }
        .proc-check p { color: var(--muted); }

        .proc-data { margin-top: 40px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 8px 28px 28px; }
        .proc-data__head { display: flex; align-items: center; gap: 14px; }
        .proc-data__head .proc-h { margin: 28px 0 24px; }
        .proc-data__head .icon-disc { margin-top: 4px; }
        .proc-data p { color: var(--muted); max-width: 70ch; }
        .proc-cta { margin-top: 40px; }

        @media (max-width: 820px) { .proc-cols { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
