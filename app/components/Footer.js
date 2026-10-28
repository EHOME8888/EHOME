"use client";

import Link from "next/link";
import { useI18n } from "../i18n/LanguageProvider";
import NewsletterSignup from "./NewsletterSignup";
import SocialContacts from "./SocialContacts";
import SocialIcons from "./SocialIcons";
import { reopenCookieNotice } from "./CookieNotice";

/**
 * Three bands, each with one job.
 *
 *   1. navigate   — brand, then uniform link columns
 *   2. act        — the newsletter, and where to find us
 *   3. small print — who we legally are
 *
 * That shape is what Apple, Stripe and Wise all converge on, and the reason
 * is structural rather than fashionable: a footer is read by scanning, and
 * scanning needs rows of like things. The previous version had five columns
 * holding five different KINDS of thing — a logo, two link lists, a form and
 * an interactive contact block — at five different widths. The contact column
 * ran three times the height of the Legal column beside it, so the grid had a
 * hole in it, and no amount of spacing fixes that while a form and a link list
 * share a row.
 *
 * Everything here is quiet on purpose. Hierarchy comes from size, weight and
 * space, never from boxes or colour: a footer that competes with the page
 * above it is a footer someone has to look away from.
 */
export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* ---------------------------------------------------- 1. navigate */}
      <div className="container footer__nav">
        <div className="footer__brand">
          <img
            src="/logo.png"
            alt="Ehome Properties — Trust Beyond Borders"
            className="footer__logo-img"
          />
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

        <div className="footer__col footer__col--contact">
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
        </div>
      </div>

      {/* -------------------------------------------------------- 2. act */}
      <div className="container footer__act">
        <NewsletterSignup />
        {/* Right-aligned on its own row, the way every footer that has social
            icons places them. In a content column they read as one more
            contact method; here they read as the set they are. */}
        <SocialIcons />
      </div>

      {/* ------------------------------------------------ 3. small print */}
      <div className="container footer__fine">
        {/* Always rendered in both scripts, whatever the toggle is set to, so
            the Chinese name exists in the HTML a crawler sees on every page. */}
        <p className="footer__brandline">
          <span className="footer__brandname">
            <span lang="en">EHOME Properties</span>
            <span lang="zh-Hans">易家 — 易家租房担保</span>
          </span>
          <span className="footer__branddesc">
            <span lang="en">UK rent guarantor for international students</span>
            <span lang="zh-Hans">英国留学生租房担保</span>
          </span>
        </p>

        {/* Two statements, separated by space rather than a middot. A dot
            between flex items lands at the end of the line when the row
            wraps, which it does at any width a phone has. */}
        <p className="footer__legalline">
          <span>{t.footer.legal}</span>
          <span>{t.footer.ico}</span>
        </p>

        <p className="footer__base">
          <span>© {year} {t.brand.name}. {t.footer.rights}</span>
          <span>{t.footer.built}</span>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer {
          border-top: 1px solid var(--line);
          background: var(--surface);
          margin-top: 40px;
        }

        /* ---- 1. navigate ------------------------------------------------ */
        /* Three equal link columns after the brand. Equal because they hold
           the same kind of thing; the brand gets more room because a logo and
           a sentence need it. */
        .footer__nav {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.25fr;
          gap: 40px;
          padding: 64px 24px 48px;
        }
        .footer__brand { max-width: 34ch; }
        /* Was 82px, which made the logo the loudest thing on the page below
           the fold. */
        .footer__logo-img { height: 58px; width: auto; }
        .footer__tag {
          color: var(--muted);
          margin-top: 14px;
          font-size: 0.9rem;
          line-height: 1.65;
        }
        .footer__col { display: flex; flex-direction: column; align-items: flex-start; gap: 11px; }
        .footer__col--contact { gap: 14px; }
        .footer__head {
          font-size: 0.7rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 600;
          margin-bottom: 5px;
        }
        /* Muted, not ink: footer links are a reference list, not a call to
           action. #566076 on white is 6.3:1, so quiet does not mean faint. */
        .footer__col a,
        .footer__linkbtn {
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.4;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer__col a:hover,
        .footer__linkbtn:hover,
        .footer__col a:focus-visible,
        .footer__linkbtn:focus-visible { color: var(--brand); }
        .footer__linkbtn {
          background: none; border: none; padding: 0; font: inherit;
          font-size: 0.9rem; cursor: pointer; text-align: left;
        }
        .footer__chan { color: var(--muted); font-size: 0.9rem; }
        .footer__chan em { color: var(--ink); font-style: normal; font-weight: 600; }

        /* The contact block ships as a card-ish component for the Contact
           page. In here it is a list, so its buttons become text actions:
           bordered pills in a footer read as primary UI and pull the eye
           straight past the navigation. */
        .footer .sc--compact .sc__copy,
        .footer .sc--compact .sc__open {
          border: none;
          background: none;
          padding: 0;
          font-size: 0.85rem;
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .footer .sc--compact .sc__copy:hover,
        .footer .sc--compact .sc__open:hover { color: var(--brand); }
        .footer .sc--compact .sc__actions { gap: 16px; }

        /* ---- 2. act ----------------------------------------------------- */
        .footer__act {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 40px;
          align-items: end;
          padding: 32px 24px;
          border-top: 1px solid var(--line);
        }

        /* ---- 3. small print --------------------------------------------- */
        /* One band, three lines, each smaller or quieter than the last. The
           previous footer said this in three separate bands with rules
           between them, which gave equal weight to the company name, the
           registration and the copyright. They are not equal. */
        .footer__fine {
          padding: 24px 24px 40px;
          border-top: 1px solid var(--line);
          color: var(--muted);
        }
        .footer__brandline {
          display: flex; flex-wrap: wrap; gap: 4px 24px;
          margin: 0; font-size: var(--step--1);
        }
        .footer__brandname, .footer__branddesc { display: flex; gap: 10px; }
        .footer__brandname { color: var(--navy); font-weight: 600; }
        .footer__legalline {
          display: flex; flex-wrap: wrap; gap: 2px 24px;
          margin: 10px 0 0; font-size: 0.8rem;
        }
        .footer__base {
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px 24px;
          margin: 16px 0 0; font-size: 0.78rem; opacity: 0.85;
        }

        /* ---- narrower --------------------------------------------------- */
        @media (max-width: 1080px) {
          .footer__nav { grid-template-columns: 1fr 1fr; gap: 36px; }
          .footer__brand { grid-column: 1 / -1; }
        }
        @media (max-width: 780px) {
          .footer__nav { grid-template-columns: 1fr; gap: 34px; padding-top: 48px; }
          /* Side by side, the English wraps onto a second line and the
             Chinese sits beside the wrap, which reads as two ragged columns.
             One language per line instead. */
          .footer__brandname, .footer__branddesc { flex-direction: column; gap: 2px; }
          .footer__brandline { gap: 8px; }
          .footer__act {
            grid-template-columns: 1fr;
            align-items: start;
            gap: 28px;
          }
          .footer__base { justify-content: flex-start; }
        }
      ` }} />
    </footer>
  );
}
