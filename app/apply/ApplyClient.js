"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";

const PORTAL_URL = "https://ehome-portal.com";

export default function Apply() {
  const { t } = useI18n();
  const a = t.apply;

  return (
    <>
      <section className="section">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{a.eyebrow}</p>
            <h1>{a.title}</h1>
            <p className="lead">{a.intro}</p>
          </Reveal>

          <Reveal className="apply-cta">
            <a href={PORTAL_URL} className="btn btn--gold apply-cta__btn">{a.portalCta}</a>
            <p className="apply-cta__note">{a.portalNote}</p>
          </Reveal>

          <Reveal><h2 className="apply-h">{a.stepsTitle}</h2></Reveal>
          <ol className="apply-steps">
            {a.steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 70} className="apply-step">
                <span className="apply-step__n">{s.n}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="apply-questions">
            <h2 className="apply-h">{a.questionsTitle}</h2>
            <p>{a.questionsBody}</p>
            <Link href="/contact" className="btn btn--ghost">{a.questionsCta}</Link>
            <p className="apply-note">{a.guaranteeNote}</p>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .sec-head h1 { margin-top: 12px; }
        .apply-h { font-size: 1.5rem; margin: 56px 0 24px; }
        .apply-cta { margin-top: 32px; background: var(--surface); border: 1px solid var(--gold-soft);
          border-radius: var(--radius); padding: 28px; text-align: center; }
        .apply-cta__btn { font-size: 1.05rem; padding: 15px 32px; }
        .apply-cta__note { margin-top: 14px; font-size: 0.84rem; color: var(--muted); }
        .apply-steps { list-style: none; padding: 0; display: grid; gap: 16px; }
        .apply-step { display: flex; gap: 18px; align-items: flex-start;
          background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 22px 24px; }
        .apply-step__n { flex: none; display: inline-grid; place-items: center; width: 44px; height: 44px;
          border: 1px solid var(--gold-soft); border-radius: 999px; font-family: var(--font-display); color: var(--gold); }
        .apply-step h3 { margin-bottom: 4px; }
        .apply-step p { color: var(--muted); }
        .apply-questions { margin-top: 40px; background: var(--surface); border: 1px solid var(--line);
          border-radius: var(--radius); padding: 8px 28px 28px; }
        .apply-questions p { color: var(--muted); max-width: 70ch; margin-bottom: 20px; }
        .apply-note { margin-top: 20px; font-size: 0.86rem; color: var(--muted);
          border-left: 2px solid var(--gold-soft); padding-left: 12px; }
      ` }} />
    </>
  );
}
