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

  async function submit(e) {
    e.preventDefault();
    setNote(null);
    if (!consent) { setNote(n.errConsent); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setNote(n.errEmail); return; }

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
      } else {
        setDone(true);
        setNote(data?.inert ? n.inert : n.check);
        setEmail(""); setConsent(false);
      }
    } catch {
      setNote(n.errFailed);
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder={n.placeholder} className="nl__input"
          />

          <label className="nl__consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
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

      {note && <p className="nl__note" role="status">{note}</p>}

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
      ` }} />
    </div>
  );
}
