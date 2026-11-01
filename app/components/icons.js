// app/components/icons.js
//
// An original outline set, drawn here rather than installed or copied.
// One 24x24 grid, one stroke weight, round caps and joins, currentColor —
// so the six of them read as one family at 20px and at 34px.
//
// WHAT IS DELIBERATELY ABSENT: no shield, no umbrella, no safe, no padlock
// over a document, nothing that reads as insurance. EHOME is a guarantor,
// and the icons have to say that as carefully as the copy does — a shield
// beside "we stand in as your guarantor" implies cover we do not sell.
// `confidential` is a plain lock about document handling, not protection.
//
// No library: lucide would be a dependency and a house style that is not
// ours, for six glyphs.

function Svg({ children, size = 24 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Graduation cap — built for international students. */
export const IconStudent = (p) => (
  <Svg {...p}>
    <path d="M12 4.2 2.9 8.6 12 13l9.1-4.4z" />
    <path d="M6.7 10.7v4c0 1.7 2.4 3 5.3 3s5.3-1.3 5.3-3v-4" />
    <path d="M20.5 9.4v4.3" />
  </Svg>
);

/** Price tag — one clear fee. A tag, not a coin: the point is the price is stated, not that money exists. */
export const IconFee = (p) => (
  <Svg {...p}>
    <path d="M4 4h7.3l8.7 8.7-7.3 7.3L4 11.3z" />
    <circle cx="8.1" cy="8.1" r="1.3" />
  </Svg>
);

/** Two speech bubbles — bilingual support, in two voices rather than one. */
export const IconBilingual = (p) => (
  <Svg {...p}>
    <path d="M13.8 13.2H7.6l-3.3 2.7v-2.7a1.5 1.5 0 0 1-1.3-1.5V6.2a1.5 1.5 0 0 1 1.5-1.5h9.3a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5z" />
    <path d="M17.6 8.4h2.1a1.5 1.5 0 0 1 1.5 1.5v5.2a1.5 1.5 0 0 1-1.5 1.5v2.5l-3-2.5h-4.4" />
  </Svg>
);

/** Clock — a decision in 48 hours. */
export const IconFast = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.3V12l3.3 2" />
  </Svg>
);

/** Key — more homes open to you, because the landlord says yes. */
export const IconAccess = (p) => (
  <Svg {...p}>
    <circle cx="8.2" cy="8.2" r="3.9" />
    <path d="m10.9 10.9 8.9 8.9" />
    <path d="m14.3 14.3 2.1-2.1" />
    <path d="m17.1 17.1 2.1-2.1" />
  </Svg>
);

/** Lock — documents kept confidential. About handling, not cover. */
export const IconConfidential = (p) => (
  <Svg {...p}>
    <rect x="4.6" y="10.4" width="14.8" height="9.3" rx="2.1" />
    <path d="M8.1 10.4V7.9a3.9 3.9 0 0 1 7.8 0v2.5" />
    <path d="M12 14.2v2" />
  </Svg>
);

/** In the order the four hero bullets are written. */
export const HERO_ICONS = [IconAccess, IconFast, IconBilingual, IconStudent];

/** In the order the four Why-Ehome cards are written. */
export const TRUST_ICONS = [IconStudent, IconFee, IconBilingual, IconConfidential];
