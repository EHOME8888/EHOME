// app/cookies/page.js
import { pageMeta } from "../lib/seo";
import LegalDoc from "../components/LegalDoc";

export const metadata = pageMeta({
  path: "/cookies",
  title: "Cookies Policy Cookie 政策 | EHOME Properties 易家",
  description: "EHOME 易家 uses strictly necessary storage only — no analytics, advertising or third-party tracking. 易家 Cookie 政策：仅使用严格必要的存储，无分析或广告追踪。",
});

export default function Page() {
  return <LegalDoc doc="cookies" />;
}
