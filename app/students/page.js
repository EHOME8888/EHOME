// app/students/page.js
import { pageMeta } from "../lib/seo";
import StudentsClient from "./StudentsClient";

export const metadata = pageMeta({
  path: "/students",
  title: "Rent Guarantor for Chinese International Students 中国留学生租房担保 | EHOME 易家",
  description:
    "No UK guarantor? EHOME 易家 stands in as your rent guarantor so UK landlords say yes. 没有英国担保人？易家租房担保帮助中国留学生顺利签约租房。",
});

export default function Page() {
  return <StudentsClient />;
}
