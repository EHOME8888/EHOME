// app/lib/pricing.js
//
// SERVER ONLY. Never import this from a file carrying "use client" — doing so
// ships the pricing model to the browser, where anyone can read it in the
// bundle. It is imported by app/api/quote/route.js and nothing else.
//
// The public UI shows a final figure and nothing else: no band, no uplift, no
// explanation of why one institution differs from another.

const UPLIFT = 1.2;

// Institutions assessed in the higher band. Keys match the `id` values in
// app/i18n/dictionary.js, which carries names only.
const HIGHER_BAND = new Set(["lse", "queenmary", "warwick"]);

export function quoteFor({ annualRent, universityId }) {
  const rent = Number(String(annualRent ?? "").replace(/[^0-9.]/g, "")) || 0;
  const monthly = rent / 12;

  // An unlisted institution cannot be assessed, so it takes the higher band.
  const multiplier =
    !universityId || HIGHER_BAND.has(universityId) ? UPLIFT : 1;

  return Math.round(monthly * multiplier);
}
