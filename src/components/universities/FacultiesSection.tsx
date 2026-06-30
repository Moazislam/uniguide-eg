"use client";

import { useState } from "react";
import type { Faculty, FacultyCategory, UniversityMajor } from "@/types";
import { Clock, DollarSign, Globe2, BookOpen, BadgeCheck, GraduationCap, Info, ChevronRight } from "lucide-react";
import Modal from "@/components/layout/Modal";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

const categoryMeta: Record<FacultyCategory, { ar: string; en: string; emoji: string; bgFrom: string; bgTo: string; border: string }> = {
  medicine:         { ar: "طب",            en: "Medicine",         emoji: "🏥", bgFrom: "from-red-50 dark:from-red-900/20",     bgTo: "to-rose-50 dark:to-rose-900/10",    border: "border-red-100 dark:border-red-900/30" },
  pharmacy:         { ar: "صيدلة",         en: "Pharmacy",         emoji: "💊", bgFrom: "from-amber-50 dark:from-amber-900/20",   bgTo: "to-orange-50 dark:to-orange-900/10",  border: "border-amber-100 dark:border-amber-900/30" },
  dentistry:        { ar: "أسنان",         en: "Dentistry",        emoji: "🦷", bgFrom: "from-sky-50 dark:from-sky-900/20",     bgTo: "to-cyan-50 dark:to-cyan-900/10",    border: "border-sky-100 dark:border-sky-900/30" },
  engineering:      { ar: "هندسة",         en: "Engineering",      emoji: "⚙️", bgFrom: "from-blue-50 dark:from-blue-900/20",    bgTo: "to-indigo-50 dark:to-indigo-900/10",  border: "border-blue-100 dark:border-blue-900/30" },
  computer_science: { ar: "حاسبات",        en: "Computer Science", emoji: "💻", bgFrom: "from-indigo-50 dark:from-indigo-900/20",  bgTo: "to-violet-50 dark:to-violet-900/10",  border: "border-indigo-100 dark:border-indigo-900/30" },
  business:         { ar: "تجارة وإدارة",  en: "Business",         emoji: "💼", bgFrom: "from-emerald-50 dark:from-emerald-900/20", bgTo: "to-green-50 dark:to-green-900/10",   border: "border-emerald-100 dark:border-emerald-900/30" },
  law:              { ar: "حقوق",          en: "Law",              emoji: "⚖️", bgFrom: "from-purple-50 dark:from-purple-900/20",  bgTo: "to-fuchsia-50 dark:to-fuchsia-900/10", border: "border-purple-100 dark:border-purple-900/30" },
  arts:             { ar: "آداب",          en: "Arts",             emoji: "🎨", bgFrom: "from-pink-50 dark:from-pink-900/20",    bgTo: "to-rose-50 dark:to-rose-900/10",    border: "border-pink-100 dark:border-pink-900/30" },
  science:          { ar: "علوم",          en: "Science",          emoji: "🔬", bgFrom: "from-teal-50 dark:from-teal-900/20",    bgTo: "to-cyan-50 dark:to-cyan-900/10",    border: "border-teal-100 dark:border-teal-900/30" },
  architecture:     { ar: "عمارة وفنون",   en: "Architecture",     emoji: "🏛️", bgFrom: "from-orange-50 dark:from-orange-900/20",  bgTo: "to-amber-50 dark:to-amber-900/10",   border: "border-orange-100 dark:border-orange-900/30" },
  media:            { ar: "إعلام",         en: "Media",            emoji: "📡", bgFrom: "from-rose-50 dark:from-rose-900/20",    bgTo: "to-pink-50 dark:to-pink-900/10",    border: "border-rose-100 dark:border-rose-900/30" },
  education:        { ar: "تربية",         en: "Education",        emoji: "📚", bgFrom: "from-yellow-50 dark:from-yellow-900/20",  bgTo: "to-amber-50 dark:to-amber-900/10",   border: "border-yellow-100 dark:border-yellow-900/30" },
  agriculture:      { ar: "زراعة",         en: "Agriculture",      emoji: "🌾", bgFrom: "from-lime-50 dark:from-lime-900/20",    bgTo: "to-green-50 dark:to-green-900/10",   border: "border-lime-100 dark:border-lime-900/30" },
  tourism:          { ar: "سياحة",         en: "Tourism",          emoji: "✈️", bgFrom: "from-cyan-50 dark:from-cyan-900/20",    bgTo: "to-sky-50 dark:to-sky-900/10",     border: "border-cyan-100 dark:border-cyan-900/30" },
  other:            { ar: "أخرى",          en: "Other",            emoji: "🎓", bgFrom: "from-gray-50 dark:from-gray-900/20",    bgTo: "to-slate-50 dark:to-slate-900/10",   border: "border-gray-100 dark:border-gray-900/30" },
};

