import type { Metadata } from "next";
import "./globals.css";

import BottomNav from "@/components/layout/BottomNav";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://uniguide-eg.vercel.app"),
  title: {
    default: "UniGuide — منصة قرارات الجامعة في مصر",
    template: "%s | UniGuide",
  },
  description: "Egypt's University Decision Platform — ابحث وقارن واختار الجامعة والتخصص الصح",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://uniguide-eg.vercel.app",
    siteName: "UniGuide Egypt",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UniGuide Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UniGuide — منصة قرارات الجامعة في مصر",
    description: "Egypt's University Decision Platform",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream font-cairo min-h-screen pb-16 md:pb-0">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {children}
            <BottomNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
