"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-border bg-card-bg hover:border-amber transition-all text-xs font-bold font-cairo text-blue dark:text-text-primary shadow-sm active:scale-95"
      aria-label="Toggle Language"
    >
      <Languages size={14} className="text-amber" />
      <span className="hidden xs:inline">{language === "ar" ? "English" : "عربي"}</span>
      <span className="xs:hidden uppercase">{language === "ar" ? "en" : "ar"}</span>
    </button>
  );
}
