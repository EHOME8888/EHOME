"use client";

import Link from "next/link";
import { PORTAL_SIGNUP_URL } from "./lib/site";
import HeroStage from "./components/HeroStage";
import ScrubWords from "./components/ScrubWords";
import { TRUST_ICONS } from "./components/icons";
import IconDisc from "./components/IconDisc";
import StepScene from "./components/StepScene";
import ProcessStory from "./components/ProcessStory";
import { useI18n } from "./i18n/LanguageProvider";
import Reveal from "./components/Reveal";
import QuoteEstimator from "./components/QuoteEstimator";
import Faq from "./components/Faq";
import Marquee from "./components/Marquee";
import AudienceCards from "./components/AudienceCards";

const STAR = "M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z";

/* A rating out of five, as the reviewer gave it. Read out as one phrase. */
function Stars({ n, label }) {
  return (
    <div className="tm__stars" role="img" aria-label={label.replace("{n}", n)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" data-off={i > n ? "" : undefined}>
          <path d={STAR} />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      {/* ---------- Hero ---------- */}
      {/* Holds in place while its scene plays, then the next section rises
          over it. See components/HeroStage.js. */}
      <HeroStage />

      {/* ---------- What we do ---------- */}
      <section className="section what hero-next" id="what">
        <div className="container what__grid">
          <Reveal>
            <p className="eyebrow">{t.what.eyebrow}</p>
            <h2><ScrubWords text={t.what.title} /></h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="what__body">{t.what.body}</p>
            <p className="guarantee-note">{t.guaranteeNote}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- I'm a…: three doors into the portal ---------- */}
      <AudienceCards />

      {/* ---------- Fee estimator (own section) ---------- */}
      <section className="section estimate-sec" id="estimate">
        <div className="container estimate__grid">
          <Reveal className="estimate__intro">
            <p className="eyebrow">{t.pricing.eyebrow}</p>
            <h2>{t.estimator.title}</h2>
            <p className="lead">{t.pricing.lead}</p>
          </Reveal>
          <Reveal delay={120} className="estimate__widget">
            <QuoteEstimator />
          </Reveal>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section how" id="how">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{t.how.eyebrow}</p>
            <h2>{t.how.title}</h2>
          </Reveal>
          <ol className="steps">
            {t.how.steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 90} className="step">
                {/* The scenes play one at a time: each waits a full slot for
                    the one before it, so the row reads 01 → 02 → 03 → 04
                    rather than four things moving at once. On a phone the
                    cards stack and each plays as it is scrolled to. */}
                <StepScene step={i} delay={i * StepScene.SLOT_MS} className="step__scene" />
                <span className="step__n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Why trust us ---------- */}
      <section className="section trust">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{t.trust.eyebrow}</p>
            <h2>{t.trust.title}</h2>
          </Reveal>
          <div className="trust__grid">
            {t.trust.items.map((it, i) => (
              <Reveal key={it.t} delay={i * 90} className="trust__item">
                <IconDisc icon={TRUST_ICONS[i % TRUST_ICONS.length]} size="lg" className="trust__icon" />
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="section testimonials">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{t.testimonials.eyebrow}</p>
            <h2>{t.testimonials.title}</h2>
          </Reveal>
        </div>
        {/* A short set needs more copies to stay wider than the screen. */}
        <Marquee
          variant="reviews"
          items={t.testimonials.items}
          copies={t.testimonials.items.length >= 6 ? 3 : 4}
          itemClassName="tm"
          pauseLabel={t.testimonials.pause}
          playLabel={t.testimonials.play}
          renderItem={(tm) => (
            <>
              <div>
                {/* Shown only for a review that came with a rating. */}
                {tm.stars ? <Stars n={tm.stars} label={t.testimonials.starsLabel} /> : null}
                <p className="tm__quote">“{tm.quote}”</p>
              </div>
              <div className="tm__who">
                <strong>{tm.name}</strong>
                {tm.role && <span>{tm.role}</span>}
              </div>
            </>
          )}
        />
      </section>

      {/* ---------- Universities (rolling logo row) ---------- */}
      <section className="section partners" id="partners">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{t.partners.eyebrow}</p>
            <h2>{t.partners.title}</h2>
            <p className="lead">{t.partners.lead}</p>
          </Reveal>
        </div>
        <Marquee
          variant="logos"
          items={t.partners.items}
          itemKey={(u) => u.abbr}
          itemClassName="uni"
          pauseLabel={t.partners.pause}
          playLabel={t.partners.play}
          renderItem={(u, copy) => (
            <img src={u.logo} alt={copy ? "" : u.name} className="uni__logo" decoding="async" draggable="false" />
          )}
        >
          <p className="partners__cta">
            {t.partners.cta}{" "}
            <Link href="/contact">{t.partners.ctaLink}</Link>
          </p>
        </Marquee>
      </section>

      {/* ---------- FAQ ---------- */}
      <Faq />

      {/* ---------- The Golden Thread: the four steps as one story ---------- */}
      <ProcessStory />

      {/* ---------- Final CTA ---------- */}
      <section className="section closing">
        <div className="container">
          <Reveal className="cta">
            <h2>{t.contact.title}</h2>
            <p>{t.contact.lead}</p>
            <div className="cta__actions">
              <a href={PORTAL_SIGNUP_URL} className="btn btn--primary">{t.hero.ctaApply}</a>
              {/* btn--ghost is navy text on a transparent background. The
                  panel behind this one is also navy, so that button rendered
                  as an empty outline with invisible words in it. Anything on
                  a dark panel takes the on-dark variant. */}
              <Link href="/contact" className="btn btn--on-dark">{t.hero.ctaPrimary}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* The hero's own styles live with it, in components/HeroStage.js. */
        .cta__actions {
          display: flex; gap: var(--sp-3); flex-wrap: wrap; justify-content: center;
        }
        /* Ghost on a dark panel: the hero and the closing call to action. */
        .btn--on-dark { border-color: rgba(255,255,255,0.4); color: #fff; background: transparent; }
        .btn--on-dark:hover { border-color: #fff; background: rgba(255,255,255,0.08); }

        /* ---- What ---- */
        /* The heading is read into view: see components/ScrubWords.js. Each
           unit's strength is how far the reading has got past it, spread
           over about three units so the edge is soft. */
        .scrub__u {
          opacity: clamp(0.16, calc((var(--r, 1) * (var(--n) + 3) - var(--i)) / 3), 1);
          transition: opacity 140ms linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .scrub__u { opacity: 1; transition: none; }
        }
        .what__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
        .what__grid h2 { margin-top: 14px; }
        .what__body { color: var(--muted); font-size: 1.12rem; }
        .guarantee-note { margin-top: 18px; font-size: 0.86rem; color: var(--muted);
          border-left: 2px solid var(--gold-soft); padding-left: 12px; }

        /* ---- Estimator section ---- */
        .estimate-sec { background: var(--surface); border-block: 1px solid var(--line); }
        .estimate__grid { display: grid; grid-template-columns: 1fr 0.92fr; gap: 72px; align-items: center; }
        .estimate__intro h2 { margin-top: 12px; }
        .estimate__intro .lead { margin-top: 14px; color: var(--muted); font-size: 1.1rem; max-width: 46ch; }

        /* ---- How ---- */
        .how { background: var(--surface); border-block: 1px solid var(--line); }
        .steps { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 44px 36px; }
        .step__scene {
          background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius);
          padding: 10px; margin-bottom: 18px;
        }
        /* The scene is the picture now; the number is a caption above the
           title, as on the process page. */
        .step__n { display: block; font-size: 0.76rem; letter-spacing: 0.12em; color: var(--gold); margin-bottom: 6px; }
        .step h3 { margin-bottom: 8px; }
        .step p { color: var(--muted); }

        /* ---- Trust ---- */
        .trust__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 52px 72px; }
        .trust__item { position: relative; }
        /* The disc itself is the site-wide IconDisc; only its placement is
           this section's business. */
        .trust__icon { margin-bottom: var(--sp-5); }
        .trust__item h3 { margin-bottom: 8px; }
        .trust__item p { color: var(--muted); }

        /* ---- Testimonials ---- */
        .testimonials { background: var(--surface); border-block: 1px solid var(--line); }
        /* The row itself is components/Marquee.js. */
        .tm__stars { display: flex; gap: 3px; margin-bottom: var(--sp-4); }
        .tm__stars svg { width: 18px; height: 18px; fill: var(--gold); stroke: #8f6f24; stroke-width: 1; }
        .tm__stars svg[data-off] { fill: transparent; stroke: var(--muted); }
        .tm { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius);
          padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; }
        .tm__quote { font-size: 1.05rem; color: var(--ink); }
        .tm__who { display: flex; flex-direction: column; gap: 2px; }
        .tm__who strong { color: var(--brand); }
        .tm__who span { font-size: 0.88rem; color: var(--muted); }

        /* ---- Universities ---- */
        /* The row itself is components/Marquee.js. */
        .partners__cta { margin: 0; color: var(--muted); }
        .partners__cta a { color: var(--brand); font-weight: 600; border-bottom: 1px solid var(--gold); }

        /* ---- Final CTA ---- */
        .cta { text-align: center; background: var(--brand); color: #fff; border-radius: 24px; padding: 76px 24px; }
        .cta p { margin: 14px auto 30px; max-width: 46ch; opacity: 0.85; }
        .cta .btn--primary { background: var(--gold); color: #21160a; }
        .cta .btn--primary:hover { background: #d5ab5f; }

        @media (max-width: 960px) { .steps { grid-template-columns: repeat(2, 1fr); } }
        /* A phone gets one card per row. Two across at 375px leaves each
           scene 146px wide, which is a thumbnail, not an explainer. */
        @media (max-width: 600px) { .steps { grid-template-columns: 1fr; gap: 36px; } }
        @media (max-width: 820px) {
          .what__grid, .estimate__grid { grid-template-columns: 1fr; }
          .trust__grid { grid-template-columns: 1fr; }
        }
      ` }} />
    </>
  );
}
