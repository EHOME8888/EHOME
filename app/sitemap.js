// app/sitemap.js — served at /sitemap.xml
import { SITE } from "./lib/seo";

const ROUTES = ["", "/students", "/process", "/pricing", "/apply", "/contact",
                "/privacy", "/cookies", "/terms"];

export default function sitemap() {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: r === "" ? `${SITE}/` : `${SITE}${r}`,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority:
      r === ""
        ? 1
        : r === "/apply" || r === "/students"
          ? 0.9
          : ["/privacy", "/cookies", "/terms"].includes(r)
            ? 0.3
            : 0.8,
  }));
}
