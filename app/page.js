// app/page.js
// Server component: carries this page's metadata. The page body is a client
// component because of the language toggle, and client components cannot
// export metadata.
import { pageMeta } from "./lib/seo";
import HomeClient from "./HomeClient";

export const metadata = pageMeta({
  path: "/",
  title: "EHOME Properties 易家 — Rent Guarantor for International Students / 留学生租房担保",
  description: "EHOME 易家 acts as your UK rent guarantor so international students can rent without a UK-based guarantor. 易家租房担保为中国留学生提供英国租房担保服务，易家中国团队中英文全程支持。",
});

export default function Page() {
  return <HomeClient />;
}
