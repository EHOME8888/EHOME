"use client";
// app/components/NewsletterSignup.js
// Double opt-in. Submitting only asks for a confirmation email; nothing is
// added to the list until the reader clicks the link in it.
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

export default function NewsletterSignup() {
  const { t, lang } = useI18n();
  const n = t.newsletter;

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(null);   // null | "email" | "consent"

  async function submit(e) {
    e.preventDefault();
    setNote(null); setErr(null);
    if (!consent) { setNote(n.errConsent); setErr("consent"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setNote(n.errEmail); setErr("email"); return; }

    setBusy(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent: true,
          locale: lang,
          // the exact wording agreed to, stored as proof of consent
          consentText: n.consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNote(data?.error === "consent_required" ? n.errConsent
              : data?.error === "invalid_email" ? n.errEmail
              : n.errFailed);
        setErr("email");
      } else {
        setDone(true); setErr(null);
        setNote(data?.inert ? n.inert : n.check);
        setEmail(""); setConsent(false);
      }
    } catch {
      setNote(n.errFailed); setErr("email");
    }
    setBusy(false);
  }

  return (
    <div className="nl">
      <span className="footer__head">{n.head}</span>
      <p className="nl__blurb">{n.blurb}</p>

      {!done && (
        <form onSubmit={submit} noValidate>
          <label className="nl__sronly" htmlFor="nl-email">{n.placeholder}</label>
          <input
            id="nl-email" type="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); if (err) { setErr(null); setNote(null); } }}
            placeholder={n.placeholder}
            className={`nl__input ${err === "email" ? "nl__input--err" : ""}`}
            aria-invalid={err === "email" || undefined}
          />

          <label className="nl__consent">
            <input type="checkbox" checked={consent} aria-invalid={err === "consent" || undefined}
                onChange={(e) => { setConsent(e.target.checked); if (err === "consent") { setErr(null); setNote(null); } }} />
            <span>
              {n.consent}{" "}
              <Link href="/privacy" className="nl__link">{n.consentPrivacy}</Link>{" "}
              {n.consentSuffix}
            </span>
          </label>

          <button type="submit" className="btn btn--primary nl__btn" disabled={busy}>
            {busy ? n.sending : n.submit}
          </button>
        </form>
      )}

      {done ? (
        <div className="nl__done" role="status">
          <span className="nl__tick" aria-hidden="true" />
          <p>{note}</p>
        </div>
      ) : (
        note && (
          <p className={`nl__note ${err ? "nl__note--err" : ""}`} role="alert">{note}</p>
        )
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .nl { display: flex; flex-direction: column; gap: 10px; }
        .nl__blurb { color: var(--muted); font-size: 0.9rem; max-width: 34ch; }
        .nl__sronly {
          position: absolute; width: 1px; height: 1px; overflow: hidden;
          clip: rect(0 0 0 0); white-space: nowrap;
        }
        .nl__input {
          width: 100%; padding: 10px 12px; font: inherit; font-size: 0.94rem;
          border: 1px solid var(--mist); border-radius: var(--radius-field);
          background: var(--surface); color: var(--ink);
        }
        .nl__input:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(200,162,74,0.28); }
        .nl__consent {
          display: flex; gap: 8px; align-items: flex-start;
          margin-top: 10px; font-size: 0.8rem; color: var(--muted); line-height: 1.5;
        }
        .nl__consent input { margin-top: 3px; flex: none; }
        .nl__link { color: var(--navy); font-weight: 600; text-decoration: underline; }
        .nl__btn { margin-top: 12px; align-self: flex-start; }
        .nl__note { margin-top: 10px; font-size: 0.84rem; color: var(--muted); max-width: 36ch; }
        .nl__note--err { color: #8E2A2A; }
        .nl__input--err { border-color: #8E2A2A; }
        .nl__done {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 14px 16px; border-radius: var(--radius);
          background: rgba(27,42,87,0.04); max-width: 34ch;
        }
        .nl__done p { font-size: 0.84rem; color: var(--muted); margin: 0; }
        .nl__tick {
          flex: none; width: 18px; height: 18px; margin-top: 1px;
          border-radius: 999px; background: var(--gold);
          position: relative;
        }
        .nl__tick::after {
          content: ""; position: absolute; left: 6px; top: 3px;
          width: 4px; height: 9px; border: solid #26200E;
          border-width: 0 2px 2px 0; transform: rotate(45deg);
        }
      ` }} />
    </div>
  );
}
