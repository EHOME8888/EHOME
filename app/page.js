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
        .hero { position: relative; min-height: 86vh; display: flex; align-items: center; overflow: hidden; background: #12233f; }
        .hero__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .hero__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
        .hero__overlay { position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(90deg, rgba(9,18,33,0.88) 0%, rgba(9,18,33,0.74) 42%, rgba(9,18,33,0.42) 100%); }
        .hero__inner { position: relative; z-index: 3; padding: 96px 24px; }
        .hero__text { max-width: 660px; }
        .hero .eyebrow { color: var(--gold); }
        .hero h1 { color: #fff; margin: 16px 0 20px; }
        .hero__lead { color: rgba(255,255,255,0.86); font-size: 1.2rem; max-width: 52ch; }
        .hero__bullets { list-style: none; padding: 0; margin: 24px 0 32px; display: grid; gap: 10px; }
        .hero__bullets li { position: relative; padding-left: 28px; color: #fff; }
        .hero__bullets li::before { content: "✓"; position: absolute; left: 0; color: var(--gold); font-weight: 700; }
        .hero__actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn--hero-ghost { border-color: rgba(255,255,255,0.55); color: #fff; background: transparent; }
        .btn--hero-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.10); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .hero__text > * { animation: fadeUp 0.6s ease both; }
        .hero__text > *:nth-child(1) { animation-delay: 0.05s; }
        .hero__text > *:nth-child(2) { animation-delay: 0.13s; }
        .hero__text > *:nth-child(3) { animation-delay: 0.21s; }
        .hero__text > *:nth-child(4) { animation-delay: 0.29s; }
        .hero__text > *:nth-child(5) { animation-delay: 0.37s; }
        @media (prefers-reduced-motion: reduce) { .hero__text > * { animation: none; } }

        /* ---- What ---- */
        .what__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .what__grid h2 { margin-top: 14px; }
        .what__body { color: var(--muted); font-size: 1.12rem; }

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
