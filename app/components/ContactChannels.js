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
import { BRAND, GLYPH } from "./brand-icons";

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

/**
 * The real marks, at their own colours. A WhatsApp glyph someone drew is a
 * glyph; the WhatsApp mark is recognised before it is read, which is the
 * entire job of an icon in a list of five.
 */
function Mark({ icon, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={icon.hex} aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}

// Phone and Email have no brand, so they take the house navy.
const NAVY = "var(--brand)";

export default function ContactChannels({ variant = "buttons" }) {
  const { t } = useI18n();
  const c = t.contact.reach;
  const isMobile = useIsMobile();

  const channels = [
    { key: "phone", label: c.phone, href: `tel:${PHONE_TEL}`, external: false,
      icon: { path: GLYPH.phone, hex: NAVY } },
    { key: "whatsapp", label: c.whatsapp, href: WHATSAPP_URL, external: true, icon: BRAND.whatsapp },
    { key: "email", label: c.email, href: `mailto:${EMAIL}`, external: false,
      icon: { path: GLYPH.email, hex: NAVY } },
    {
      key: "wechat",
      label: c.wechat,
      // On a phone, straight into the app. On a desktop, the QR — which is
      // the only thing that actually works there, so it is what the button
      // does rather than something explained beside it.
      href: isMobile ? "weixin://" : WECHAT_QR,
      external: !isMobile,
      icon: BRAND.wechat,
      // The ID lands on the clipboard either way, so WeChat's search box can
      // be pasted into without anyone having read a number off the screen.
      onClick: () => navigator.clipboard?.writeText(WECHAT_ID).catch(() => {}),
    },
    { key: "rednote", label: c.rednote, href: REDNOTE_URL, external: true, icon: BRAND.rednote },
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
            <span className="cc__icon"><Mark icon={ch.icon} size={links ? 16 : 20} /></span>
            <span className="cc__label">{ch.label}</span>
          </a>
        </li>
      ))}

      {/* When we actually answer. It belongs with the ways of reaching us,
          not three sections away. */}
      <li className="cc__hours">{c.hours}</li>

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
        .cc--buttons .cc__icon { display: grid; place-items: center; }
        .cc__hours {
          list-style: none; color: var(--muted); font-size: 0.82rem;
          margin-top: 14px; line-height: 1.6;
        }

        /* Footer: the same channels with the chrome taken off. */
        .cc--links { display: flex; flex-direction: column; gap: 11px; }
        .cc--links .cc__item {
          display: flex; align-items: center; gap: 10px;
          color: var(--muted); font-size: 0.9rem; text-decoration: none;
          transition: color 0.15s ease;
        }
        .cc--links .cc__item:hover,
        .cc--links .cc__item:focus-visible { color: var(--brand); }
        .cc--links .cc__icon { display: grid; place-items: center; }
        .cc--links .cc__hours { margin-top: 10px; font-size: 0.78rem; }
      ` }} />
    </ul>
  );
}
