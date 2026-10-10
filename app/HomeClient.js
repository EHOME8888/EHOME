"use client";

import Link from "next/link";
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
        <img src="/hero-skyline.svg" alt="" className="hero__bg" aria-hidden="true" />
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-skyline.svg"
        >
          <source src="/videos/london.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="hero__rule" aria-hidden="true" />
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1><MultiLine text={t.hero.title} /></h1>
            <p className="hero__lead">{t.hero.lead}</p>
            <ul className="hero__bullets">
              {t.hero.bullets.map((b) => (<li key={b}>{b}</li>))}
            </ul>
            <div className="hero__actions">
              <Link href="/contact" className="btn btn--gold">{t.hero.ctaPrimary}</Link>
              <Link href="/pricing" className="btn btn--hero-ghost">{t.hero.ctaGhost}</Link>
            </div>
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
                <span className="trust__dot" aria-hidden="true" />
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
            <Link href="/contact" className="btn btn--primary">{t.hero.ctaPrimary}</Link>
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
        .hero__bg, .hero__video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
        }
        .hero__bg { z-index: 0; }
        .hero__video { z-index: 1; opacity: 0.5; }
        .hero__overlay {
          position: absolute; inset: 0; z-index: 2;
          background:
            repeating-linear-gradient(
              104deg,
              rgba(255,255,255,0.035) 0px,
              rgba(255,255,255,0.035) 1px,
              transparent 1px,
              transparent 7px
            ),
            linear-gradient(94deg,
              rgba(20,31,66,0.97) 0%,
              rgba(20,31,66,0.90) 46%,
              rgba(20,31,66,0.58) 100%);
        }
        .hero__inner { position: relative; z-index: 3; padding: var(--sp-10) var(--sp-5); }
        .hero__text { max-width: 44ch; }

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
          position: relative; padding-left: var(--sp-6);
          color: rgba(255,255,255,0.92); font-size: 0.96rem;
        }
        /* a struck rule rather than a tick: quieter, and it echoes the
           hairline texture behind it */
        .hero__bullets li::before {
          content: ""; position: absolute; left: 0; top: 0.72em;
          width: 14px; height: 1px; background: var(--gold);
        }
        .hero__actions { display: flex; gap: var(--sp-3); flex-wrap: wrap; }
        .btn--hero-ghost { border-color: rgba(255,255,255,0.4); color: #fff; background: transparent; }
        .btn--hero-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.08); }

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
        .what__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .what__grid h2 { margin-top: 14px; }
        .what__body { color: var(--muted); font-size: 1.12rem; }
        .guarantee-note { margin-top: 18px; font-size: 0.86rem; color: var(--muted);
          border-left: 2px solid var(--gold-soft); padding-left: 12px; }

        /* ---- Estimator section ---- */
        .estimate-sec { background: var(--surface); border-block: 1px solid var(--line); }
        .estimate__grid { display: grid; grid-template-columns: 1fr 0.92fr; gap: 48px; align-items: center; }
        .estimate__intro h2 { margin-top: 12px; }
        .estimate__intro .lead { margin-top: 14px; color: var(--muted); font-size: 1.1rem; max-width: 46ch; }

        /* ---- How ---- */
        .how { background: var(--surface); border-block: 1px solid var(--line); }
        .steps { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
        .step__n { display: inline-grid; place-items: center; width: 46px; height: 46px;
          border: 1px solid var(--gold-soft); border-radius: 999px;
          font-family: var(--font-display); color: var(--gold); font-size: 1.05rem; margin-bottom: 16px; }
        .step h3 { margin-bottom: 8px; }
        .step p { color: var(--muted); }

        /* ---- Trust ---- */
        .trust__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px 48px; }
        .trust__item { padding-left: 22px; position: relative; }
        .trust__dot { position: absolute; left: 0; top: 9px; width: 9px; height: 9px; background: var(--gold); border-radius: 999px; }
        .trust__item h3 { margin-bottom: 6px; }
        .trust__item p { color: var(--muted); }

        /* ---- Testimonials ---- */
        .testimonials { background: var(--surface); border-block: 1px solid var(--line); }
        .tm__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
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
