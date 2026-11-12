"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";
import IconDisc from "../components/IconDisc";
import StudentStory from "../components/StudentStory";
import { IconDocument, IconSign, IconBilingual, IconPeople } from "../components/icons";

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
          <Reveal className="sec-head stu-head">
            <p className="eyebrow">{s.eyebrow}</p>
            <h1>{s.title}</h1>
            <p className="lead">{s.intro}</p>
          </Reveal>
        </div>

        {/* The twenty-second story, as one panel across the whole page:
            a wide cut on desktop, a tall cut on a phone. */}
        <div className="stu-film">
          <StudentStory />
        </div>

        <div className="container">
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
        .stu-head { max-width: 62ch; margin-bottom: var(--sp-7); }
        .stu-film { padding: 0 var(--sp-5); margin-bottom: var(--sp-9); }
        .stu-h { font-size: 1.5rem; margin: 56px 0 24px; }
        .stu-do { background: var(--surface); border: 1px solid var(--line);
          border-radius: var(--radius); padding: 8px 28px 28px; }
        .stu-do .stu-h { margin-top: 28px; }
        .stu-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; max-width: 72ch; }
        .stu-list li { display: flex; align-items: flex-start; gap: 14px; }
        .stu-list li .icon-disc { margin-top: -2px; }
        .stu-note { margin-top: 20px; font-size: 0.86rem; color: var(--muted);
          border-left: 2px solid var(--gold-soft); padding-left: 12px; }
        .stu-cta { margin-top: 40px; display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 820px) {
          .stu-head { margin-bottom: var(--sp-6); }
          .stu-film { padding: 0 16px; margin-bottom: var(--sp-8); }
        }
      ` }} />
    </>
  );
}
