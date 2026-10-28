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

// Stroke-based and monochrome, to sit with the existing channel icons rather
// than dropping six brand colours into the page.
const S = {
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ACCOUNTS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ehom.eproperties",
    icon: (
      <svg {...S}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@ehome.properties6",
    icon: (
      <svg {...S}>
        <path d="M14 3v11.2a3.3 3.3 0 1 1-2.6-3.23" />
        <path d="M14 5.2A5 5 0 0 0 19 9" />
      </svg>
    ),
  },
  {
    // Douyin is TikTok's mainland China app and a separate account. Its mark is
    // also a note, so it is boxed here — at 20px two bare notes side by side are
    // indistinguishable, and the title attribute only helps a mouse.
    name: "Douyin 抖音",
    href: "https://v.douyin.com/dv4iXUpNz8I/",
    icon: (
      <svg {...S}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <path d="M13.4 6.6v7.1a2.2 2.2 0 1 1-1.75-2.15" />
        <path d="M13.4 8a3.4 3.4 0 0 0 3.3 2.5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@ehomeproperties26",
    icon: (
      <svg {...S}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10.3 9.4 5 2.6-5 2.6z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/ehome2026",
    icon: (
      <svg {...S}>
        <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/447938571111",
    icon: (
      <svg {...S}>
        <path d="M20.5 11.7a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.7z" />
        <path d="M9.2 8.6c.5-.1.8 0 1 .4l.6 1.2c.1.3 0 .5-.2.7l-.5.5a5.6 5.6 0 0 0 2.5 2.5l.5-.5c.2-.2.4-.3.7-.2l1.2.6c.4.2.5.5.4 1a2 2 0 0 1-1.9 1.3 7.6 7.6 0 0 1-5.6-5.6 2 2 0 0 1 1.3-1.9z" />
      </svg>
    ),
  },
];

export default function SocialIcons() {
  const { t } = useI18n();
  const s = t.contact.social;

  return (
    <div className="si">
      <span className="footer__head si__head">{s.findUs}</span>
      <ul className="si__list">
        {ACCOUNTS.map((a) => (
          <li key={a.name}>
            <a
              href={a.href}
              className="si__link"
              target="_blank"
              // noreferrer as well as noopener: these are the accounts, they do
              // not need to know which page of ours someone came from.
              rel="noopener noreferrer"
              title={a.name}
              aria-label={a.name}
            >
              {a.icon}
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
          color: var(--brand);
          background: color-mix(in srgb, var(--gold) 16%, transparent);
          border: 1px solid transparent;
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .si__link:hover,
        .si__link:focus-visible {
          background: color-mix(in srgb, var(--gold) 28%, transparent);
          border-color: var(--line);
          transform: translateY(-1px);
        }
        /* 44px is the tap target; it does not shrink on a phone. */
      ` }} />
    </div>
  );
}
