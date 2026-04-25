"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#d4a843] transition-colors text-xs font-bold font-cairo text-[#1a3a5c]"
      aria-label="Toggle Language"
    >
      <Languages size={14} className="text-[#d4a843]" />
      <span>{language === "ar" ? "English" : "عربي"}</span>
    </button>
  );
}
