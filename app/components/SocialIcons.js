// app/components/SocialIcons.js
// The public social accounts, as one row of icons. One tap goes straight to
// the account — no reveal step, no copy step, no interstitial.
//
// These are the real accounts EHOME runs; nothing here is invented. WeChat and
// RedNote are NOT in this row: they are ways of reaching us rather than feeds
// to follow, so they sit with the phone and the email in ContactChannels.
//
// Tracking parameters are stripped from every link. The URLs arrived from
// share sheets and QR codes carrying utm_source, si and s values that identify
// the share, not the account, and they are no use to a visitor.
"use client";

import { useI18n } from "../i18n/LanguageProvider";

import { BRAND } from "./brand-icons";

/**
 * Each account's own mark, in its own colour. These were hand-drawn
 * approximations: a rounded square with a circle in it is not the Instagram
 * logo, it is a rounded square with a circle in it.
 */
function Mark({ icon }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill={icon.hex} aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}

const ACCOUNTS = [
  { icon: BRAND.instagram, href: "https://www.instagram.com/ehom.eproperties" },
  { icon: BRAND.tiktok, href: "https://www.tiktok.com/@ehome.properties6" },
  { icon: BRAND.douyin, href: "https://v.douyin.com/dv4iXUpNz8I/" },
  { icon: BRAND.youtube, href: "https://www.youtube.com/@ehomeproperties26" },
  { icon: BRAND.x, href: "https://x.com/ehome2026" },
  // WhatsApp is not here: it is a way to message us, so it sits with the
  // phone and the email in ContactChannels. Listing it in both put the same
  // green mark twice on one screen.
];

export default function SocialIcons() {
  const { t } = useI18n();
  const s = t.contact.social;

  return (
    <div className="si">
      <span className="footer__head si__head">{s.findUs}</span>
      <ul className="si__list">
        {ACCOUNTS.map((a) => (
          <li key={a.icon.title}>
            <a
              href={a.href}
              className="si__link"
              target="_blank"
              // noreferrer as well as noopener: these are the accounts, they do
              // not need to know which page of ours someone came from.
              rel="noopener noreferrer"
              title={a.icon.title}
              aria-label={a.icon.title}
            >
              <Mark icon={a.icon} />
            </a>
          </li>
        ))}
      </ul>

      <style dangerouslySetInnerHTML={{ __html: `
        .si { min-width: 0; }
        .si__head { display: block; margin-bottom: 12px; }
        .si__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .si__link {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--line);
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .si__link:hover,
        .si__link:focus-visible {
          border-color: var(--gold-rule);
          background: var(--gold-wash);
          transform: translateY(-1px);
        }
        /* 44px is the tap target; it does not shrink on a phone. */
      ` }} />
    </div>
  );
}
