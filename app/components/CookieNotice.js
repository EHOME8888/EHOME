"use client";
// app/components/CookieNotice.js
//
// TWO MODES, one constant.
//
// CONSENT_MODE = false (now): an informational notice. The site sets no
//   non-essential cookies, so there is nothing to consent to and nothing is
//   gated on a decision. Asking for consent you do not need trains people to
//   dismiss consent dialogs without reading them, and it would contradict the
//   published Cookies Policy, which says a consent banner arrives WHEN
//   analytics or advertising do.
//
// CONSENT_MODE = true (when analytics arrive): accept / reject, stored, with
//   reject as prominent as accept and nothing non-essential loading until the
//   reader has chosen. Gate any script on hasAnalyticsConsent().
//
// Either way the choice lives in localStorage, which is itself strictly
// necessary — and must be listed in the Cookies Policy table.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

const CONSENT_MODE = false;
const KEY = "ehome-cookie-choice";

export function hasAnalyticsConsent() {
  try { return window.localStorage.getItem(KEY) === "all"; } catch { return false; }
}

export default function CookieNotice() {
  const { t } = useI18n();
  const c = t.cookieNotice;
  const [show, setShow] = useState(false);

  // Read after mount: the server has no localStorage, and rendering the bar
  // during hydration would flash it at people who dismissed it long ago.
  useEffect(() => {
    try { if (!window.localStorage.getItem(KEY)) setShow(true); }
    catch { setShow(true); }     // storage blocked: show it, remember nothing
  }, []);

  function choose(value) {
    try { window.localStorage.setItem(KEY, value); } catch { /* ignore */ }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="ck" role="region" aria-label="Cookies">
      <div className="ck__inner">
        <p className="ck__text">
          {c.body}{" "}
          <Link href="/cookies" className="ck__link">{c.policy}</Link>
          {" · "}
          <Link href="/privacy" className="ck__link">{c.privacy}</Link>
        </p>
        <div className="ck__actions">
          {CONSENT_MODE ? (
            <>
              <button className="btn btn--ghost ck__btn" onClick={() => choose("essential")}>{c.reject}</button>
              <button className="btn btn--primary ck__btn" onClick={() => choose("all")}>{c.accept}</button>
            </>
          ) : (
            <button className="btn btn--primary ck__btn" onClick={() => choose("seen")}>{c.dismiss}</button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ck {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 80;
          background: var(--navy); color: #fff;
          border-top: 2px solid var(--gold);
          animation: ckUp 320ms var(--ease) both;
        }
        @keyframes ckUp { from { transform: translateY(100%); } to { transform: none; } }
        @media (prefers-reduced-motion: reduce) { .ck { animation: none; } }
        .ck__inner {
          max-width: var(--maxw); margin: 0 auto;
          padding: 16px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
        }
        .ck__text {
          margin: 0; font-size: 0.86rem; line-height: 1.5;
          color: rgba(255,255,255,0.88); max-width: 78ch;
        }
        .ck__link { color: #fff; text-decoration: underline; font-weight: 600; }
        .ck__actions { display: flex; gap: 10px; flex: none; }
        .ck__btn { padding: 9px 18px; font-size: 0.88rem; }
        .ck .btn--ghost { border-color: rgba(255,255,255,0.45); color: #fff; }
        .ck .btn--ghost:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
        .ck .btn--primary { background: var(--gold); color: #26200E; }
        .ck .btn--primary:hover { background: #D4B262; }
        @media (max-width: 720px) {
          .ck__inner { padding: 14px 16px; }
          .ck__actions { width: 100%; }
          .ck__btn { flex: 1; }
        }
      ` }} />
    </div>
  );
}
