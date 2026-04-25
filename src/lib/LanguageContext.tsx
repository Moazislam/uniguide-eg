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
    "nav.home": "الرئيسية",
    "hero.badge": "قرارات جامعية مخصصة للطلاب المصريين",
    "hero.title": "اختار جامعتك",
    "hero.titleHighlight": "بعقل أهدى ووضوح أكبر",
    "hero.description": "UniGuide يجمع لك البحث، المطابقة، والمقارنة في رحلة واحدة. بدل ما تدور في عشرات المواقع، خذ نتيجة مرتبة حسب درجتك، ميزانيتك، موقعك، واهتماماتك.",
    "hero.ctaMatch": "ابدأ ملف المطابقة",
    "hero.ctaBrowse": "استعرض الجامعات",
    "pillar.clear.title": "قرار أوضح",
    "pillar.clear.text": "نعرض الخيارات الواقعية أولاً ثم نرتبها حسب ملاءمتها لك، لا حسب الشهرة فقط.",
    "pillar.budget.title": "ميزانية أذكى",
    "pillar.budget.text": "النتائج تستبعد الخيارات المبالغ فيها وتبرز البدائل التي ما زالت تناسب أهدافك.",
    "pillar.compare.title": "مقارنة أسرع",
    "pillar.compare.text": "اجمع الجامعات أثناء التصفح ثم افتح مقارنة مركزة بدل القفز بين صفحات كثيرة.",
    "preview.title": "ملف واحد، نتائج أذكى",
    "preview.fit": "نسبة التوافق",
    "preview.step1": "أنشئ ملف المطابقة مرة واحدة",
    "preview.step2": "أدخل الدرجة والتفضيلات الأساسية",
    "preview.step3": "شاهد الجامعات المناسبة وأفضل التخصصات داخل كل جامعة",
    "preview.factors": "ما الذي يغير الترتيب",
    "preview.compare": "أضف الجامعات أثناء التصفح، ثم افتح شاشة مقارنة جاهزة بدل تدوين الملاحظات يدويًا.",
    "stats.universities": "جامعات مصرية",
    "stats.compare": "جامعات في المقارنة",
    "stats.profile": "ملف شخصي واحد",
    "stats.results": "نتائج موجهة حسب الطالب",
    "features.title": "رحلة واحدة بدل مواقع كثيرة",
    "features.subtitle": "كل خطوة في المنصة مصممة لتقليل الحيرة وزيادة وضوح القرار.",
    "features.cta": "جرّب التجربة الكاملة",
    "features.browse.title": "استكشف الجامعات",
    "features.browse.desc": "فلترة واضحة وسريعة بين الحكومية والخاصة والدولية بدون تشتيت.",
    "features.match.title": "مطابقة مخصصة",
    "features.match.desc": "نتائج تبنى على درجتك وميزانيتك ومكانك واهتماماتك الفعلية.",
    "features.compare.title": "مقارنة جانبية",
    "features.compare.desc": "أضف حتى 3 جامعات وراجع الفروقات الأساسية في شاشة واحدة.",
    "features.majors.title": "التخصصات والمسارات",
    "features.majors.desc": "اعرف التخصصات المتاحة وما الذي يمكن أن تقودك إليه بعد الدراسة.",
    "cta.ready": "مستعد لقرار أفضل؟",
    "cta.title": "ابدأ بملفك الشخصي ثم دع النظام يرتّب الخيارات لك",
    "cta.desc": "ليس الهدف أن تشاهد كل جامعة، بل أن ترى أولاً الخيارات التي تملك فرصة حقيقية ومناسبة لك.",
    "cta.openCompare": "افتح المقارنة",
    "search.placeholder": "ابحث عن جامعة أو تخصص...",
    "common.more": "المزيد",
    "common.loading": "جاري التحميل...",
    "common.noResults": "لا توجد نتائج مطابقة",
    "common.universities": "جامعات",
    "common.majors": "تخصصات",
    "common.eg": "في مصر",
    "uni.title": "الجامعات المصرية",
    "uni.subtitle": "استكشف الجامعات الحكومية والخاصة والدولية",
    "uni.matchTitle": "المطابقات المخصصة",
    "uni.matchSubtitle": "توصيات مرتبة حسب مجموعك، ميزانيتك، وتفضيلاتك الشخصية",
    "uni.matchFound": "جامعة متوافقة تم ترتيبها لملفك الشخصي",
    "uni.bestMajors": "كل جامعة تتضمن أفضل التخصصات المتوافقة معك",
    "uni.found": "جامعة تم العثور عليها",
    "major.title": "التخصصات",
    "major.subtitle": "استكشف كل التخصصات المتاحة في الجامعات المصرية",
    "major.found": "تخصص متاح",
    "major.search": "ابحث عن تخصص...",
    "major.all": "الكل",
    "details.about": "عن هذه الجامعة",
    "details.description": "وصف الجامعة",
    "details.knownFor": "تشتهر بـ",
    "details.admission": "متطلبات القبول",
    "details.thanaweya": "الثانوية العامة",
    "details.ig": "متطلبات الـ IG",
    "details.american": "متطلبات الدبلومة الأمريكية",
    "details.faculties": "الكليات والمعاهد",
    "details.availableMajors": "التخصصات المتاحة",
    "details.accreditations": "الاعتمادات",
    "details.compareCta": "قارن مع جامعات أخرى",
    "details.compareDesc": "قارن الفروقات الأساسية جنباً إلى جنب",
    "details.goToCompare": "اذهب للمقارنة",
    "details.bestUnis": "أفضل الجامعات لهذا التخصص",
    "details.bestUnisDesc": "أفضل الجامعات ترتيباً لهذا التخصص",
    "details.allUnis": "جميع الجامعات المتاحة",
    "details.futureCareer": "مستقبلك المهني",
    "details.needHelp": "محتاج مساعدة؟",
    "details.helpDesc": "نقدر نساعدك تختار الجامعة الأنسب لمجموعك وميزانيتك.",
    "details.tryEngine": "جرب المحرك الذكي",
    "details.minScore": "أدنى درجة",
    "details.tuition": "المصاريف السنوية",
    "details.duration": "المدة",
    "details.years": "سنوات",
    "details.language": "اللغة",
    "details.free": "مجاني",
    "details.departments": "التخصصات والأقسام",
    "details.details": "التفاصيل",
    "footer.rights": "جميع الحقوق محفوظة © ٢٠٢٦ UniGuide",
  },
  en: {
    "nav.universities": "Universities",
    "nav.majors": "Majors",
    "nav.compare": "Compare",
    "nav.login": "Login",
    "nav.start": "Get Started",
    "nav.profile": "Profile",
    "nav.home": "Home",
    "hero.badge": "Personalized university decisions for Egyptian students",
    "hero.title": "Choose Your University",
    "hero.titleHighlight": "With a Calmer Mind and Greater Clarity",
    "hero.description": "UniGuide combines search, matching, and comparison in one journey. Instead of searching dozens of sites, get results ranked by your score, budget, location, and interests.",
    "hero.ctaMatch": "Start Matching Profile",
    "hero.ctaBrowse": "Browse Universities",
    "pillar.clear.title": "Clearer Decisions",
    "pillar.clear.text": "We show realistic options first, ranked by their suitability for you, not just by fame.",
    "pillar.budget.title": "Smarter Budgeting",
    "pillar.budget.text": "Results exclude over-budget options and highlight alternatives that still fit your goals.",
    "pillar.compare.title": "Faster Comparison",
    "pillar.compare.text": "Collect universities while browsing, then open a focused comparison instead of jumping between pages.",
    "preview.title": "One Profile, Smarter Results",
    "preview.fit": "Profile Fit",
    "preview.step1": "Create your matching profile once",
    "preview.step2": "Enter your score and basic preferences",
    "preview.step3": "See suitable universities and the best majors within each",
    "preview.factors": "What changes the ranking",
    "preview.compare": "Add universities while browsing, then open a ready-made comparison screen instead of taking notes manually.",
    "stats.universities": "Egyptian Universities",
    "stats.compare": "Compare up to 3",
    "stats.profile": "One Single Profile",
    "stats.results": "Student-Oriented Results",
    "features.title": "One Journey Instead of Many Sites",
    "features.subtitle": "Every step on the platform is designed to reduce confusion and increase decision clarity.",
    "features.cta": "Try the Full Experience",
    "features.browse.title": "Browse Universities",
    "features.browse.desc": "Clear and fast filtering between public, private, and international without distraction.",
    "features.match.title": "Personalized Matching",
    "features.match.desc": "Results built on your actual score, budget, location, and interests.",
    "features.compare.title": "Side-by-Side Compare",
    "features.compare.desc": "Add up to 3 universities and review key differences on one screen.",
    "features.majors.title": "Majors & Paths",
    "features.majors.desc": "Learn about available majors and where they can lead you after graduation.",
    "cta.ready": "Ready to decide better?",
    "cta.title": "Start with your profile and let the system rank the options for you",
    "cta.desc": "The goal isn't to see every university, but to first see the options where you have a real and suitable chance.",
    "cta.openCompare": "Open Comparison",
    "search.placeholder": "Search for university or major...",
    "common.more": "See More",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.universities": "Universities",
    "common.majors": "Majors",
    "common.eg": "in Egypt",
    "uni.title": "Egyptian Universities",
    "uni.subtitle": "Browse public, private, and international universities",
    "uni.matchTitle": "Personalized Matches",
    "uni.matchSubtitle": "Recommendations ranked by your score, budget, and personal preferences",
    "uni.matchFound": "personalized university matches ranked for your profile",
    "uni.bestMajors": "Each university includes its best matching majors for you",
    "uni.found": "universities found",
    "major.title": "Majors",
    "major.subtitle": "Explore all available university majors in Egypt",
    "major.found": "majors found",
    "major.search": "Search for a major...",
    "major.all": "All",
    "details.about": "About this University",
    "details.description": "University Description",
    "details.knownFor": "Most Known For",
    "details.admission": "Admission Requirements",
    "details.thanaweya": "Thanaweya Amma",
    "details.ig": "IG / IGCSE Requirements",
    "details.american": "American Diploma Requirements",
    "details.faculties": "Faculties & Schools",
    "details.availableMajors": "Available Majors",
    "details.accreditations": "Accreditations",
    "details.compareCta": "Compare with other universities",
    "details.compareDesc": "Compare key differences side-by-side",
    "details.goToCompare": "Go to Compare",
    "details.bestUnis": "Best Universities for this Major",
    "details.bestUnisDesc": "Top ranked universities for this major",
    "details.allUnis": "All Available Universities",
    "details.futureCareer": "Your Career Path",
    "details.needHelp": "Need Help?",
    "details.helpDesc": "We can help you choose the best university for your score and budget.",
    "details.tryEngine": "Try Smart Engine",
    "details.minScore": "Min Score",
    "details.tuition": "Annual Tuition",
    "details.duration": "Duration",
    "details.years": "years",
    "details.language": "Language",
    "details.free": "Free",
    "details.departments": "Departments & Majors",
    "details.details": "Details",
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
