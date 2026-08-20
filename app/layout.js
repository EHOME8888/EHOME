import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageProvider";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata = {
  title: "Ehome Properties — Rent guarantor for Chinese students | 易家租房担保",
  description:
    "Ehome acts as your rent guarantor so international students can rent abroad with confidence. 为海外中国留学生提供租房担保服务。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
