// app/newsletter/confirmed/page.js
import { pageMeta } from "../../lib/seo";
import NewsletterResult from "../../components/NewsletterResult";

export const metadata = { ...pageMeta({ path: "/newsletter/confirmed", title: "Subscription confirmed | EHOME Properties 易家", description: "Your EHOME newsletter subscription is confirmed." }), robots: { index: false, follow: false } };

export default function Page() {
  return <NewsletterResult kind="confirmed" />;
}
