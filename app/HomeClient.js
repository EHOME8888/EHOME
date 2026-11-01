"use client";

import Link from "next/link";
import { PORTAL_SIGNUP_URL } from "./lib/site";
import HeroPhoto from "./components/HeroPhoto";
import { HERO_ICONS, TRUST_ICONS } from "./components/icons";
import IconDisc from "./components/IconDisc";
import { useI18n } from "./i18n/LanguageProvider";
import Reveal from "./components/Reveal";
import QuoteEstimator from "./components/QuoteEstimator";
import Faq from "./components/Faq";

function MultiLine({ text }) {
  const parts = text.split("\n");
  return parts.map((line, i) => (
    <span key={i}>
      {line}
      {i < parts.length - 1 && <br />}
    </span>
  ));
}

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      {/* ---------- Hero (London intro) ---------- */}
      <section className="hero">
        <HeroPhoto />
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="hero__rule" aria-hidden="true" />
            {/* Staggered entrance: 90ms apart, in reading order. Reveal
                handles prefers-reduced-motion, so this degrades to the text
                simply being there. */}
            <Reveal immediate className="reveal--lift"><p className="eyebrow">{t.hero.eyebrow}</p></Reveal>
            <Reveal immediate className="reveal--lift" delay={90}><h1><MultiLine text={t.hero.title} /></h1></Reveal>
            <Reveal immediate className="reveal--lift" delay={180}><p className="hero__lead">{t.hero.lead}</p></Reveal>
            <Reveal immediate className="reveal--lift hero__bullets" delay={270} as="ul">
              {t.hero.bullets.map((b, i) => {
                const Icon = HERO_ICONS[i % HERO_ICONS.length];
                return (
                  <li key={b}>
                    <IconDisc icon={Icon} tone="dark" size="sm" />
                    <span>{b}</span>
                  </li>
                );
              })}
            </Reveal>
            <Reveal immediate className="reveal--lift hero__actions" delay={360}>
              {/* The first thing on the first page is the thing we want them
                  to do. It leaves for the portal rather than routing through
                  an enquiry form: someone who has decided should not have to
                  ask us first. */}
              <a href={PORTAL_SIGNUP_URL} className="btn btn--gold">{t.hero.ctaApply}</a>
              {/* Down to the next screen, not away to another page. #what
                  already exists and globals.css already has smooth scrolling
                  with a reduced-motion override. */}
              <a href="#what" className="btn btn--on-dark">{t.hero.ctaLearn}</a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- What we do ---------- */}
      <section className="section what" id="what">
        <div className="container what__grid">
          <Reveal>
            <p className="eyebrow">{t.what.eyebrow}</p>
            <h2>{t.what.title}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="what__body">{t.what.body}</p>
            <p className="guarantee-note">{t.guaranteeNote}</p>
          </Reveal>
        </div>
      </section>

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
          <div className="tm__grid">
            {t.testimonials.items.map((tm, i) => (
              <Reveal key={i} delay={i * 90} className="tm">
                <p className="tm__quote">“{tm.quote}”</p>
                <div className="tm__who">
                  <strong>{tm.name}</strong>
                  {tm.role && <span>{tm.role}</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Universities (logo wall) ---------- */}
      <section className="section partners" id="partners">
        <div className="container">
          <Reveal className="sec-head">
            <p className="eyebrow">{t.partners.eyebrow}</p>
            <h2>{t.partners.title}</h2>
            <p className="lead">{t.partners.lead}</p>
          </Reveal>
          <div className="partners__grid">
            {t.partners.items.map((u, i) => (
              <Reveal key={u.abbr} delay={i * 70} className="uni">
                <img src={u.logo} alt={u.name} className="uni__logo" />
              </Reveal>
            ))}
          </div>
          <p className="partners__cta">
            {t.partners.cta}{" "}
            <Link href="/contact">{t.partners.ctaLink}</Link>
          </p>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <Faq />

      {/* ---------- Final CTA ---------- */}
      <section className="section">
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
        /* ---- Hero ---- */
        /* The hero is the one place the site raises its voice. A deep navy
           field, the footage held well back behind it, and a fine engraved
           rule texture across the whole thing -- the visual language of a
           deed or a banknote rather than a decorative gradient wash. */
        .hero {
          position: relative; min-height: 88vh;
          display: flex; align-items: center; overflow: hidden;
          background: var(--navy-deep);
        }
        .hero__bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0;
        }
        .hero__overlay {
          position: absolute; inset: 0; z-index: 2;
          /* Two scrims, not one. The brief asks for darkening from the
             bottom up, and that alone would not carry left-aligned text
             sitting at mid-height — so the bottom-up pass sets the mood and
             a left-hand pass does the contrast work. Behind the headline the
             two combine to about 0.96 navy, which puts white text over 10:1
             against anything the photograph can do, including the pale sky.
             The right-hand side stays clear so the bridge is actually seen. */
          background:
            linear-gradient(to top,
              rgba(20,31,66,0.92) 0%,
              rgba(20,31,66,0.42) 46%,
              rgba(20,31,66,0.12) 100%),
            linear-gradient(96deg,
              rgba(20,31,66,0.95) 0%,
              rgba(20,31,66,0.82) 40%,
              rgba(20,31,66,0.34) 72%,
              rgba(20,31,66,0.04) 100%);
        }
        .cta__actions {
          display: flex; gap: var(--sp-3); flex-wrap: wrap; justify-content: center;
        }
        .hero__inner { position: relative; z-index: 3; padding: var(--sp-10) var(--sp-5); }
        /* 44ch is a reading measure, and the headline is not reading matter.
           At 44ch the display face broke "for renting in the UK" again and
           left "UK" alone on a fourth line. The lead and the bullets keep
           their own narrower caps, so widening the column only affects the
           headline. */
        .hero__text { max-width: 760px; }

        .hero__rule {
          display: block; width: 72px; height: 2px;
          background: var(--gold); margin-bottom: var(--sp-6);
          transform-origin: left center;
        }
        .hero h1 { color: #fff; margin: var(--sp-4) 0 var(--sp-5); }
        .hero__lead {
          color: rgba(255,255,255,0.82);
          font-size: var(--step-1); max-width: 46ch;
        }
        .hero__bullets {
          list-style: none; padding: 0; margin: var(--sp-6) 0 var(--sp-7);
          display: grid; gap: var(--sp-3);
          max-width: 44ch;
        }
        .hero__bullets li {
          display: flex; align-items: center; gap: var(--sp-3);
          color: rgba(255,255,255,0.92); font-size: 0.96rem;
        }

        .hero__actions { display: flex; gap: var(--sp-3); flex-wrap: wrap; }
        /* Ghost on a dark panel: the hero and the closing call to action. */
        .btn--on-dark { border-color: rgba(255,255,255,0.4); color: #fff; background: transparent; }
        .btn--on-dark:hover { border-color: #fff; background: rgba(255,255,255,0.08); }

        /* One orchestrated entrance: the rule draws, then the text rises
           behind it. Nothing else on the site animates on load. */
        .hero__rule { animation: drawRule 620ms var(--ease) 80ms both; }
        .hero__text > *:not(.hero__rule) { animation: riseIn 620ms var(--ease) both; }
        .hero__text > *:nth-child(2) { animation-delay: 220ms; }
        .hero__text > *:nth-child(3) { animation-delay: 310ms; }
        .hero__text > *:nth-child(4) { animation-delay: 400ms; }
        .hero__text > *:nth-child(5) { animation-delay: 480ms; }
        .hero__text > *:nth-child(6) { animation-delay: 560ms; }
        @media (prefers-reduced-motion: reduce) {
          .hero__rule, .hero__text > * { animation: none; }
        }
        @media (max-width: 720px) {
          .hero { min-height: 76vh; }
          .hero__text { max-width: none; }
        }

        /* ---- What ---- */
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
        .step__n { display: inline-grid; place-items: center; width: 46px; height: 46px;
          border: 1px solid var(--gold-soft); border-radius: 999px;
          font-family: var(--font-display); color: var(--gold); font-size: 1.05rem; margin-bottom: 16px; }
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
        .tm__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .tm { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius);
          padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; }
        .tm__quote { font-size: 1.05rem; color: var(--ink); }
        .tm__who { display: flex; flex-direction: column; gap: 2px; }
        .tm__who strong { color: var(--brand); }
        .tm__who span { font-size: 0.88rem; color: var(--muted); }

        /* ---- Universities ---- */
        .partners__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .uni { display: flex; align-items: center; justify-content: center; height: 128px; padding: 24px;
          border: 1px solid var(--line); border-radius: var(--radius); background: #ffffff;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
        .uni:hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: 0 18px 34px -24px rgba(18,35,63,0.35); }
        .uni__logo { max-height: 66px; max-width: 100%; width: auto; }
        .partners__cta { margin-top: 28px; color: var(--muted); }
        .partners__cta a { color: var(--brand); font-weight: 600; border-bottom: 1px solid var(--gold); }

        /* ---- Final CTA ---- */
        .cta { text-align: center; background: var(--brand); color: #fff; border-radius: 24px; padding: 76px 24px; }
        .cta p { margin: 14px auto 30px; max-width: 46ch; opacity: 0.85; }
        .cta .btn--primary { background: var(--gold); color: #21160a; }
        .cta .btn--primary:hover { background: #d5ab5f; }

        @media (max-width: 960px) { .steps { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 820px) {
          .what__grid, .estimate__grid { grid-template-columns: 1fr; }
          .trust__grid { grid-template-columns: 1fr; }
          .tm__grid { grid-template-columns: 1fr; }
          .partners__grid { grid-template-columns: repeat(2, 1fr); }
        }
      ` }} />
    </>
  );
}
