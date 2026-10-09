// app/lib/seo.js
// One place for canonical URLs, hreflang, Open Graph and Twitter tags.
//
// The site serves one URL per page and switches language in the browser, so
// titles and descriptions carry BOTH languages: that is the only Chinese text
// Google sees, because the server-rendered body is always English.

export const SITE = "https://ehomeuk.com";
export const OG_IMAGE = `${SITE}/logo.png`;
export const SITE_NAME = "EHOME Properties 易家";

export function pageMeta({ path, title, description }) {
  const url = path === "/" ? SITE : `${SITE}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: url, "zh-CN": url, "x-default": url },
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_GB",
      alternateLocale: ["zh_CN"],
      images: [{ url: OG_IMAGE, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
