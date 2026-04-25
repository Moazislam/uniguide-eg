"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const dictionaries: Record<Language, Record<string, string>> = {
  ar: {
    "nav.universities": "الجامعات",
    "nav.majors": "التخصصات",
    "nav.compare": "مقارنة",
    "nav.login": "دخول",
    "nav.start": "ابدأ الآن",
    "nav.profile": "ملفي",
    "hero.title": "مستقبلك يبدأ هنا",
    "hero.subtitle": "المنصة الأولى لمساعدة الطلاب في مصر على اختيار جامعتهم وتخصصهم بذكاء.",
    "search.placeholder": "ابحث عن جامعة أو تخصص...",
    "common.more": "المزيد",
    "footer.rights": "جميع الحقوق محفوظة © ٢٠٢٦ UniGuide",
  },
  en: {
    "nav.universities": "Universities",
    "nav.majors": "Majors",
    "nav.compare": "Compare",
    "nav.login": "Login",
    "nav.start": "Get Started",
    "nav.profile": "Profile",
    "hero.title": "Your Future Starts Here",
    "hero.subtitle": "The #1 platform helping Egyptian students choose their university and major wisely.",
    "search.placeholder": "Search for university or major...",
    "common.more": "See More",
    "footer.rights": "All rights reserved © 2026 UniGuide",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "ar" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const t = (key: string) => {
    return dictionaries[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isRtl: language === "ar", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
