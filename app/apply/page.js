// app/apply/page.js
import { pageMeta } from "../lib/seo";
import ApplyClient from "./ApplyClient";

export const metadata = pageMeta({
  path: "/apply",
  title: "Apply Now 立即申请 | EHOME Properties 易家 Rent Guarantor",
  description:
    "Start your EHOME 易家 rent guarantor application in the client portal. 立即申请易家租房担保，在客户门户上传材料并查看进度。",
});

export default function Page() {
  return <ApplyClient />;
}
