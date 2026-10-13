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

  return Response.json({
    serviceKeyShape: shape,
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
