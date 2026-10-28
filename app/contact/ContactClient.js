"use client";

import { useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";
import ContactChannels from "../components/ContactChannels";
import SocialIcons from "../components/SocialIcons";

export default function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    // No backend yet — wire to Netlify/Vercel form handling when we deploy.
    console.log("Contact form:", form);
    setSent(true);
  };

  return (
    <>
      <section className="section">
        <div className="container contact">
          <Reveal className="sec-head">
            <p className="eyebrow">{c.eyebrow}</p>
            <h1>{c.title}</h1>
            <p className="lead">{c.lead}</p>
          </Reveal>

          <div className="contact__grid">
            {/* Channels */}
            <div className="contact__left">
            <Reveal className="contact__social">
              <span className="contact__head">{c.reach.head}</span>
              <ContactChannels variant="buttons" />
            </Reveal>

            <Reveal className="contact__social">
              <SocialIcons />
            </Reveal>

            </div>

            {/* Form */}

            <div className="form-wrap">
              {sent ? (
                <div className="thanks" role="status">
                  <h3>{c.form.thanksTitle}</h3>
                  <p>{c.form.thanksBody}</p>
                </div>
              ) : (
                <form onSubmit={submit} className="form">
                  <label>
                    {c.form.name}
                    <input name="name" value={form.name} onChange={update} required autoComplete="name" />
                  </label>
                  <label>
                    {c.form.email}
                    <input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" />
                  </label>
                  <label>
                    {c.form.message}
                    <textarea name="message" rows={5} value={form.message} onChange={update} required />
                  </label>
                  <button type="submit" className="btn btn--primary">{c.form.send}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .sec-head h1 { margin-top: 12px; }
        .contact__head {
          display: block; margin-bottom: 12px;
          font-size: 0.72rem; letter-spacing: 0.13em; text-transform: uppercase;
          color: var(--muted); font-weight: 600;
        }
        .contact__grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 48px; align-items: start; }
        .contact__left { display: flex; flex-direction: column; gap: var(--sp-6); min-width: 0; }
        .contact__social { min-width: 0; }

        .form { display: flex; flex-direction: column; gap: 18px; }
        .form label { display: flex; flex-direction: column; gap: 8px; font-weight: 600; font-size: 0.95rem; }
        .form input, .form textarea {
          font: inherit; font-weight: 400; padding: 12px 14px;
          border: 1px solid var(--line); border-radius: 10px;
          background: var(--surface); color: var(--ink); resize: vertical;
        }
        .form input:focus, .form textarea:focus {
          outline: none; border-color: var(--brand);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 30%, transparent);
        }
        .form .btn { align-self: flex-start; margin-top: 4px; }
        .thanks { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 40px; }
        .thanks h3 { color: var(--brand); margin-bottom: 8px; }
        .thanks p { color: var(--muted); }
        @media (max-width: 860px) { .contact__grid { grid-template-columns: 1fr; gap: 32px; } }
      ` }} />
    </>
  );
}
