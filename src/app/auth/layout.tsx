import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول / إنشاء حساب",
  description: "انضم إلى UniGuide وابدأ في التخطيط لمستقبلك الأكاديمي في مصر.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
