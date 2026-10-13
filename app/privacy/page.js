// app/privacy/page.js
import { pageMeta } from "../lib/seo";
import LegalDoc from "../components/LegalDoc";

export const metadata = pageMeta({
  path: "/privacy",
  title: "Privacy Notice 隐私声明 | EHOME Properties 易家",
  description: "How EHOME 易家 collects and uses your personal data, your rights under UK data protection law, and our UK-China transfer safeguards. 易家隐私声明：个人数据的收集与使用、你的权利及跨境传输保障。",
});

export default function Page() {
  return <LegalDoc doc="privacy" />;
}
