import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تخصيص تجربتك",
  description: "أجب على بضع أسئلة لنقترح عليك أفضل الجامعات والتخصصات المناسبة لك.",
  robots: { index: false },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
