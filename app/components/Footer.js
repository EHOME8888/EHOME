"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <img src="/logo.png" alt="Ehome Properties — Trust Beyond Borders" className="footer__logo-img" />
          <p className="footer__tag">{t.footer.tagline}</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <span className="footer__head">{t.footer.company}</span>
          <Link href="/#what">{t.nav.what}</Link>
          <Link href="/pricing">{t.nav.pricing}</Link>
          <Link href="/#partners">{t.nav.partners}</Link>
          <Link href="/contact">{t.nav.contact}</Link>
        </nav>

        <div className="footer__col">
          <span className="footer__head">{t.footer.getInTouch}</span>
          {t.contact.channels.map((c) => (
            <span key={c.type} className="footer__chan">
              <em>{c.label}</em> {c.value}
            </span>
          ))}
        </div>
      </div>

      <div className="container footer__base">
        <span>© {year} {t.brand.name}. {t.footer.rights}</span>
        <span>{t.footer.ico}</span>
        <span>{t.footer.built}</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer { border-top: 1px solid var(--line); background: var(--surface); margin-top: 40px; }
        .footer__inner {
          display: grid; grid-template-columns: 2fr 1fr 1.3fr; gap: 40px;
          padding: 64px 24px 40px;
        }
        .footer__logo-img { height: 82px; width: auto; }
        .footer__tag { color: var(--muted); margin-top: 14px; max-width: 34ch; }
        .footer__col { display: flex; flex-direction: column; gap: 10px; }
        .footer__head {
          font-size: 0.76rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 4px; font-weight: 600;
        }
        .footer__col a:hover { color: var(--brand); }
        .footer__chan { color: var(--muted); font-size: 0.94rem; }
        .footer__chan em { color: var(--ink); font-style: normal; font-weight: 600; }
        .footer__base {
          display: flex; justify-content: space-between;
          padding: 20px 24px 40px; border-top: 1px solid var(--line);
          color: var(--muted); font-size: 0.86rem;
        }
        @media (max-width: 780px) {
          .footer__inner { grid-template-columns: 1fr; gap: 32px; }
          .footer__base { flex-direction: column; gap: 8px; }
        }
      ` }} />
    </footer>
  );
}
