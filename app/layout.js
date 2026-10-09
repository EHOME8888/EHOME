import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageProvider";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { SITE, SITE_NAME, OG_IMAGE } from "./lib/seo";

// Per-page title, description, canonical and hreflang live in each page.js via
// pageMeta(). These are the site-wide defaults and fallbacks.
export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default:
      "EHOME Properties 易家 — Rent Guarantor for International Students / 留学生租房担保",
    template: "%s",
  },
  description:
    "EHOME 易家 acts as your UK rent guarantor so international students can rent without a UK-based guarantor. 易家租房担保为中国留学生提供英国租房担保服务。",
  applicationName: SITE_NAME,
  keywords: [
    "EHOME", "EHOME Properties", "易家", "易家租房担保", "易家中国",
    "rent guarantor", "UK rent guarantor", "international student guarantor",
    "留学生租房担保", "英国租房担保", "担保人",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: SITE_NAME,
    locale: "en_GB",
    alternateLocale: ["zh_CN"],
    images: [{ url: OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