const langLabel: Record<string, { ar: string; en: string }> = {
  arabic:   { ar: "عربي", en: "Arabic" },
  english:  { ar: "إنجليزي", en: "English" },
  bilingual:{ ar: "ثنائي", en: "Bilingual" },
};

interface Props {
  faculties: Faculty[];
  universityMajors?: UniversityMajor[];
  universitySlug: string;
}

export default function FacultiesSection({ faculties, universityMajors = [], universitySlug }: Props) {
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
    <div className={`bg-card-bg rounded-[20px] border-2 border-border shadow-sm overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b border-border bg-gradient-to-br from-nav-bg to-card-bg flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="w-10 h-10 rounded-xl bg-blue/10 dark:bg-amber/10 flex items-center justify-center flex-shrink-0">
          <BookOpen size={20} className="text-blue dark:text-amber" />
        </div>
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h2 className="font-bold text-text-primary font-cairo text-base">
            {t("details.faculties")} ({faculties.length})
          </h2>
          <p className="text-xs text-text-secondary/80 font-cairo">Faculties & Schools</p>
        </div>
        <Link 
          href={`/universities/${universitySlug}/faculties`}
          className={`text-[11px] font-black text-amber hover:underline font-cairo ${isRtl ? 'mr-auto' : 'ml-auto'}`}
        >
          {isAr ? "عرض الكل" : "View All"} →
        </Link>
      </div>

      {/* Category filters */}
      <div className={`relative border-b border-border bg-nav-bg`}>
        <div className={`flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <button
            onClick={() => setActive("all")}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold font-cairo transition-all duration-300 border ${
              active === "all"
                ? "bg-blue dark:bg-amber text-white dark:text-blue-dark border-blue dark:border-amber shadow-sm"
                : "bg-card-bg text-text-secondary border-border hover:border-amber/40 hover:text-blue dark:hover:text-amber"
            }`}
          >
            {t("major.all")}
            <span className={`mx-1.5 text-[10px] px-1.5 py-0.5 rounded-md font-cairo ${
              active === "all" ? "bg-white/20 text-white" : "bg-border text-text-secondary"
            }`}>{faculties.length}</span>
          </button>
          {categories.map((cat) => {
            const meta = categoryMeta[cat] ?? categoryMeta.other;
            const count = faculties.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-cairo transition-all duration-300 border ${
                  active === cat
                    ? "bg-blue dark:bg-amber text-white dark:text-blue-dark border-blue dark:border-amber shadow-sm"
                    : "bg-card-bg text-text-secondary border-border hover:border-amber/40 hover:text-blue dark:hover:text-amber"
                }`}
              >
                <span className="text-sm">{meta.emoji}</span>
                <span>{isAr ? meta.ar : meta.en}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-cairo ${
                  active === cat ? "bg-white/20 text-white" : "bg-border text-text-secondary"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Faculty cards grid */}
      <div className="p-4">
        {visible.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap size={36} className="mx-auto mb-3 text-border" />
            <p className="text-sm text-text-secondary font-cairo">{isAr ? "لا توجد كليات في هذا التصنيف" : "No faculties in this category"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visible.map((faculty) => {
              const meta = categoryMeta[faculty.category] ?? categoryMeta.other;
              return (
                <button
                  key={faculty.id}
                  onClick={() => setSelectedFaculty(faculty)}
                  className={`group rounded-2xl border-2 border-transparent bg-gradient-to-br ${meta.bgFrom} ${meta.bgTo} dark:border-border/50 p-4 flex flex-col gap-3 transition-all duration-300 hover:border-amber/30 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber/20 ${isRtl ? 'text-right' : 'text-left'}`}
                >
                  <div className={`flex items-start gap-3 w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${meta.border} bg-white/80 dark:bg-card-bg/80 shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                      {meta.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-primary font-cairo text-sm leading-tight line-clamp-2 group-hover:text-amber transition-colors duration-200">
                        {isAr ? faculty.name_ar : faculty.name_en}
                      </p>
                      <p className="text-[11px] text-text-secondary/80 font-cairo mt-0.5 line-clamp-1">
                        {isAr ? faculty.name_en : faculty.name_ar}
                      </p>
                    </div>
                  </div>

                  {faculty.description_ar && (
                    <p className="text-[11px] text-text-secondary font-cairo leading-relaxed line-clamp-2 text-start">
                      {isAr ? faculty.description_ar : faculty.name_en}
                    </p>
                  )}

                  <div className={`flex items-center gap-2 flex-wrap mt-auto pt-3 border-t border-black/5 dark:border-white/5 w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                    {faculty.duration_years != null && (
                      <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-card-bg/80 text-[11px] text-text-secondary font-semibold px-2 py-1 rounded-lg font-cairo border border-white dark:border-border shadow-sm">
                        <Clock size={10} className="text-amber" />
                        {faculty.duration_years} {t("details.years")}
                      </span>
                    )}
                    {faculty.language && (
                      <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-card-bg/80 text-[11px] text-text-secondary font-semibold px-2 py-1 rounded-lg font-cairo border border-white dark:border-border shadow-sm">
                        <Globe2 size={10} className="text-amber" />
                        {isAr ? langLabel[faculty.language]?.ar : langLabel[faculty.language]?.en}
                      </span>
                    )}
                    {faculty.tuition_min != null && faculty.tuition_min > 0 && (
                      <span className={`inline-flex items-center gap-1 bg-white/80 dark:bg-card-bg/80 text-[11px] font-bold text-amber px-2 py-1 rounded-lg font-cairo border border-white dark:border-border shadow-sm ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
                        <DollarSign size={10} />
                        {faculty.tuition_min.toLocaleString()} {isAr ? "ج.م" : "EGP"}
                      </span>
                    )}
                    {(() => {
                      const scoreToShow = faculty.min_score || (
                        universityMajors.filter(um => um.major?.category === faculty.category)
                        .map(um => um.min_score ?? 100)
                        .filter(s => s > 0)
                        .reduce((min, s) => Math.min(min, s), 100)
                      );
                      
                      return scoreToShow < 100 ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold font-cairo">
                          <BadgeCheck size={11} />
                          {isAr ? "تنسيق" : "Cutoff"} {scoreToShow}%
                        </span>
                      ) : null;
                    })()}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedFaculty} 
        onClose={() => setSelectedFaculty(null)}
        title={selectedFaculty ? (isAr ? selectedFaculty.name_ar : selectedFaculty.name_en) : ""}
      >
        {selectedFaculty && (
          <div className={`space-y-6 font-cairo ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-start gap-4 p-4 bg-nav-bg rounded-2xl border border-border ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${categoryMeta[selectedFaculty.category]?.bgFrom} ${categoryMeta[selectedFaculty.category]?.border} border bg-gradient-to-br`}>
                {categoryMeta[selectedFaculty.category]?.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-primary mb-1">{isAr ? selectedFaculty.name_en : selectedFaculty.name_ar}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {isAr ? (selectedFaculty.description_ar || "لا يوجد وصف متاح حالياً.") : (selectedFaculty.name_en || "No description available.")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-card-bg border border-border rounded-xl text-center">
                <Clock size={16} className="text-amber mx-auto mb-1" />
                <p className="text-[10px] text-text-secondary/80 uppercase tracking-wider">{t("details.duration")}</p>
                <p className="font-bold text-text-primary">{selectedFaculty.duration_years} {t("details.years")}</p>
              </div>
              <div className="p-3 bg-card-bg border border-border rounded-xl text-center">
                <Globe2 size={16} className="text-amber mx-auto mb-1" />
                <p className="text-[10px] text-text-secondary/80 uppercase tracking-wider">{t("details.language")}</p>
                <p className="font-bold text-text-primary">
                  {isAr ? langLabel[selectedFaculty.language ?? "arabic"]?.ar : langLabel[selectedFaculty.language ?? "arabic"]?.en}
                </p>
              </div>
              {minScore && (
                <div className="p-3 bg-amber/5 border border-amber/20 dark:border-amber/10 rounded-xl text-center">
                  <BadgeCheck size={16} className="text-amber mx-auto mb-1" />
                  <p className="text-[10px] text-text-secondary/80 uppercase tracking-wider">{t("details.minScore")}</p>
                  <p className="font-bold text-amber-dark">{minScore}%</p>
                </div>
              )}
            </div>

            {(selectedFaculty.admission_national || selectedFaculty.admission_ig || selectedFaculty.admission_american || selectedFaculty.admission_other) && (
              <div className="space-y-4">
                <div className={`flex items-center gap-2 text-text-primary ${isRtl ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                  <BadgeCheck size={20} className="text-amber" />
                  <h4 className="font-bold">{t("details.admission")}</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {selectedFaculty.admission_national && (
                    <div className="p-4 rounded-2xl bg-blue/5 border border-blue/10">
                      <p className="font-bold text-blue dark:text-blue-light text-[10px] uppercase tracking-wider mb-1">{t("details.thanaweya")}</p>
                      <p className="text-text-secondary text-xs leading-relaxed">{selectedFaculty.admission_national}</p>
                    </div>
                  )}
                  {selectedFaculty.admission_ig && (
                    <div className="p-4 rounded-2xl bg-amber/5 border border-amber/10">
                      <p className="font-bold text-amber-dark text-[10px] uppercase tracking-wider mb-1">{t("details.ig")}</p>
                      <p className="text-text-secondary text-xs leading-relaxed">{selectedFaculty.admission_ig}</p>
                    </div>
                  )}
                  {selectedFaculty.admission_american && (
                    <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-900/20">
                      <p className="font-bold text-purple-600 dark:text-purple-400 text-[10px] uppercase tracking-wider mb-1">{t("details.american")}</p>
                      <p className="text-text-secondary text-xs leading-relaxed">{selectedFaculty.admission_american}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <div className={`flex items-center gap-2 mb-4 text-text-primary ${isRtl ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                <GraduationCap size={20} className="text-amber" />
                <h4 className="font-bold">{t("details.departments")}</h4>
              </div>
              
              {facultyMajors.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {facultyMajors.map((um) => (
                    <div key={um.id} className={`p-4 rounded-xl border border-border bg-card-bg hover:border-amber/40 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className={`flex justify-between items-start mb-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div>
                          <p className="font-bold text-text-primary text-sm">{isAr ? um.major?.name_ar : um.major?.name_en}</p>
                          <p className="text-xs text-text-secondary/80">{isAr ? um.major?.name_en : um.major?.name_ar}</p>
                        </div>
                        {um.tuition_per_year != null && (
                          <div className={isRtl ? 'text-left' : 'text-right'}>
                            <p className="text-sm font-black text-amber">
                              {um.tuition_per_year === 0 ? t("details.free") : `${um.tuition_per_year.toLocaleString()} ${isAr ? "ج.م" : "EGP"}`}
                            </p>
                            <p className="text-[10px] text-text-secondary/80 uppercase">/ {isAr ? "سنة" : "year"}</p>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-3 pt-2 border-t border-border ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        {um.min_score && (
                          <span className="text-[11px] text-text-secondary flex items-center gap-1">
                            <BadgeCheck size={12} className="text-amber" />
                            {isAr ? "تنسيق" : "Cutoff"} {um.min_score}%
                          </span>
                        )}
                        <span className="text-[11px] text-text-secondary flex items-center gap-1">
                          <Globe2 size={12} className="text-amber" />
                          {isAr ? langLabel[um.language]?.ar : langLabel[um.language]?.en}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-nav-bg rounded-2xl border border-dashed border-border">
                  <p className="text-sm text-text-secondary/80">{isAr ? "سيتم إضافة تفاصيل الأقسام قريباً" : "Department details coming soon"}</p>
                </div>
              )}

              <Link
                href={`/universities/${universitySlug}/faculties/${selectedFaculty.id}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue/5 dark:bg-amber/10 border border-blue/10 dark:border-amber/10 py-4 text-sm font-black text-blue dark:text-amber transition-all hover:bg-blue/10 dark:hover:bg-amber/20"
              >
                {isAr ? "عرض التفاصيل الكاملة في صفحة منفصلة" : "View full details in separate page"}
                <ChevronRight size={16} className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
