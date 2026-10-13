// app/newsletter/unsubscribed/page.js
import { pageMeta } from "../../lib/seo";
import NewsletterResult from "../../components/NewsletterResult";

export const metadata = { ...pageMeta({ path: "/newsletter/unsubscribed", title: "Unsubscribed | EHOME Properties 易家", description: "You have been unsubscribed from the EHOME newsletter." }), robots: { index: false, follow: false } };

export default function Page() {
  return <NewsletterResult kind="unsub" />;
}
