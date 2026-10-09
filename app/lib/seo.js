// app/lib/seo.js
// One place for canonical URLs, hreflang, Open Graph and Twitter tags.
//
// The site serves one URL per page and switches language in the browser, so
// titles and descriptions carry BOTH languages: that is the only Chinese text
// Google sees, because the server-rendered body is always English.

// The live site 308-redirects the apex to www, so www IS the canonical host.
// Everything derived from SITE -- canonicals, sitemap <loc>, robots, OG urls --
// must use it: a sitemap served from www listing apex URLs is cross-host, and
// Google rejects it ("Couldn't fetch").
export const SITE = "https://www.ehomeuk.com";
export const OG_IMAGE = `${SITE}/logo.png`;
export const SITE_NAME = "EHOME Properties 易家";

export function pageMeta({ path, title, description }) {
  const url = path === "/" ? `${SITE}/` : `${SITE}${path}`;

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

// Structured data. This is the strongest signal available for "someone searches
// our Chinese name and finds us": it tells search engines, explicitly and in a
// machine-readable way, that 易家 and EHOME Properties are the same entity.
// alternateName is exactly the field built for that.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "EHOME Properties Limited",
  alternateName: [
    "EHOME",
    "EHOME Properties",
    "Ehome Properties 易家",
    "易家",
    "易家租房担保",
    "易家中国",
  ],
  legalName: "EHOME Properties Limited",
  url: SITE,
  logo: `${SITE}/logo.png`,
  image: OG_IMAGE,
  description:
    "UK rent guarantor service for international students. 为英国留学生提供租房担保服务。",
  knowsLanguage: ["en-GB", "zh-Hans"],
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "China" },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: SITE,
  name: "EHOME Properties 易家",
  alternateName: ["易家租房担保", "EHOME rent guarantor"],
  inLanguage: ["en-GB", "zh-Hans"],
  publisher: { "@id": `${SITE}/#organization` },
};
