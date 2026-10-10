"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

export default function QuoteEstimator() {
  const { t } = useI18n();
  const e = t.estimator;
  const unis = e.universities;

  const [rent, setRent] = useState("");
  const [uniIdx, setUniIdx] = useState(0); // index into unis, or -1 for "Other"

  const [fee, setFee] = useState(0);
  const fmt = (n) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });

  // The fee is calculated on the server (app/api/quote). Keeping it off the
  // client means the pricing model is not readable in the browser bundle.
  useEffect(() => {
    const universityId = uniIdx === -1 ? null : unis[uniIdx]?.id ?? null;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annualRent: rent, universityId }),
        signal: controller.signal,
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d && typeof d.fee === "number") setFee(d.fee); })
        .catch(() => { /* offline or aborted - leave the last figure showing */ });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [rent, uniIdx, unis]);

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
        /* The estimator is the one surface on the page that lifts. Everything
           else sits flat and bordered, so elevation means something. */
        .qe {
          background: var(--surface);
          border: 1px solid rgba(217,222,232,0.6);
          border-radius: var(--radius); padding: var(--sp-6);
          box-shadow: 0 1px 2px rgba(16,24,44,0.04),
                      0 12px 28px -16px rgba(16,24,44,0.22),
                      0 40px 64px -48px rgba(16,24,44,0.28);
          animation: settleIn 700ms var(--ease) 320ms both;
        }
        @media (prefers-reduced-motion: reduce) { .qe { animation: none; } }
        .qe__title { display: block; font-family: var(--font-display); font-size: var(--step-2); color: var(--navy); margin-bottom: var(--sp-5); }
        .qe__label { display: block; font-size: var(--step--1); font-weight: 600; color: var(--muted); margin: 0 0 var(--sp-2); }
        .qe__input {
          display: flex; align-items: center; gap: 6px;
          border: 1px solid var(--mist); border-radius: var(--radius-field);
          padding: 11px 14px; background: var(--paper); margin-bottom: var(--sp-5);
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
          border: 1px solid var(--mist); border-radius: var(--radius-field); background: var(--paper);
          padding: 12px 14px; font: inherit; font-weight: 600; color: var(--ink);
          cursor: pointer; outline: none;
        }
        .qe__select:focus { border-color: var(--brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 30%, transparent); }
        .qe__result {
          display: flex; align-items: baseline; justify-content: space-between;
          padding: var(--sp-4) var(--sp-5); background: var(--navy); border-radius: var(--radius-field); margin-bottom: var(--sp-3);
        }
        .qe__result-label { color: rgba(255,255,255,0.8); font-size: 0.9rem; }
        .qe__result-value { font-family: var(--font-display); font-size: var(--step-4); color: #fff; font-weight: 500; letter-spacing: -0.02em; }
        .qe__basis { font-size: 0.8rem; color: var(--muted); margin-bottom: 10px; }
        .qe__note { font-size: 0.78rem; color: var(--muted); margin-bottom: 16px; }
        .qe__cta { width: 100%; justify-content: center; }
      ` }} />
    </div>
  );
}
