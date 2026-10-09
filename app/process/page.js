// app/process/page.js
// Server component: carries this page's metadata. The page body is a client
// component because of the language toggle, and client components cannot
// export metadata.
import { pageMeta } from "../lib/seo";
import ProcessClient from "./ProcessClient";

export const metadata = pageMeta({
  path: "/process",
  title: "How It Works 办理流程 | EHOME Properties 易家 Rent Guarantor",
  description: "The EHOME 易家 guarantor process step by step: apply, upload documents, get a decision, sign, move in. 易家租房担保办理流程：申请、提交材料、审核、签署、入住。",
});

export default function Page() {
  return <ProcessClient />;
}
