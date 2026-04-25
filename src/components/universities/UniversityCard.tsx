"use client";

import Link from "next/link";
import { BadgeCheck, GraduationCap, MapPin } from "lucide-react";
import CompareButton from "@/components/compare/CompareButton";
import ShortlistButton from "@/components/universities/ShortlistButton";
import type { MatchRecommendation, University } from "@/types";
import { useLanguage } from "@/lib/LanguageContext";

interface Props {
  university: University;
  recommendation?: MatchRecommendation;
}

const typeColors: Record<string, string> = {
  public: "bg-blue-100 text-[#1a3a5c]",
  private: "bg-amber-100 text-[#b8922a]",
  international: "bg-green-100 text-green-700",
};

const typeLabels: Record<string, { ar: string; en: string }> = {
  public: { ar: "حكومية", en: "Public" },
  private: { ar: "خاصة", en: "Private" },
  international: { ar: "دولية", en: "International" },
};

export default function UniversityCard({ university, recommendation }: Props) {
  const { language, isRtl } = useLanguage();
  const isAr = language === "ar";

  return (
    <Link
      href={`/universities/${university.slug}`}
      className="group block bg-white dark:bg-[#111b2d] rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-[#d4a843]/40 dark:hover:border-[#d4a843]/40 hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      <div className="h-32 bg-[#1a3a5c] relative overflow-hidden">
        {university.cover_url ? (
          <>
            <img
              src={university.cover_url}
              alt={isAr ? university.name_ar : university.name_en}
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a5c] dark:from-[#0a1120] via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a3a5c] to-[#2a5a8c]" />
        )}
        
        <div className={`absolute -bottom-6 ${isRtl ? 'right-6' : 'left-6'} w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden z-10 group-hover:scale-105 transition-transform duration-300`}>
          {university.logo_url ? (
            <img src={university.logo_url} alt={isAr ? university.name_ar : university.name_en} className="w-12 h-12 object-contain" />
          ) : (
            <GraduationCap size={28} className="text-[#1a3a5c] dark:text-[#d4a843]" />
          )}
        </div>
        
        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} flex items-center gap-2 z-10`}>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg font-cairo ${typeColors[university.type]} !bg-opacity-90 dark:!bg-opacity-80`}>
            {isAr ? typeLabels[university.type]?.ar : typeLabels[university.type]?.en}
          </span>
          {recommendation && (
            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg font-cairo bg-white/90 dark:bg-slate-800/90 text-[#1a3a5c] dark:text-[#d4a843]">
              {recommendation.overallScore}% {isAr ? "توافق" : "Match"}
            </span>
          )}
        </div>
      </div>

      <div className={`p-6 ${isRtl ? 'pt-10' : 'pt-10 text-left'}`}>
        <h3 className="font-bold text-[#1a3a5c] dark:text-white text-base leading-snug font-cairo group-hover:text-[#d4a843] transition-colors">
          {isAr ? university.name_ar : university.name_en}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-cairo mt-0.5">{isAr ? university.name_en : university.name_ar}</p>

        <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400">
          <MapPin size={12} />
          <span className="text-xs font-cairo">{isAr ? university.location_ar : university.location_en}</span>
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
          {university.faculties_count && (
            <div className="text-center">
              <p className="text-xs font-bold text-[#1a3a5c] dark:text-[#d4a843] font-cairo">{university.faculties_count}</p>
              <p className="text-[10px] text-gray-400 font-cairo">{isAr ? "كلية" : "Faculties"}</p>
            </div>
          )}
          {university.tuition_min != null && (
            <div className="text-center">
              <p className="text-xs font-bold text-[#d4a843] font-cairo">
                {university.tuition_min === 0
                  ? (isAr ? "مجاني" : "Free")
                  : `${university.tuition_min.toLocaleString()} ${isAr ? "ج.م" : "EGP"}`}
              </p>
              <p className="text-[10px] text-gray-400 font-cairo">{isAr ? "بداية من" : "Starting from"}</p>
            </div>
          )}
          {university.ranking_egypt && (
            <div className={isRtl ? "mr-auto" : "ml-auto"}>
              <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-cairo">
                <BadgeCheck size={11} className="text-[#d4a843]" />
                #{university.ranking_egypt} {isAr ? "في مصر" : "in Egypt"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <CompareButton universityId={university.id} compact />
          <ShortlistButton universityId={university.id} compact />
        </div>

        {recommendation && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-[#faf7f2] dark:bg-slate-900/50 p-3 border border-gray-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-[#1a3a5c] dark:text-[#d4a843] font-cairo mb-2">
                {isAr ? "أفضل التخصصات المتوافقة" : "Top matching majors"} ({recommendation.matchedMajorsCount})
              </p>
              <div className="space-y-2">
                {recommendation.topMajors.map((majorMatch) => (
                  <div key={majorMatch.universityMajor.id} className="flex items-start justify-between gap-3">
                    <div className={isRtl ? "" : "text-left"}>
                      <p className="text-sm font-bold text-[#1a3a5c] dark:text-white font-cairo">{isAr ? majorMatch.major.name_ar : majorMatch.major.name_en}</p>
                      <p className="text-[11px] text-gray-400 font-cairo">{isAr ? majorMatch.major.name_en : majorMatch.major.name_ar}</p>
                      {majorMatch.universityMajor.min_score != null && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-cairo">
                          {isAr ? "تنسيق" : "Cutoff"}: {majorMatch.universityMajor.min_score}%
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-black text-[#d4a843] font-cairo">{majorMatch.matchScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
