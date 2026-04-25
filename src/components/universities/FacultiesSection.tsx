"use client";

import { useState } from "react";
import type { Faculty, FacultyCategory, UniversityMajor } from "@/types";
import { Clock, DollarSign, Globe2, BookOpen, BadgeCheck, GraduationCap, Info } from "lucide-react";
import Modal from "@/components/layout/Modal";
import { useLanguage } from "@/lib/LanguageContext";

const categoryMeta: Record<FacultyCategory, { ar: string; en: string; emoji: string; color: string }> = {
  medicine:       { ar: "طب",            en: "Medicine",         emoji: "🏥", color: "bg-red-50 text-red-700 border-red-100" },
  pharmacy:       { ar: "صيدلة",         en: "Pharmacy",         emoji: "💊", color: "bg-amber-50 text-amber-700 border-amber-100" },
  dentistry:      { ar: "أسنان",         en: "Dentistry",        emoji: "🦷", color: "bg-sky-50 text-sky-700 border-sky-100" },
  engineering:    { ar: "هندسة",         en: "Engineering",      emoji: "⚙️", color: "bg-blue-50 text-blue-700 border-blue-100" },
  computer_science:{ ar: "حاسبات",       en: "Computer Science", emoji: "💻", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  business:       { ar: "تجارة وإدارة", en: "Business",         emoji: "💼", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  law:            { ar: "حقوق",          en: "Law",              emoji: "⚖️", color: "bg-purple-50 text-purple-700 border-purple-100" },
  arts:           { ar: "آداب",          en: "Arts",             emoji: "🎨", color: "bg-pink-50 text-pink-700 border-pink-100" },
  science:        { ar: "علوم",          en: "Science",          emoji: "🔬", color: "bg-teal-50 text-teal-700 border-teal-100" },
  architecture:   { ar: "عمارة وفنون",  en: "Architecture",     emoji: "🏛️", color: "bg-orange-50 text-orange-700 border-orange-100" },
  media:          { ar: "إعلام",         en: "Media",            emoji: "📡", color: "bg-rose-50 text-rose-700 border-rose-100" },
  education:      { ar: "تربية",         en: "Education",        emoji: "📚", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  agriculture:    { ar: "زراعة",         en: "Agriculture",      emoji: "🌾", color: "bg-lime-50 text-lime-700 border-lime-100" },
  tourism:        { ar: "سياحة",         en: "Tourism",          emoji: "✈️", color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  other:          { ar: "أخرى",          en: "Other",            emoji: "🎓", color: "bg-gray-50 text-gray-600 border-gray-100" },
};

const langLabel: Record<string, { ar: string; en: string }> = {
  arabic:   { ar: "عربي", en: "Arabic" },
  english:  { ar: "إنجليزي", en: "English" },
  bilingual:{ ar: "ثنائي", en: "Bilingual" },
};

interface Props {
  faculties: Faculty[];
  universityMajors?: UniversityMajor[];
  universityLanguage?: string;
}

export default function FacultiesSection({ faculties, universityMajors = [] }: Props) {
  const { t, language, isRtl } = useLanguage();
  const isAr = language === "ar";
  const categories = Array.from(new Set(faculties.map((f) => f.category)));
  const [active, setActive] = useState<FacultyCategory | "all">("all");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const visible = active === "all" ? faculties : faculties.filter((f) => f.category === active);

  if (faculties.length === 0) return null;

  // Filter majors for the selected faculty's category
  const facultyMajors = selectedFaculty 
    ? universityMajors.filter(um => um.major?.category === selectedFaculty.category)
    : [];

  const minScore = facultyMajors.length > 0 
    ? Math.min(...facultyMajors.map(um => um.min_score ?? 100).filter(s => s > 0))
    : null;

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b border-gray-100 flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        <BookOpen size={20} className="text-[#d4a843] flex-shrink-0" />
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h2 className="font-bold text-[#1a3a5c] font-cairo text-base">
            {t("details.faculties")} ({faculties.length})
          </h2>
          <p className="text-xs text-gray-400 font-cairo">Faculties & Schools</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className={`flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-gray-50 bg-[#faf7f2] ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        <button
          onClick={() => setActive("all")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold font-cairo transition-all border ${
            active === "all"
              ? "bg-[#1a3a5c] text-white border-[#1a3a5c]"
              : "bg-white text-gray-500 border-gray-200 hover:border-[#d4a843]/40 hover:text-[#1a3a5c]"
          }`}
        >
          {t("major.all")} ({faculties.length})
        </button>
        {categories.map((cat) => {
          const meta = categoryMeta[cat] ?? categoryMeta.other;
          const count = faculties.filter((f) => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-cairo transition-all border ${
                active === cat
                  ? "bg-[#1a3a5c] text-white border-[#1a3a5c]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#d4a843]/40 hover:text-[#1a3a5c]"
              }`}
            >
              <span>{meta.emoji}</span>
              <span>{isAr ? meta.ar : meta.en}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-cairo ${
                active === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Faculty cards grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map((faculty) => {
          const meta = categoryMeta[faculty.category] ?? categoryMeta.other;
          return (
            <button
              key={faculty.id}
              onClick={() => setSelectedFaculty(faculty)}
              className={`group rounded-xl border border-gray-100 bg-[#faf7f2] hover:border-[#d4a843]/30 hover:shadow-md hover:bg-white transition-all p-4 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-[#d4a843]/20 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {/* Card top */}
              <div className={`flex items-start gap-3 w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center text-base ${meta.color}`}>
                  {meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a3a5c] font-cairo text-sm leading-tight line-clamp-2">
                    {isAr ? faculty.name_ar : faculty.name_en}
                  </p>
                  <p className="text-[11px] text-gray-400 font-cairo mt-0.5 line-clamp-1">
                    {isAr ? faculty.name_en : faculty.name_ar}
                  </p>
                </div>
              </div>

              {/* Description */}
              {faculty.description_ar && (
                <p className="text-xs text-gray-500 font-cairo leading-relaxed line-clamp-2">
                  {isAr ? faculty.description_ar : faculty.name_en}
                </p>
              )}

              {/* Meta row */}
              <div className={`flex items-center gap-3 flex-wrap mt-auto pt-2 border-t border-gray-100 w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                {faculty.duration_years != null && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-cairo">
                    <Clock size={11} className="text-[#d4a843]" />
                    {faculty.duration_years} {t("details.years")}
                  </span>
                )}
                <span className={`flex items-center gap-1 text-[11px] text-[#d4a843] font-bold font-cairo ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
                  <Info size={11} /> {t("details.details")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedFaculty} 
        onClose={() => setSelectedFaculty(null)}
        title={selectedFaculty ? (isAr ? selectedFaculty.name_ar : selectedFaculty.name_en) : ""}
      >
        {selectedFaculty && (
          <div className={`space-y-6 font-cairo ${isRtl ? 'text-right' : 'text-left'}`}>
            {/* Faculty Info */}
            <div className={`flex items-start gap-4 p-4 bg-[#faf7f2] rounded-2xl border border-[#d4a843]/10 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${categoryMeta[selectedFaculty.category]?.color}`}>
                {categoryMeta[selectedFaculty.category]?.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#1a3a5c] mb-1">{isAr ? selectedFaculty.name_en : selectedFaculty.name_ar}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isAr ? (selectedFaculty.description_ar || "لا يوجد وصف متاح حالياً.") : (selectedFaculty.name_en || "No description available.")}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-gray-100 rounded-xl text-center">
                <Clock size={16} className="text-[#d4a843] mx-auto mb-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t("details.duration")}</p>
                <p className="font-bold text-[#1a3a5c]">{selectedFaculty.duration_years} {t("details.years")}</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-xl text-center">
                <Globe2 size={16} className="text-[#d4a843] mx-auto mb-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t("details.language")}</p>
                <p className="font-bold text-[#1a3a5c]">
                  {isAr ? langLabel[selectedFaculty.language ?? "arabic"].ar : langLabel[selectedFaculty.language ?? "arabic"].en}
                </p>
              </div>
              {minScore && (
                <div className="p-3 bg-[#fff9ee] border border-[#d4a843]/20 rounded-xl text-center">
                  <BadgeCheck size={16} className="text-[#d4a843] mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t("details.minScore")}</p>
                  <p className="font-bold text-[#b8922a]">{minScore}%</p>
                </div>
              )}
            </div>

            {/* Departments / Majors */}
            <div>
              <div className={`flex items-center gap-2 mb-4 text-[#1a3a5c] ${isRtl ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                <GraduationCap size={20} className="text-[#d4a843]" />
                <h4 className="font-bold">{t("details.departments")}</h4>
              </div>
              
              {facultyMajors.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {facultyMajors.map((um) => (
                    <div key={um.id} className={`p-4 rounded-xl border border-gray-100 bg-white hover:border-[#d4a843]/40 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className={`flex justify-between items-start mb-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div>
                          <p className="font-bold text-[#1a3a5c] text-sm">{isAr ? um.major?.name_ar : um.major?.name_en}</p>
                          <p className="text-xs text-gray-400">{isAr ? um.major?.name_en : um.major?.name_ar}</p>
                        </div>
                        {um.tuition_per_year != null && (
                          <div className={isRtl ? 'text-left' : 'text-right'}>
                            <p className="text-sm font-black text-[#d4a843]">
                              {um.tuition_per_year === 0 ? t("details.free") : `${um.tuition_per_year.toLocaleString()} ${isAr ? "ج.م" : "EGP"}`}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase">/ {isAr ? "سنة" : "year"}</p>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-3 pt-2 border-t border-gray-50 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        {um.min_score && (
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <BadgeCheck size={12} className="text-[#d4a843]" />
                            {isAr ? "تنسيق" : "Cutoff"} {um.min_score}%
                          </span>
                        )}
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Globe2 size={12} className="text-[#d4a843]" />
                          {isAr ? langLabel[um.language]?.ar : langLabel[um.language]?.en}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">{isAr ? "سيتم إضافة تفاصيل الأقسام قريباً" : "Department details coming soon"}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
