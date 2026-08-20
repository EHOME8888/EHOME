"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

export default function QuoteEstimator() {
  const { t } = useI18n();
  const e = t.estimator;
  const unis = e.universities;

  const [rent, setRent] = useState("");
  const [uniIdx, setUniIdx] = useState(0); // index into unis, or -1 for "Other"

  const isOther = uniIdx === -1;
  const top50 = isOther ? false : unis[uniIdx].top50;
  const rentNum = parseFloat(String(rent).replace(/[^0-9.]/g, "")) || 0;
  const base = rentNum / 12;               // one month's rent
  const fee = top50 ? base : base * 1.2;    // +20% outside QS Top 50
  const fmt = (n) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });

  return (
    <div className="qe">
      <span className="qe__title">{e.title}</span>

      <label className="qe__label" htmlFor="qe-rent">{e.rentLabel}</label>
      <div className="qe__input">
        <span className="qe__cur">{e.currency}</span>
        <input
          id="qe-rent"
          inputMode="numeric"
          value={rent}
          onChange={(ev) => setRent(ev.target.value)}
          placeholder="12,000"
        />
      </div>

      <label className="qe__label" htmlFor="qe-uni">{e.uniLabel}</label>
      <div className="qe__selectwrap">
        <select
          id="qe-uni"
          className="qe__select"
          value={uniIdx}
          onChange={(ev) => setUniIdx(parseInt(ev.target.value, 10))}
        >
          {unis.map((u, i) => (
            <option key={i} value={i}>{u.name}</option>
          ))}
          <option value={-1}>{e.otherUni}</option>
        </select>
      </div>

      <div className="qe__result">
        <span className="qe__result-label">{e.resultLabel}</span>
        <span className="qe__result-value">{e.currency}{fmt(fee)}</span>
      </div>

      <p className="qe__basis">{e.basis}</p>
      <p className="qe__note">{e.note}</p>
      <Link href="/contact" className="btn btn--gold qe__cta">{e.cta}</Link>

      <style dangerouslySetInnerHTML={{ __html: `
        .qe {
          background: var(--surface); border: 1px solid var(--line);
          border-radius: 20px; padding: 28px;
          box-shadow: 0 24px 60px -34px rgba(18,35,63,0.45);
        }
        .qe__title { display: block; font-family: var(--font-display); font-size: 1.25rem; color: var(--brand); margin-bottom: 18px; }
        .qe__label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--muted); margin: 0 0 8px; }
        .qe__input {
          display: flex; align-items: center; gap: 6px;
          border: 1px solid var(--line); border-radius: 12px;
          padding: 10px 14px; background: var(--bg); margin-bottom: 18px;
        }
        .qe__input:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 30%, transparent); }
        .qe__cur { color: var(--muted); font-weight: 600; }
        .qe__input input { border: none; background: transparent; font: inherit; font-size: 1.2rem; font-weight: 600; color: var(--ink); width: 100%; outline: none; }
        .qe__selectwrap { position: relative; margin-bottom: 20px; }
        .qe__selectwrap::after {
          content: "▾"; position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
        }
        .qe__select {
          width: 100%; appearance: none; -webkit-appearance: none;
          border: 1px solid var(--line); border-radius: 12px; background: var(--bg);
          padding: 12px 14px; font: inherit; font-weight: 600; color: var(--ink);
          cursor: pointer; outline: none;
        }
        .qe__select:focus { border-color: var(--brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 30%, transparent); }
        .qe__result {
          display: flex; align-items: baseline; justify-content: space-between;
          padding: 16px 18px; background: var(--brand); border-radius: 12px; margin-bottom: 10px;
        }
        .qe__result-label { color: rgba(255,255,255,0.8); font-size: 0.9rem; }
        .qe__result-value { font-family: var(--font-display); font-size: 1.9rem; color: #fff; font-weight: 500; }
        .qe__basis { font-size: 0.8rem; color: var(--muted); margin-bottom: 10px; }
        .qe__surcharge { color: var(--gold); font-weight: 600; }
        .qe__note { font-size: 0.78rem; color: var(--muted); margin-bottom: 16px; }
        .qe__cta { width: 100%; justify-content: center; }
      ` }} />
    </div>
  );
}
