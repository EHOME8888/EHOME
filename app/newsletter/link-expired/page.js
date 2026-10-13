// app/newsletter/link-expired/page.js
import { pageMeta } from "../../lib/seo";
import NewsletterResult from "../../components/NewsletterResult";

export const metadata = { ...pageMeta({ path: "/newsletter/link-expired", title: "Link expired | EHOME Properties 易家", description: "That newsletter link is no longer valid." }), robots: { index: false, follow: false } };

export default function Page() {
  return <NewsletterResult kind="expired" />;
}
