// app/api/newsletter/confirm/route.js
// The link in the confirmation email. Double opt-in completes here.
import { redirect } from "next/navigation";
import { markConfirmed, storageConfigured } from "../../../lib/newsletter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  let ok = false;
  if (token && storageConfigured()) {
    try { ok = await markConfirmed(token); }
    catch (e) { console.error("[newsletter] confirm failed:", e instanceof Error ? e.message : e); }
  }
  redirect(ok ? "/newsletter/confirmed" : "/newsletter/link-expired");
}
