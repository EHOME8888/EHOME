"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

export default function Nav() {
  const { t, toggle } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#what", label: t.nav.what },
    { href: "/process", label: t.nav.how },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/#partners", label: t.nav.partners },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link href="/" className="nav__logo" onClick={() => setOpen(false)}>
          <img src="/logo-mark.png" alt="" className="nav__mark" />
          <span>Ehome Properties</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        <div className="nav__right">
          <button className="nav__lang" onClick={toggle} aria-label="Switch language">
            {t.langLabel}
          </button>
          <Link href="/contact" className="btn btn--primary nav__cta">
            {t.nav.cta}
          </Link>
          <button
            className="nav__toggle"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <div className="nav__mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/contact" className="btn btn--primary" onClick={() => setOpen(false)}>
            {t.nav.cta}
          </Link>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: color-mix(in srgb, var(--bg) 85%, transparent);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .nav__inner { display: flex; align-items: center; justify-content: space-between; height: 72px; gap: 24px; }
        .nav__logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-weight: 500;
          font-size: 1.3rem; color: var(--brand); white-space: nowrap;
        }
        .nav__mark { height: 36px; width: auto; }
        .nav__links { display: flex; align-items: center; gap: 30px; font-weight: 500; font-size: 0.98rem; }
        .nav__links a:hover { color: var(--brand); }
        .nav__right { display: flex; align-items: center; gap: 14px; }
        .nav__lang {
          border: 1px solid var(--line); background: transparent;
          border-radius: 999px; padding: 7px 14px; font-weight: 600;
          font-size: 0.9rem; cursor: pointer; color: var(--ink); min-width: 56px;
        }
        .nav__lang:hover { border-color: var(--gold); color: var(--brand); }
        .nav__toggle {
          display: none; flex-direction: column; gap: 4px;
          background: transparent; border: none; cursor: pointer; padding: 6px;
        }
        .nav__toggle span { width: 22px; height: 2px; background: var(--ink); border-radius: 2px; }
        .nav__mobile {
          display: flex; flex-direction: column; gap: 18px;
          padding: 20px 24px 28px; border-bottom: 1px solid var(--line);
          font-weight: 500;
        }
        @media (max-width: 820px) {
          .nav__links, .nav__cta { display: none; }
          .nav__toggle { display: flex; }
        }
      ` }} />
    </header>
  );
}
