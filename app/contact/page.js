// app/contact/page.js
// Server component: carries this page's metadata. The page body is a client
// component because of the language toggle, and client components cannot
// export metadata.
import { pageMeta } from "../lib/seo";
import ContactClient from "./ContactClient";

export const metadata = pageMeta({
  path: "/contact",
  title: "Contact Us 联系我们 | EHOME Properties 易家",
  description: "Talk to the EHOME 易家 team in English or Chinese about UK rent guarantor services. 联系易家中国团队，中英文咨询英国租房担保。",
});

export default function Page() {
  return <ContactClient />;
}
