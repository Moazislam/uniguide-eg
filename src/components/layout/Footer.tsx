"use client";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <footer className="bg-blue dark:bg-blue-dark text-white py-12 mt-auto border-t border-amber/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
                <span className="text-blue font-bold text-sm font-cairo">U</span>
              </div>
              <span className="font-bold text-white text-lg font-cairo">UniGuide</span>
            </div>
            <p className="text-sm text-blue-100/70 font-cairo leading-relaxed">
              {isAr ? "منصة اتخاذ قرارات الجامعة في مصر" : "Egypt's University Decision Platform"}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com/uni.guidee" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber/20 transition-colors">
                <Instagram size={14} />
              </a>
              <a href="https://www.facebook.com/people/UniGuide/61588502135207/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber/20 transition-colors">
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-amber text-sm mb-3 font-cairo">
              {isAr ? "المنصة" : "Platform"}
            </h4>
            <ul className="space-y-2 text-sm text-blue-100/70 font-cairo">
              <li><Link href="/universities" className="hover:text-white transition-colors">{t("nav.universities")}</Link></li>
              <li><Link href="/majors" className="hover:text-white transition-colors">{t("nav.majors")}</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">{t("nav.compare")}</Link></li>
              <li><Link href="/onboarding" className="hover:text-white transition-colors">{t("nav.start")}</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-amber text-sm mb-3 font-cairo">
              {isAr ? "معلومات" : "Info"}
            </h4>
            <ul className="space-y-2 text-sm text-blue-100/70 font-cairo">
              <li><Link href="/profile" className="hover:text-white transition-colors">{t("nav.profile")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-blue-100/50 font-cairo">
          © 2026 UniGuide · {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"}
        </div>
      </div>
    </footer>
  );
}
