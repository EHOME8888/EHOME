"use client";
// app/components/NewsletterResult.js
// Where the confirm and unsubscribe links land.
import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";

export default function NewsletterResult({ kind }) {
  const { t } = useI18n();
  const n = t.newsletter;
  const copy = {
    confirmed: [n.confirmedTitle, n.confirmedBody],
    unsub: [n.unsubTitle, n.unsubBody],
    expired: [n.expiredTitle, n.expiredBody],
  }[kind] ?? [n.expiredTitle, n.expiredBody];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 620 }}>
        <span style={{ display: "block", width: 40, height: 2, background: "var(--gold)", marginBottom: "var(--sp-5)" }} />
        <h1 style={{ fontSize: "var(--step-4)" }}>{copy[0]}</h1>
        <p style={{ marginTop: "var(--sp-4)", color: "var(--muted)" }}>{copy[1]}</p>
        <Link href="/" className="btn btn--ghost" style={{ marginTop: "var(--sp-6)" }}>{n.backHome}</Link>
      </div>
    </section>
  );
}
