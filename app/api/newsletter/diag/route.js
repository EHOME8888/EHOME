// app/api/newsletter/diag/route.js
// Reports the SHAPE of the newsletter configuration, never any value: whether
// each variable is present, how long it is, and whether the storage round trip
// works. Enough to diagnose a misconfiguration without exposing a secret.
import { storageConfigured, senderConfigured } from "../../../lib/newsletter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEWSLETTER_SUPABASE_URL || "";
  const key = process.env.NEWSLETTER_SUPABASE_SERVICE_KEY || "";
  const resend = process.env.RESEND_API_KEY || "";
  const from = process.env.NEWSLETTER_FROM || "";

  // A Supabase service_role JWT carries "role":"service_role" in its payload.
  // Pasting the anon key here is the single most likely misconfiguration, and
  // it fails with a confusing RLS error, so name it explicitly.
  let keyRole = "unknown";
  try {
    const payload = JSON.parse(
      Buffer.from(key.split(".")[1] || "", "base64").toString("utf8")
    );
    keyRole = payload?.role || "unknown";
  } catch { /* new-style sb_secret_ keys are not JWTs */ }
  if (key.startsWith("sb_secret_")) keyRole = "service_role (new format)";
  if (key.startsWith("sb_publishable_")) keyRole = "publishable — WRONG KEY";

  let storageReachable = null, storageStatus = null;
  if (storageConfigured()) {
    try {
      const res = await fetch(
        `${url}/rest/v1/newsletter_subscribers?select=id&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" }
      );
      storageStatus = res.status;
      storageReachable = res.ok;
      if (!res.ok) storageStatus = `${res.status}: ${(await res.text()).slice(0, 200)}`;
    } catch (e) {
      storageStatus = e instanceof Error ? e.message : String(e);
      storageReachable = false;
    }
  }

  // Shape only. A JWT's first three characters are always "eyJ" and its
  // structure is public, so reporting them identifies a wrong paste without
  // revealing anything usable.
  const shape = {
    length: key.length,
    segments: key.split(".").length,
    prefix: key.slice(0, 3),
    verdict:
      !key ? "empty"
      : key.startsWith("sb_secret_") ? "looks like a new-format secret key — good"
      : key.startsWith("sb_publishable_") ? "this is the PUBLISHABLE key — wrong one"
      : key.split(".").length === 3 && key.startsWith("eyJ") ? "looks like a JWT — check it is service_role, not anon"
      : key.length < 60 ? "too short for a Supabase key — likely the JWT Secret, project id, or a database password"
      : "not a JWT and not an sb_ key — wrong value",
  };

  const resendShape = {
    length: resend.length,
    segments: resend.split(".").length,
    prefix: resend.slice(0, 3),
    verdict:
      !resend ? "empty"
      : resend.startsWith("re_") ? "looks like a Resend key — good"
      : resend.startsWith("eyJ") && resend.split(".").length === 3 ? "this is a SUPABASE JWT in the Resend slot — the two values are swapped"
      : resend.startsWith("sb_") ? "this is a Supabase key in the Resend slot"
      : "not a Resend key — Resend keys always start re_",
  };

  // Ask Resend which domains are verified. This validates the key and shows
  // whether NEWSLETTER_FROM's domain is actually allowed to send -- the usual
  // cause of a send failure once the key is right. No email is sent.
  let resendStatus = null, verifiedDomains = null, fromDomainOk = null;
  if (resend.startsWith("re_")) {
    try {
      const r = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${resend}` }, cache: "no-store",
      });
      resendStatus = r.status;
      if (r.ok) {
        const d = await r.json();
        verifiedDomains = (d?.data ?? []).map((x) => `${x.name} [${x.status}]`);
        const fromDomain = (from.match(/@([^>\s]+)/) || [])[1];
        fromDomainOk = fromDomain
          ? (d?.data ?? []).some((x) => x.name === fromDomain && x.status === "verified")
          : null;
      } else {
        resendStatus = `${r.status}: ${(await r.text()).slice(0, 200)}`;
      }
    } catch (e) {
      resendStatus = e instanceof Error ? e.message : String(e);
    }
  }

  // Exercise the real write path: the same upsert the signup uses, then clean
  // up. A readable table does not prove an insertable one -- a missing column
  // or a bad on_conflict target fails only on write.
  let writeOk = null, writeError = null, rowCount = null;
  if (storageConfigured()) {
    const probeEmail = `diag-probe-${Date.now()}@example.invalid`;
    try {
      const w = await fetch(`${url}/rest/v1/newsletter_subscribers?on_conflict=email`, {
        method: "POST",
        headers: {
          apikey: key, Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          email: probeEmail, status: "pending", token: `diag-${Date.now()}`,
          consent_text: "diagnostic probe", consent_locale: "en",
        }),
        cache: "no-store",
      });
      writeOk = w.ok;
      if (!w.ok) writeError = `${w.status}: ${(await w.text()).slice(0, 300)}`;
      await fetch(`${url}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(probeEmail)}`, {
        method: "DELETE",
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      });
      const cnt = await fetch(`${url}/rest/v1/newsletter_subscribers?select=id`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact", Range: "0-0" },
        cache: "no-store",
      });
      rowCount = cnt.headers.get("content-range");
    } catch (e) {
      writeOk = false;
      writeError = e instanceof Error ? e.message : String(e);
    }
  }

  return Response.json({
    serviceKeyShape: shape,
    writeOk,
    writeError,
    rowCount,
    resendStatus,
    verifiedDomains,
    fromDomainVerified: fromDomainOk,
    resendKeyShape: resendShape,
    storageConfigured: storageConfigured(),
    senderConfigured: senderConfigured(),
    supabaseUrl: url ? url.replace(/^https:\/\/([a-z0-9]{6}).*/, "https://$1…supabase.co") : null,
    serviceKeyPresent: Boolean(key),
    serviceKeyRole: key ? keyRole : null,
    resendKeyPresent: Boolean(resend),
    resendKeyLooksRight: resend.startsWith("re_"),
    fromAddress: from || null,
    storageReachable,
    storageStatus,
  });
}
