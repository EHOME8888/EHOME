# Ehome Properties — bilingual marketing site

Rent guarantor service for Chinese international students. Built with Next.js 14
(App Router), plain JavaScript, and plain CSS. Fully bilingual (English / 简体中文)
with an instant language toggle.

## Run it locally

Requires Node.js 18.17+ (check with `node -v`).

```bash
npm install     # first time only
npm run dev      # start dev server → http://localhost:3000
```

## Where everything lives

```
app/
  layout.js                 → shared shell (fonts, nav, footer, language provider)
  page.js                   → homepage (hero, what we do, how it works, trust, partners, pricing preview)
  pricing/page.js           → /pricing
  contact/page.js           → /contact (WeChat, RedNote, email, phone + form)
  globals.css               → colours & fonts (edit the :root block to rebrand)
  i18n/
    dictionary.js           → ALL copy, English + Chinese, in one file
    LanguageProvider.js     → the language toggle logic
  components/
    Nav.js  Footer.js
```

## Editing content

Almost all text lives in `app/i18n/dictionary.js` — English under `en`,
Chinese under `zh`. Change it there and both the site and the toggle update.

## Placeholders to replace (search for these)

- **Chinese company name:** `易家 Ehome` — a suggestion; change in `dictionary.js`.
- **Pricing:** the `tiers` in `dictionary.js` use example % figures. Assumed
  UK / annual-rent %. Replace with your real fees / currency.
- **WeChat & RedNote IDs:** in `dictionary.js` under `contact.channels`.
- **Phone & email:** same place.
- **QR codes:** the contact page shows placeholder "QR" boxes. Drop real images
  into `public/` (e.g. `public/wechat-qr.png`) and swap the placeholder for an
  `<img>` — happy to wire this up.
- **Partner logos:** the homepage Partners section has 6 dashed slots. Replace
  with real logos when you have them.

## Rebranding colours

Edit the `:root` variables at the top of `app/globals.css`:
`--brand` (navy), `--gold` (accent), `--bg`, `--ink`.

## The contact form

Currently shows a confirmation but doesn't send anywhere. When we deploy to
Vercel or Netlify, we'll connect it so submissions reach your inbox.

## Deploy

1. Push this folder to a new GitHub repo.
2. At https://vercel.com → Add New Project → import the repo → Deploy.
3. Every `git push` after that redeploys automatically.

## Note on bilingual + SEO

The language toggle is client-side (simple to run and edit). If Chinese search
visibility (Baidu, etc.) becomes important, the upgrade path is separate
`/en` and `/zh` routes — a straightforward change when you're ready.
