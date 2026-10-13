// app/api/newsletter/subscribe/route.js
import {
  newsletterLive, looksLikeEmail, requestSubscription, sendConfirmationEmail,
} from "../../../lib/newsletter";
import { SITE } from "../../../lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "bad request" }, { status: 400 }); }

  const email = body?.email;
  const locale = body?.locale === "zh" ? "zh" : "en";
  const consentText = typeof body?.consentText === "string" ? body.consentText.slice(0, 500) : null;

  // Consent is the lawful basis, so an unticked box is a hard stop.
  if (body?.consent !== true) return Response.json({ error: "consent_required" }, { status: 400 });
  if (!looksLikeEmail(email)) return Response.json({ error: "invalid_email" }, { status: 400 });

  // Nothing is stored and nothing is sent until both halves are configured.
  if (!newsletterLive()) return Response.json({ ok: true, inert: true });

  // Report WHICH half failed. "storage" and "send" leak nothing useful to an
  // attacker but turn a blind retry into a one-look diagnosis.
  let token;
  try {
    token = await requestSubscription({ email, consentText, locale });
  } catch (e) {
    console.error("[newsletter] STORAGE failed:", e instanceof Error ? e.message : e);
    return Response.json({ error: "failed", stage: "storage" }, { status: 500 });
  }

  try {
    await sendConfirmationEmail({
      to: email.trim().toLowerCase(),
      confirmUrl: `${SITE}/api/newsletter/confirm?token=${encodeURIComponent(token)}`,
      unsubscribeUrl: `${SITE}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
      locale,
    });
  } catch (e) {
    console.error("[newsletter] SEND failed:", e instanceof Error ? e.message : e);
    return Response.json({ error: "failed", stage: "send" }, { status: 500 });
  }

  // Same answer whether or not the address was already on the list: the
  // response must not reveal who is subscribed.
  return Response.json({ ok: true });
}
