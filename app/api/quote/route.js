// app/api/quote/route.js
// Returns a final fee for the public estimator. The calculation lives on the
// server so the pricing model never reaches the browser bundle.
import { quoteFor } from "../../lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }

  const fee = quoteFor({
    annualRent: body?.annualRent,
    universityId: body?.universityId,
  });

  return Response.json({ fee });
}
