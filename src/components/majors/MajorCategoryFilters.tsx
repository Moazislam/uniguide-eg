"use client";

import { useLanguage } from "@/lib/LanguageContext";

const categoryLabels: Record<string, { ar: string; en: string; emoji: string }> = {
  medicine:        { ar: "طب",               en: "Medicine",         emoji: "🏥" },
  engineering:     { ar: "هندسة",            en: "Engineering",      emoji: "⚙️" },
  business:        { ar: "تجارة وإدارة",    en: "Business",         emoji: "💼" },
  computer_science:{ ar: "علوم حاسب",       en: "Computer Science", emoji: "💻" },
  arts:            { ar: "آداب وفنون",       en: "Arts",             emoji: "🎨" },
  science:         { ar: "علوم",             en: "Science",          emoji: "🔬" },
  law:             { ar: "حقوق",             en: "Law",              emoji: "⚖️" },
  pharmacy:        { ar: "صيدلة",            en: "Pharmacy",         emoji: "💊" },
  dentistry:       { ar: "طب أسنان",         en: "Dentistry",        emoji: "🦷" },
  architecture:    { ar: "عمارة",            en: "Architecture",     emoji: "🏛️" },
  media:           { ar: "إعلام",            en: "Media",            emoji: "📡" },
  education:       { ar: "تربية",            en: "Education",        emoji: "📚" },
  other:           { ar: "أخرى",             en: "Other",            emoji: "🎓" },
};

export default function MajorCategoryFilters({ activeCategory }: { activeCategory?: string }) {
  const { t, isRtl } = useLanguage();

  return (
    <div className={`flex flex-wrap gap-2 mb-6 ${isRtl ? 'flex-row' : 'flex-row'}`}>
      <a
        href="/majors"
        className={`text-xs font-semibold px-3 py-1.5 rounded-full font-cairo transition-colors ${
          !activeCategory ? "bg-[#1a3a5c] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#d4a843]"
        }`}
      >
        {t("major.all")}
      </a>
      {Object.entries(categoryLabels).map(([key, val]) => (
        <a
          key={key}
          href={`/majors?category=${key}`}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full font-cairo transition-colors ${
            activeCategory === key
              ? "bg-[#1a3a5c] text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-[#d4a843]"
          }`}
        >
          {val.emoji} {isRtl ? val.ar : val.en}
        </a>
      ))}
    </div>
  );
}
