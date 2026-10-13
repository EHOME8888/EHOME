"use client";
// app/components/LegalDoc.js
// Renders one legal document in the reader's chosen language, from the
// structured blocks in app/i18n/legal.js. Prose is kept to a narrow measure;
// English is the governing version and says so at the top of every page.
import { useI18n } from "../i18n/LanguageProvider";
import { legal } from "../i18n/legal";

// "**bold**" as used in the source documents.
function inline(text, keyBase) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyBase}-${i}`}>{part}</strong> : part
  );
}

export default function LegalDoc({ doc }) {
  const { lang } = useI18n();
  const L = legal[lang] ?? legal.en;
  const d = L[doc];

  return (
    <section className="section">
      <div className="container legal">
        <h1 className="legal__title">{d.title}</h1>
        <p className="legal__meta">{L.updatedLabel}</p>
        <p className="legal__prevails">{L.prevails}</p>

        {d.blocks.map((b, i) => {
          if (b.h) return <h2 key={i} className="legal__h">{b.h}</h2>;
          if (b.p) return <p key={i} className="legal__p">{inline(b.p, i)}</p>;
          if (b.ul)
            return (
              <ul key={i} className="legal__ul">
                {b.ul.map((li, j) => <li key={j}>{inline(li, `${i}-${j}`)}</li>)}
              </ul>
            );
          if (b.table)
            return (
              <div key={i} className="legal__tablewrap">
                <table className="legal__table">
                  <thead>
                    <tr>{b.table.head.map((h, j) => <th key={j}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.table.rows.map((row, j) => (
                      <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          return null;
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .legal { max-width: 760px; }
        .legal__title { font-size: var(--step-4); }
        .legal__meta { margin-top: var(--sp-4); color: var(--muted); font-size: var(--step--1); }
        .legal__prevails {
          margin-top: var(--sp-4); padding-left: var(--sp-3);
          border-left: 2px solid var(--gold); color: var(--muted);
          font-size: var(--step--1);
        }
        .legal__h { font-size: var(--step-2); margin: var(--sp-8) 0 var(--sp-4); }
        .legal__p { margin-bottom: var(--sp-4); max-width: 68ch; }
        .legal__p strong, .legal__ul strong { font-weight: 600; color: var(--ink); }
        .legal__ul {
          margin: 0 0 var(--sp-4); padding-left: var(--sp-5);
          display: flex; flex-direction: column; gap: var(--sp-3);
          max-width: 68ch;
        }
        .legal__ul li::marker { color: var(--gold); }
        .legal__tablewrap { overflow-x: auto; margin-bottom: var(--sp-5); }
        .legal__table {
          width: 100%; border-collapse: collapse;
          font-size: 0.9375rem; background: var(--surface);
          border: 1px solid var(--mist); border-radius: var(--radius);
        }
        .legal__table th, .legal__table td {
          text-align: left; padding: var(--sp-3) var(--sp-4);
          border-bottom: 1px solid var(--mist); vertical-align: top;
        }
        .legal__table th { font-weight: 600; color: var(--navy); background: rgba(27,42,87,0.035); }
        .legal__table tr:last-child td { border-bottom: none; }
      ` }} />
    </section>
  );
}
