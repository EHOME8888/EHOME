// app/lib/newsletter.js
// SERVER ONLY. Never import from a file carrying "use client".
//
// Storage and sending are both inert until their env vars exist, so the form
// can ship, render and be reviewed without collecting a single address.
//
//   NEWSLETTER_SUPABASE_URL          separate project from the client portal
//   NEWSLETTER_SUPABASE_SERVICE_KEY  service role; bypasses RLS; server only
//   RESEND_API_KEY                   sends the confirmation email
//   NEWSLETTER_FROM                  e.g. "EHOME <hello@mail.ehomeproperties.com>"

import crypto from "node:crypto";

const SUPA_URL = process.env.NEWSLETTER_SUPABASE_URL;
const SUPA_KEY = process.env.NEWSLETTER_SUPABASE_SERVICE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.NEWSLETTER_FROM;

export function storageConfigured() {
  return Boolean(SUPA_URL && SUPA_KEY);
}
export function senderConfigured() {
  return Boolean(RESEND_KEY && FROM);
}
export function newsletterLive() {
  return storageConfigured() && senderConfigured();
}

export function newToken() {
  return crypto.randomBytes(32).toString("base64url");
}

// A deliberately plain check. Address validity is proven by the confirmation
// email arriving, not by a clever regex.
export function looksLikeEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

async function rest(path, init = {}) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  return res;
}

/** Create or reset a pending subscription. Returns the token to email. */
export async function requestSubscription({ email, consentText, locale }) {
  const token = newToken();
  const row = {
    email: email.trim().toLowerCase(),
    status: "pending",
    token,
    consent_text: consentText,
    consent_locale: locale,
    requested_at: new Date().toISOString(),
    confirmed_at: null,
    unsubscribed_at: null,
  };
  // Re-subscribing, or asking again before confirming, replaces the pending row
  // and issues a fresh token, which invalidates any older link.
  const res = await rest("newsletter_subscribers?on_conflict=email", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`storage ${res.status}: ${await res.text()}`);
  return token;
}

export async function markConfirmed(token) {
  const res = await rest(
    `newsletter_subscribers?token=eq.${encodeURIComponent(token)}&status=eq.pending`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "confirmed", confirmed_at: new Date().toISOString() }),
    }
  );
  if (!res.ok) return false;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length === 1;
}

export async function markUnsubscribed(token) {
  const res = await rest(
    `newsletter_subscribers?token=eq.${encodeURIComponent(token)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() }),
    }
  );
  if (!res.ok) return false;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length === 1;
}

export async function sendConfirmationEmail({ to, confirmUrl, unsubscribeUrl, locale }) {
  const zh = locale === "zh";
  const subject = zh ? "请确认订阅 EHOME 易家邮件" : "Confirm your EHOME newsletter subscription";
  const body = zh
    ? `<p>您好，</p>
       <p>请点击下方链接确认订阅 EHOME 易家的邮件通讯。如果不是您本人操作，请忽略本邮件，我们不会再发送任何邮件。</p>
       <p><a href="${confirmUrl}">确认订阅</a></p>
       <p style="color:#566076;font-size:13px">如需随时退订：<a href="${unsubscribeUrl}">退订</a></p>
       <p style="color:#566076;font-size:13px">EHOME Properties Limited，于英格兰及威尔士注册（公司注册号 17343697）。</p>`
    : `<p>Hello,</p>
       <p>Please confirm you would like to receive the EHOME newsletter. If this was not you, ignore this email and we will not send you anything.</p>
       <p><a href="${confirmUrl}">Confirm subscription</a></p>
       <p style="color:#566076;font-size:13px">You can <a href="${unsubscribeUrl}">unsubscribe</a> at any time.</p>
       <p style="color:#566076;font-size:13px">EHOME Properties Limited, registered in England &amp; Wales (company number 17343697).</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      html: body,
      // Every marketing email carries an unsubscribe, as the Privacy Notice says.
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  if (!res.ok) throw new Error(`send ${res.status}: ${await res.text()}`);
}
