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

/* ---- The set grows for the inner pages. Same grid, same stroke, same
   restraint: nothing below reads as insurance either. ---- */

/** A document — the form, the deed, the evidence. */
export const IconDocument = (p) => (
  <Svg {...p}>
    <path d="M7 3.6h6.6L18.4 8.4v10.4a1.6 1.6 0 0 1-1.6 1.6H7a1.6 1.6 0 0 1-1.6-1.6V5.2A1.6 1.6 0 0 1 7 3.6z" />
    <path d="M13.4 3.6v5h5" />
    <path d="M8.6 12.2h6.8M8.6 15.6h6.8" />
  </Svg>
);

/** An ID card — passport, national ID, who you are. */
export const IconIdentity = (p) => (
  <Svg {...p}>
    <rect x="3" y="5.4" width="18" height="13.2" rx="2" />
    <circle cx="8.6" cy="11" r="2" />
    <path d="M5.9 15.8c.5-1.5 1.5-2.2 2.7-2.2s2.2.7 2.7 2.2" />
    <path d="M14 10h4M14 13.4h4" />
  </Svg>
);

/** A magnifier — review, cross-check, assess. */
export const IconAssess = (p) => (
  <Svg {...p}>
    <circle cx="10.6" cy="10.6" r="6" />
    <path d="m15.2 15.2 5 5" />
  </Svg>
);

/** A pen on a line — we sign. */
export const IconSign = (p) => (
  <Svg {...p}>
    <path d="m14.6 5.4 4 4-9.4 9.4H5.2v-4z" />
    <path d="m12.8 7.2 4 4" />
    <path d="M4 20.4h16" />
  </Svg>
);

/** A house with a door — the home itself. */
export const IconHome = (p) => (
  <Svg {...p}>
    <path d="m3.6 11.2 8.4-7 8.4 7" />
    <path d="M5.8 9.6v9.2a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1V9.6" />
    <path d="M10 19.8v-5.6h4v5.6" />
  </Svg>
);

/** Three bars — financial strength, read as a chart rather than a coin. */
export const IconFinance = (p) => (
  <Svg {...p}>
    <path d="M4.4 19.6h15.2" />
    <path d="M7.4 16V11.2M12 16V7M16.6 16v-3.2" />
  </Svg>
);

/** Two people — a sponsor, a family, dealing with us directly. */
export const IconPeople = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8.4" r="3.1" />
    <path d="M3.6 19.2c.6-3.2 2.7-4.9 5.4-4.9s4.8 1.7 5.4 4.9" />
    <path d="M15.2 5.6a3.1 3.1 0 0 1 0 5.6" />
    <path d="M16.8 14.5c2 .5 3.3 2.1 3.7 4.7" />
  </Svg>
);

/** A tick — drawn, so it is the same tick on every phone and in WeChat. */
export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.6 4.3 4.2L19 7.4" />
  </Svg>
);
