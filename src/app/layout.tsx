import type { Metadata } from "next";
import "./globals.css";

import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "UniGuide — منصة قرارات الجامعة في مصر",
  description: "Egypt's University Decision Platform — ابحث وقارن واختار الجامعة والتخصص الصح",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream font-cairo min-h-screen pb-16 md:pb-0">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
