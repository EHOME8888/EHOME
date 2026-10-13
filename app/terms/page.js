// app/terms/page.js
import { pageMeta } from "../lib/seo";
import LegalDoc from "../components/LegalDoc";

export const metadata = pageMeta({
  path: "/terms",
  title: "Website Terms of Use 网站使用条款 | EHOME Properties 易家",
  description: "The terms governing use of ehomeuk.com. EHOME 易家 acts as a guarantor. 易家网站使用条款。",
});

export default function Page() {
  return <LegalDoc doc="terms" />;
}
