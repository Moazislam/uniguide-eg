import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مقارنة الجامعات",
  description: "قارن بين الجامعات المصرية في مكان واحد من حيث المصروفات والترتيب والتخصصات.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
