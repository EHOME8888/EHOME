"use client";

import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";
import IconDisc from "../components/IconDisc";
import ProcessThread from "../components/ProcessThread";
import { IconIdentity, IconAssess, IconFinance, IconPeople, IconConfidential } from "../components/icons";

// Identity, financial strength, sponsor review, fraud checks.
const CHECK_ICONS = [IconIdentity, IconFinance, IconPeople, IconAssess];

export default function Process() {
  const { t } = useI18n();
  const p = t.process;

  return (
    <>
      <section className="section">
        <div className="container">
          {/* The thread: title, four steps, what to have ready, two buttons. */}
          <ProcessThread heading="h1" />

          {/* Beneath it: the checks we run, and how the data is handled. */}
          <div className="proc-cols">
            <Reveal className="proc-card">
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
            <Reveal delay={120} className="proc-card proc-data">
              <div className="proc-data__head">
                <IconDisc icon={IconConfidential} size="md" />
                <h2 className="proc-h">{p.dataTitle}</h2>
              </div>
              <p>{p.dataBody}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Two classes, so the size holds against the site's larger section
           headings: these two cards sit below the thread, not beside it. */
        .proc-card .proc-h { font-size: var(--step-3); line-height: 1.2; margin: 28px 0 24px; }
        .proc-cols { margin-top: var(--sp-9); display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        .proc-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 8px 28px 28px; }
        .proc-checks { display: flex; flex-direction: column; gap: 22px; }
        .proc-check { display: flex; gap: 16px; align-items: flex-start; }
        .proc-check h3 { color: var(--brand); margin-bottom: 4px; }
        .proc-check p { color: var(--muted); }
        .proc-data__head { display: flex; align-items: center; gap: 14px; }
        .proc-data__head .icon-disc { margin-top: 4px; }
        .proc-data p { color: var(--muted); }

        @media (max-width: 820px) { .proc-cols { grid-template-columns: 1fr; margin-top: var(--sp-8); } }
      ` }} />
    </>
  );
}
