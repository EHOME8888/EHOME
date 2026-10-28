"use client";
// app/components/ContactChannels.js
//
// Every way to reach us, as one list of things you press.
//
// What this replaces: a block that printed a 13-character WeChat ID, a
// RedNote ID, a Copy button for each, an Open button, two 150px QR codes and
// a line of instructions under every one. All of it was there to work around
// the fact that WeChat and RedNote are IDs rather than links — but the person
// reading it does not care why, they want to reach us. So the awkwardness
// moves into the code and the surface becomes one row per channel.
//
// Nothing here explains itself. A button says WeChat and opens WeChat.
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

export const PHONE = "+44 20 3928 7666";
export const PHONE_TEL = "+442039287666";
export const WHATSAPP_URL = "https://wa.me/447938571111";
export const EMAIL = "info@ehomeproperties.com";
export const WECHAT_ID = "LB17602155557";
export const WECHAT_QR = "/wechat-qr.jpg";
// Official share link from the RedNote app.
export const REDNOTE_URL = "https://xhslink.cn/m/APRandxKkSQ";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    // weixin:// only resolves where the app exists. Decided on the user agent
    // rather than screen width: a narrow desktop window is still a desktop,
    // and a link that silently does nothing is the worst outcome here.
    setMobile(/android|iphone|ipad|ipod|harmony/i.test(navigator.userAgent));
  }, []);
  return mobile;
}

const S = {
  viewBox: "0 0 24 24", width: 20, height: 20, fill: "none",
  stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round",
};

const ICONS = {
  phone: (
    <svg {...S}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
  ),
  whatsapp: (
    <svg {...S}>
      <path d="M20.5 11.7a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.7z" />
      <path d="M9.2 8.6c.5-.1.8 0 1 .4l.6 1.2c.1.3 0 .5-.2.7l-.5.5a5.6 5.6 0 0 0 2.5 2.5l.5-.5c.2-.2.4-.3.7-.2l1.2.6c.4.2.5.5.4 1a2 2 0 0 1-1.9 1.3 7.6 7.6 0 0 1-5.6-5.6 2 2 0 0 1 1.3-1.9z" />
    </svg>
  ),
  email: (
    <svg {...S}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
  wechat: (
    <svg {...S}>
      <path d="M9 4C5 4 2 6.7 2 10c0 1.8.9 3.4 2.4 4.5L4 17l2.7-1.3c.7.2 1.5.3 2.3.3" />
      <path d="M22 15c0-2.8-2.7-5-6-5s-6 2.2-6 5 2.7 5 6 5c.7 0 1.4-.1 2-.3L20 21l-.4-1.8A4.7 4.7 0 0 0 22 15z" />
    </svg>
  ),
  rednote: (
    <svg {...S}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 9v6M8 9h2.5a1.5 1.5 0 0 1 0 3H8m4.5-3v6m3-6v6m0-3h1.5" />
    </svg>
  ),
};

export default function ContactChannels({ variant = "buttons" }) {
  const { t } = useI18n();
  const c = t.contact.reach;
  const isMobile = useIsMobile();

  const channels = [
    { key: "phone", label: c.phone, href: `tel:${PHONE_TEL}`, external: false },
    { key: "whatsapp", label: c.whatsapp, href: WHATSAPP_URL, external: true },
    { key: "email", label: c.email, href: `mailto:${EMAIL}`, external: false },
    {
      key: "wechat",
      label: c.wechat,
      // On a phone, straight into the app. On a desktop, the QR — which is
      // the only thing that actually works there, so it is what the button
      // does rather than something explained beside it.
      href: isMobile ? "weixin://" : WECHAT_QR,
      external: !isMobile,
      // The ID lands on the clipboard either way, so WeChat's search box can
      // be pasted into without anyone having read a number off the screen.
      onClick: () => navigator.clipboard?.writeText(WECHAT_ID).catch(() => {}),
    },
    { key: "rednote", label: c.rednote, href: REDNOTE_URL, external: true },
  ];

  const links = variant === "links";

  return (
    <ul className={`cc ${links ? "cc--links" : "cc--buttons"}`}>
      {channels.map((ch) => (
        <li key={ch.key}>
          <a
            href={ch.href}
            className="cc__item"
            onClick={ch.onClick}
            {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="cc__icon" aria-hidden="true">{ICONS[ch.key]}</span>
            <span className="cc__label">{ch.label}</span>
          </a>
        </li>
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        .cc { list-style: none; margin: 0; padding: 0; }

        /* Contact page: one full-width row per channel, the whole row a tap
           target. Nothing competes, so nothing needs a caption. */
        .cc--buttons { display: flex; flex-direction: column; gap: 10px; }
        .cc--buttons .cc__item {
          display: flex; align-items: center; gap: 14px;
          padding: 15px 20px;
          border: 1px solid var(--line); border-radius: 999px;
          background: var(--surface); color: var(--ink);
          text-decoration: none; font-weight: 500;
          transition: border-color 0.16s ease, background 0.16s ease, transform 0.16s ease;
        }
        .cc--buttons .cc__item:hover,
        .cc--buttons .cc__item:focus-visible {
          border-color: var(--gold-rule);
          background: var(--gold-wash);
          transform: translateY(-1px);
        }
        .cc--buttons .cc__icon { color: var(--brand); display: grid; place-items: center; }

        /* Footer: the same channels with the chrome taken off. */
        .cc--links { display: flex; flex-direction: column; gap: 11px; }
        .cc--links .cc__item {
          display: flex; align-items: center; gap: 10px;
          color: var(--muted); font-size: 0.9rem; text-decoration: none;
          transition: color 0.15s ease;
        }
        .cc--links .cc__item:hover,
        .cc--links .cc__item:focus-visible { color: var(--brand); }
        .cc--links .cc__icon { display: grid; place-items: center; opacity: 0.75; }
        .cc--links svg { width: 16px; height: 16px; }
      ` }} />
    </ul>
  );
}
