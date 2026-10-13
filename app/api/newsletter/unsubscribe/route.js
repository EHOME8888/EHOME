// app/api/newsletter/unsubscribe/route.js
// A real endpoint with a stored token, not a mailto. GET serves the link in
// an email; POST serves List-Unsubscribe one-click, which mail clients fire
// without a browser.
import { redirect } from "next/navigation";
import { markUnsubscribed, storageConfigured } from "../../../lib/newsletter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function run(token) {
  if (!token || !storageConfigured()) return false;
  try { return await markUnsubscribed(token); }
  catch (e) { console.error("[newsletter] unsubscribe failed:", e instanceof Error ? e.message : e); return false; }
}

export async function GET(request) {
  const ok = await run(new URL(request.url).searchParams.get("token"));
  redirect(ok ? "/newsletter/unsubscribed" : "/newsletter/link-expired");
}

export async function POST(request) {
  await run(new URL(request.url).searchParams.get("token"));
  return new Response(null, { status: 200 });
}
