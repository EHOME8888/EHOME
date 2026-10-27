"use client";
// app/components/SocialContacts.js
// Reusable: variant="full" for the Contact page, variant="compact" for the footer.
// Only the channels EHOME actually has — phone, WeChat, RedNote. Nothing invented.
import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

export const PHONE = "+44 20 3928 7666";
export const PHONE_TEL = "+442039287666";
export const WECHAT_ID = "LB17602155557";
export const REDNOTE_ID = "63656290277";
// Official share link from the RedNote app. Opens the profile in the app on a
// phone; on a desktop browser RedNote puts a login wall in front of profiles,
// which is why the QR stays the primary route.
export const REDNOTE_URL = "https://xhslink.cn/m/APRandxKkSQ";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    // WeChat's weixin:// scheme only resolves where the app exists. Deciding on
    // the user agent rather than screen width: a narrow desktop window is still
    // a desktop, and offering a link that silently does nothing is worse than
    // not offering it.
    setMobile(/android|iphone|ipad|ipod|harmony/i.test(navigator.userAgent));
  }, []);
  return mobile;
}

function CopyId({ value, label }) {
  const { t } = useI18n();
  const s = t.contact.social;
  const [state, setState] = useState("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("ok");
    } catch {
      setState("fail");   // insecure context, or permission refused
    }
    setTimeout(() => setState("idle"), 2500);
  }

  return (
    <button type="button" onClick={copy} className="sc__copy" aria-label={label}>
      {state === "ok" ? s.copied : state === "fail" ? s.copyFailed : s.copy}
    </button>
  );
}

export default function SocialContacts({ variant = "full" }) {
  const { t } = useI18n();
  const s = t.contact.social;
  const isMobile = useIsMobile();
  const compact = variant === "compact";

  return (
    <div className={`sc ${compact ? "sc--compact" : ""}`}>
      {!compact && <span className="footer__head sc__head">{s.head}</span>}

      {/* Phone — a tel: link works everywhere: dials on mobile, offers to call
          or copy on desktop. */}
      <div className="sc__row">
        <span className="sc__label">{s.phoneLabel}</span>
        <a href={`tel:${PHONE_TEL}`} className="sc__value sc__value--link">{PHONE}</a>
      </div>

      {/* WeChat */}
      <div className="sc__block">
        <div className="sc__row">
          <span className="sc__label">{s.wechatLabel}</span>
          <span className="sc__value">{s.idLabel} {WECHAT_ID}</span>
        </div>
        <div className="sc__actions">
          <CopyId value={WECHAT_ID} label={s.copy} />
          {isMobile && (
            <a href="weixin://" className="sc__open">{s.openWechat}</a>
          )}
        </div>
        {!compact && (
          <>
            <a href="/wechat-qr.jpg" target="_blank" rel="noopener noreferrer" className="sc__qrlink">
              <Image src="/wechat-qr.jpg" alt={s.wechatCaption} width={150} height={150} className="sc__qr" />
            </a>
            <span className="sc__cap">{s.wechatCaption} — {s.tapQr}</span>
            <span className="sc__note">{s.desktopNote}</span>
          </>
        )}
      </div>

      {/* RedNote / 小红书 */}
      {!compact && (
        <div className="sc__block">
          <div className="sc__row">
            <span className="sc__label">{s.rednoteLabel}</span>
            <span className="sc__value">{s.idLabel} {REDNOTE_ID}</span>
          </div>
          <div className="sc__actions">
            <a href={REDNOTE_URL} target="_blank" rel="noopener noreferrer" className="sc__open">
              {s.openRednote}
            </a>
            <CopyId value={REDNOTE_ID} label={s.copy} />
          </div>
          <a href="/rednote-qr.jpg" target="_blank" rel="noopener noreferrer" className="sc__qrlink">
            <Image src="/rednote-qr.jpg" alt={s.rednoteCaption} width={150} height={150} className="sc__qr" />
          </a>
          <span className="sc__cap">{s.rednoteCaption} — {s.tapQr}</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .sc { display: flex; flex-direction: column; gap: var(--sp-5); }
        .sc--compact { gap: var(--sp-3); }
        .sc__head { margin-bottom: 0; }
        .sc__block {
          display: flex; flex-direction: column; gap: var(--sp-2);
          background: var(--surface); border: 1px solid var(--mist);
          border-radius: var(--radius); padding: var(--sp-5);
        }
        .sc--compact .sc__block { background: none; border: none; padding: 0; }
        .sc__row { display: flex; flex-direction: column; gap: 2px; }
        .sc__label {
          font-size: var(--step--1); font-weight: 600; color: var(--muted);
        }
        .sc__value { color: var(--ink); font-weight: 600; }
        .sc__value--link { color: var(--navy); text-decoration: underline; }
        .sc__value--link:hover { color: var(--navy-lift); }
        .sc__actions { display: flex; gap: var(--sp-2); flex-wrap: wrap; margin-top: 2px; }
        .sc__copy, .sc__open {
          font: inherit; font-size: var(--step--1); font-weight: 600;
          padding: 7px 14px; border-radius: var(--radius-btn);
          border: 1px solid var(--mist); background: transparent;
          color: var(--navy); cursor: pointer; text-decoration: none;
        }
        .sc__copy:hover, .sc__open:hover { border-color: var(--navy); background: rgba(27,42,87,0.04); }
        .sc__qr {
          margin-top: var(--sp-3); border-radius: 8px;
          border: 1px solid var(--mist); background: #fff; padding: 6px;
          width: 150px; height: auto;
        }
        .sc__qrlink { display: inline-block; line-height: 0; }
        .sc__qrlink:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
        .sc__cap { font-size: var(--step--1); color: var(--muted); max-width: 32ch; }
        .sc__note {
          font-size: var(--step--2); color: var(--muted);
          border-left: 2px solid var(--gold-rule); padding-left: var(--sp-3);
          margin-top: var(--sp-2); max-width: 44ch;
        }
      ` }} />
    </div>
  );
}
