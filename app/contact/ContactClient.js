"use client";

import { useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";
import Reveal from "../components/Reveal";

// Simple inline icons per channel.
function ChannelIcon({ type }) {
  const common = { width: 22, height: 22, stroke: "currentColor", strokeWidth: 1.7, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "email") return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
  if (type === "phone") return <svg viewBox="0 0 24 24" {...common}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>;
  if (type === "rednote") return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 9v6M8 9h2.5a1.5 1.5 0 0 1 0 3H8m4.5-3v6m3-6v6m0-3h1.5" /></svg>;
  // wechat
  return <svg viewBox="0 0 24 24" {...common}><path d="M9 4C5 4 2 6.7 2 10c0 1.8.9 3.4 2.4 4.5L4 17l2.7-1.3c.7.2 1.5.3 2.3.3" /><path d="M22 15c0-2.8-2.7-5-6-5s-6 2.2-6 5 2.7 5 6 5c.7 0 1.4-.1 2-.3L20 21l-.4-1.8A4.7 4.7 0 0 0 22 15z" /></svg>;
}

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

  const showQR = (type) => type === "wechat" || type === "rednote";

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
            <div className="channels">
              {c.channels.map((ch) => (
                <div key={ch.type} className="channel">
                  <span className="channel__icon"><ChannelIcon type={ch.type} /></span>
                  <div className="channel__meta">
                    <span className="channel__label">{ch.label}</span>
                    {ch.type === "email" ? (
                      <a href={`mailto:${ch.value}`} className="channel__value">{ch.value}</a>
                    ) : ch.type === "phone" ? (
                      <a href={`tel:${ch.value.replace(/\s/g, "")}`} className="channel__value">{ch.value}</a>
                    ) : (
                      <span className="channel__value">{ch.value}</span>
                    )}
                    <span className="channel__hint">{ch.hint}</span>
                  </div>
                  {showQR(ch.type) && (
                    <div className="channel__qr" title={c.qrCaption}>
                      <span>QR</span>
                      <em>{c.qrCaption}</em>
                    </div>
                  )}
                </div>
              ))}
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
        .contact__grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 48px; align-items: start; }
        .channels { display: flex; flex-direction: column; gap: 16px; }
        .channel {
          display: flex; align-items: center; gap: 16px;
          background: var(--surface); border: 1px solid var(--line);
          border-radius: var(--radius); padding: 18px 20px;
        }
        .channel__icon {
          flex: none; width: 44px; height: 44px; border-radius: 12px;
          display: grid; place-items: center; color: var(--brand);
          background: color-mix(in srgb, var(--gold) 16%, transparent);
        }
        .channel__meta { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .channel__label { font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
        .channel__value { font-weight: 600; color: var(--ink); }
        a.channel__value:hover { color: var(--brand); }
        .channel__hint { font-size: 0.85rem; color: var(--muted); }
        .channel__qr {
          flex: none; width: 68px; height: 68px; border: 1px dashed var(--line);
          border-radius: 10px; display: grid; place-items: center; text-align: center;
          color: var(--muted); background: var(--bg);
        }
        .channel__qr span { font-weight: 700; font-size: 0.9rem; }
        .channel__qr em { font-style: normal; font-size: 0.62rem; display: block; margin-top: 2px; }

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
