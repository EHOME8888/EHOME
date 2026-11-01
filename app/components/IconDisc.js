// app/components/IconDisc.js
//
// The one way an icon is presented anywhere on the site: a thin gold ring,
// a faint wash, a line icon centred inside it. Its styles live in
// globals.css so there is a single copy, and every page — the homepage
// included — renders this component rather than its own circle.
//
//   tone  "light"  on paper/white: gold ring, navy icon (gold on white is
//                  too faint for a glyph to be read)
//         "dark"   on navy/photographs: gold ring, gold icon
//   size  "sm" 30px beside a line of text · "md" 44px beside a heading ·
//         "lg" 56px above a card title
//   enter true     settles in (scale + fade) once an enclosing .reveal is
//                  visible. Pass false when there is no enclosing Reveal,
//                  or it will never appear.
const PX = { sm: 16, md: 20, lg: 26 };

export default function IconDisc({ icon: Icon, tone = "light", size = "md", enter = true, className = "" }) {
  return (
    <span
      className={`icon-disc icon-disc--${tone} icon-disc--${size} ${enter ? "icon-disc--enter" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      <Icon size={PX[size]} />
    </span>
  );
}
