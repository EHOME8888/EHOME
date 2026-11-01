"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";
import IconDisc from "../components/IconDisc";
import { IconDocument, IconFinance, IconFee, IconSign, IconBilingual, IconPeople } from "../components/icons";

// Why landlords ask: a box on their form, foreign income, paying up front.
const WHY_ICONS = [IconDocument, IconFinance, IconFee];
// What Ehome does: a formal deed, your existing documents, two languages,
// dealing with us directly.
const DO_ICONS = [IconSign, IconDocument, IconBilingual, IconPeople];

export default function Students() {
  const { t } = useI18n();
  const s = t.students;

  return (
    <>
      <section className="section">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{s.eyebrow}</p>
            <h1>{s.title}</h1>
            <p className="lead">{s.intro}</p>
          </Reveal>

          <Reveal><h2 className="stu-h">{s.whyTitle}</h2></Reveal>
          <div className="stu-grid">
            {s.why.map((w, i) => (
              <Reveal key={w.t} delay={i * 70} className="stu-card">
                <IconDisc icon={WHY_ICONS[i % WHY_ICONS.length]} size="md" className="stu-card__icon" />
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="stu-do">
            <h2 className="stu-h">{s.doTitle}</h2>
            <ul className="stu-list">
              {s.do.map((d, i) => (
                <li key={d}>
                  <IconDisc icon={DO_ICONS[i % DO_ICONS.length]} size="sm" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <p className="stu-note">{s.guaranteeNote}</p>
          </Reveal>

          <Reveal className="stu-cta">
            <Link href="/apply" className="btn btn--primary">{s.cta}</Link>
            <Link href="/process" className="btn btn--ghost">{s.ctaAlt}</Link>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .sec-head h1 { margin-top: 12px; }
        .stu-h { font-size: 1.5rem; margin: 56px 0 24px; }
        .stu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .stu-card { background: var(--surface); border: 1px solid var(--line);
          border-radius: var(--radius); padding: 24px; }
        .stu-card h3 { color: var(--brand); margin-bottom: 8px; }
        .stu-card p { color: var(--muted); }
        .stu-do { margin-top: 16px; background: var(--surface); border: 1px solid var(--line);
          border-radius: var(--radius); padding: 8px 28px 28px; }
        .stu-do .stu-h { margin-top: 28px; }
        .stu-card__icon { margin-bottom: 16px; }
        .stu-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; max-width: 72ch; }
        .stu-list li { display: flex; align-items: flex-start; gap: 14px; }
        .stu-list li .icon-disc { margin-top: -2px; }
        .stu-note { margin-top: 20px; font-size: 0.86rem; color: var(--muted);
          border-left: 2px solid var(--gold-soft); padding-left: 12px; }
        .stu-cta { margin-top: 40px; display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 820px) { .stu-grid { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
