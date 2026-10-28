"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import NewsletterSignup from "./NewsletterSignup";
import SocialContacts from "./SocialContacts";
import SocialIcons from "./SocialIcons";
import { reopenCookieNotice } from "./CookieNotice";

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
          <Link href="/students">{t.nav.students}</Link>
          <Link href="/process">{t.nav.how}</Link>
          <Link href="/pricing">{t.nav.pricing}</Link>
          <Link href="/contact">{t.nav.contact}</Link>
        </nav>

        <nav className="footer__col" aria-label="Legal">
          <span className="footer__head">{t.footer.legalHead}</span>
          <Link href="/privacy">{t.footer.privacy}</Link>
          <Link href="/cookies">{t.footer.cookies}</Link>
          <Link href="/terms">{t.footer.terms}</Link>
          <button type="button" className="footer__linkbtn" onClick={reopenCookieNotice}>
            {t.cookieNotice.settings}
          </button>
        </nav>

        <NewsletterSignup />

        <div className="footer__col">
          <span className="footer__head">{t.footer.getInTouch}</span>
          <SocialContacts variant="compact" />
          {/* SocialContacts already carries phone, WeChat and RedNote; only the
              channels it does not cover belong here. */}
          {t.contact.channels
            .filter((c) => c.type === "email")
            .map((c) => (
              <span key={c.type} className="footer__chan">
                <em>{c.label}</em> {c.value}
              </span>
            ))}

          {/* Every page, not just Contact: the footer is where people look for
              these, and it is the only part of the site on all of them. */}
          <SocialIcons />
        </div>
      </div>

      {/* Always rendered in both scripts, whatever the toggle is set to, so the
          Chinese name exists in the HTML a crawler sees on every page. */}
      <div className="container footer__brandline">
        <span className="footer__brandname">
          <span lang="en">EHOME Properties</span>
          <span lang="zh-Hans">易家 — 易家租房担保</span>
        </span>
        <span className="footer__branddesc">
          <span lang="en">UK rent guarantor for international students</span>
          <span lang="zh-Hans">英国留学生租房担保</span>
        </span>
      </div>

      <div className="container footer__legal">
        <span>{t.footer.legal}</span>
      </div>

      <div className="container footer__base">
        <span>© {year} {t.brand.name}. {t.footer.rights}</span>
        <span>{t.footer.ico}</span>
        <span>{t.footer.built}</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer { border-top: 1px solid var(--line); background: var(--surface); margin-top: 40px; }
        .footer__inner {
          display: grid; grid-template-columns: 1.5fr 0.8fr 0.7fr 1.2fr 1.1fr; gap: 36px;
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
        .footer__linkbtn {
          background: none; border: none; padding: 0; font: inherit;
          color: inherit; cursor: pointer; text-align: left;
        }
        .footer__linkbtn:hover { color: var(--brand); }
        .footer__chan { color: var(--muted); font-size: 0.94rem; }
        .footer__chan em { color: var(--ink); font-style: normal; font-weight: 600; }
        .footer__brandline {
          padding: var(--sp-5) var(--sp-5) 0; color: var(--muted);
          font-size: var(--step--1);
          display: flex; flex-wrap: wrap; gap: 4px var(--sp-6);
        }
        .footer__brandname, .footer__branddesc { display: flex; gap: var(--sp-3); }
        .footer__brandname { color: var(--navy); font-weight: 600; }
        .footer__legal {
          padding: 18px 24px 0; color: var(--muted); font-size: 0.84rem;
        }
        .footer__base {
          display: flex; justify-content: space-between;
          padding: 20px 24px 40px; border-top: 1px solid var(--line);
          color: var(--muted); font-size: 0.86rem;
        }
        @media (max-width: 1080px) {
          .footer__inner { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 780px) {
          .footer__inner { grid-template-columns: 1fr; gap: 32px; }
          .footer__base { flex-direction: column; gap: 8px; }
        }
      ` }} />
    </footer>
  );
}
