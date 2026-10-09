// app/robots.js — served at /robots.txt
import { SITE } from "./lib/seo";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
