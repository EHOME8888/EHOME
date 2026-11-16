"use client";
// app/components/AudienceCards.js
//
// "I'm a…": three doors into the portal, in one row.
//
// Until now the site had one way in, and it was a student's. A landlord or
// a partner reached the portal through the same Apply button, arrived at a
// student sign-up form and had to find their own door from there. Here each
// reader picks theirs first, and both links on a card go straight to the
// right page for them.
//
// What is deliberately not here: boxes, shadows, gradients, icons. The
// three are one row divided by hairlines, the way a printed table is, and
// the only gold is the short rule the rest of the site already uses to mark
// a label.
//
// Words come from the dictionary and addresses from lib/site.js, matched by
// `id`. A card whose id has no address is left out rather than rendered
// with a link to nowhere.
import { useI18n } from "../i18n/LanguageProvider";
import { PORTAL_ROUTES } from "../lib/site";
import Reveal from "./Reveal";

export default function AudienceCards() {
  const { t, lang } = useI18n();
  const a = t.audience;
  // The small label is the title's word in the other language, and says so,
  // so a screen reader pronounces it in the right voice.
  const labelLang = lang === "zh" ? "en" : "zh-CN";

  return (
    <section className="section section--tight aud" aria-labelledby="aud-title">
      <div className="container">
        <Reveal>
          <h2 id="aud-title">{a.title}</h2>
        </Reveal>

        <ul className="aud__row">
          {a.cards.map((c, i) => {
            const to = PORTAL_ROUTES[c.id];
            if (!to) return null;
            return (
              <Reveal as="li" key={c.id} delay={i * 90} className="aud__card">
                <p className="eyebrow aud__label" lang={labelLang}>{c.label}</p>
                <h3 className="aud__name">{c.title}</h3>
                <p className="aud__tag">{c.tagline}</p>
                {/* Two cards say "Create free account" and all three say
                    "Sign in". Read out of context, as a list of links is,
                    those are indistinguishable — so each one also carries
                    whose door it is. The visible words come first. */}
                <div className="aud__actions">
                  <a href={to.start} className="btn btn--primary aud__btn" aria-label={`${c.primary} — ${c.title}`}>
                    {c.primary}
                  </a>
                  <a href={to.signIn} className="btn aud__btn aud__btn--quiet" aria-label={`${c.secondary} — ${c.title}`}>
                    {c.secondary}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Cream is the brand's calm ground and is used nowhere else on this
           site, so it is named here rather than in the global tokens. The
           hairline is navy let down, not the cool grey --line: grey on a
           warm ground reads as a smudge. */
        .aud {
          --aud-cream: #F4F1EA;
          --aud-rule: rgba(27, 42, 87, 0.2);
          --aud-gap: var(--sp-9);
          background: var(--aud-cream);
          border-top: 1px solid var(--aud-rule);
          /* The hero's pinned stage is one screen tall and the section
             above this one is shorter than that, so on most screens the
             stage reaches down past it and would lie across this heading.
             Same answer as that section gives: its own layer, above the
             stage, on an opaque ground. */
          position: relative; z-index: 2;
        }
        .aud h2 { margin-bottom: var(--sp-8); }

        /* Three equal columns. The gap, not padding, sets them apart, so
           all three are the same width to write in; each hairline is drawn
           in the middle of the gap to its left. */
        .aud__row {
          list-style: none; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          column-gap: var(--aud-gap);
        }
        .aud__card { position: relative; display: flex; flex-direction: column; }
        .aud__card + .aud__card::before {
          content: ""; position: absolute; top: 0; bottom: 0;
          left: calc(var(--aud-gap) / -2); width: 1px;
          background: var(--aud-rule);
        }

        /* The label is a word to be read, not a caption, so it is set at
           text size. Navy, never gold: gold is 2.1:1 on this ground. */
        .aud__label { font-size: 0.9375rem; line-height: 1.4; }
        .aud__name {
          margin-top: var(--sp-4);
          font-size: clamp(1.7rem, 2.5vw, 2.1rem); line-height: 1.15;
        }
        :lang(zh) .aud__name { line-height: 1.3; }
        .aud__tag {
          margin-top: var(--sp-3);
          font-size: var(--step-1); line-height: 1.55;
          color: var(--muted); max-width: 30ch;
        }

        /* Pushed to the foot of the card, so the three pairs of buttons
           sit on one line whatever the length of the sentence above. */
        .aud__actions {
          display: flex; flex-wrap: wrap; gap: var(--sp-3);
          margin-top: auto; padding-top: var(--sp-6);
        }
        .aud__btn { min-height: 48px; padding-inline: 20px; white-space: nowrap; }
        .aud__btn--quiet { border-color: var(--navy); color: var(--navy); background: transparent; }
        .aud__btn--quiet:hover { background: rgba(27, 42, 87, 0.06); }
        .aud .btn--primary:hover { box-shadow: none; }
        /* The site's focus ring is gold, which this ground swallows. */
        .aud a:focus-visible { outline: 2px solid var(--navy); outline-offset: 3px; }

        /* Narrow columns cannot hold "Create free account" beside "Sign
           in". All three cards stack their buttons together, rather than
           one card keeping a row while its neighbours break. */
        @media (max-width: 1100px) {
          .aud { --aud-gap: var(--sp-8); }
          .aud__actions { flex-direction: column; }
        }

        /* A phone: one column, same order, a hairline between. */
        @media (max-width: 767.98px) {
          .aud h2 { margin-bottom: var(--sp-6); }
          .aud__row { grid-template-columns: 1fr; }
          .aud__card { padding: var(--sp-6) 0; }
          .aud__card:first-child { padding-top: 0; }
          .aud__card:last-child { padding-bottom: 0; }
          .aud__card + .aud__card::before {
            top: 0; bottom: auto; left: 0; right: 0; width: auto; height: 1px;
          }
          .aud__tag { max-width: none; }
          .aud__actions { flex-direction: row; padding-top: var(--sp-5); }
          .aud__btn { flex: 1 1 auto; }
        }
      ` }} />
    </section>
  );
}
