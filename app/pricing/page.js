// app/pricing/page.js
// Server component: carries this page's metadata. The page body is a client
// component because of the language toggle, and client components cannot
// export metadata.
import { pageMeta } from "../lib/seo";
import PricingClient from "./PricingClient";

export const metadata = pageMeta({
  path: "/pricing",
  title: "Pricing 收费标准 | EHOME Properties 易家 Rent Guarantor",
  description: "What an EHOME 易家 rent guarantee costs, with an instant fee estimate. 易家租房担保收费标准与费用估算，中英文说明。",
});

export default function Page() {
  return <PricingClient />;
}
