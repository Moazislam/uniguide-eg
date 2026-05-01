import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الملف الشخصي",
  description: "إدارة تفضيلاتك الأكاديمية وقائمة الجامعات المفضلة لديك.",
  robots: { index: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
