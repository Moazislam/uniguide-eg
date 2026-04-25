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
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className="h-28 bg-gradient-to-br from-[#1a3a5c] to-[#2a5a8c] relative">
        {university.cover_url && (
          <img
            src={university.cover_url}
            alt={isAr ? university.name_ar : university.name_en}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className={`absolute -bottom-5 ${isRtl ? 'right-4' : 'left-4'} w-14 h-14 rounded-xl bg-white shadow border border-gray-100 flex items-center justify-center overflow-hidden`}>
          {university.logo_url ? (
            <img src={university.logo_url} alt={isAr ? university.name_ar : university.name_en} className="w-10 h-10 object-contain" />
          ) : (
            <GraduationCap size={24} className="text-[#1a3a5c]" />
          )}
        </div>
        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} flex items-center gap-2`}>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full font-cairo ${typeColors[university.type]}`}>
            {isAr ? typeLabels[university.type]?.ar : typeLabels[university.type]?.en}
          </span>
          {recommendation && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full font-cairo bg-white/90 text-[#1a3a5c]">
              {recommendation.overallScore}% {isAr ? "توافق" : "Match"}
            </span>
          )}
        </div>
      </div>

      <div className={`p-4 ${isRtl ? 'pt-8' : 'pt-8 text-left'}`}>
        <h3 className="font-bold text-[#1a3a5c] text-base leading-snug font-cairo group-hover:text-[#d4a843] transition-colors">
          {isAr ? university.name_ar : university.name_en}
        </h3>
        <p className="text-xs text-gray-500 font-cairo mt-0.5">{isAr ? university.name_en : university.name_ar}</p>

        <div className="flex items-center gap-1 mt-2 text-gray-500">
          <MapPin size={12} />
          <span className="text-xs font-cairo">{isAr ? university.location_ar : university.location_en}</span>
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          {university.faculties_count && (
            <div className="text-center">
              <p className="text-xs font-bold text-[#1a3a5c] font-cairo">{university.faculties_count}</p>
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
              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-cairo">
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
            <div className="rounded-xl bg-[#faf7f2] p-3">
              <p className="text-[11px] font-semibold text-[#1a3a5c] font-cairo mb-2">
                {isAr ? "أفضل التخصصات المتوافقة" : "Top matching majors"} ({recommendation.matchedMajorsCount})
              </p>
              <div className="space-y-2">
                {recommendation.topMajors.map((majorMatch) => (
                  <div key={majorMatch.universityMajor.id} className="flex items-start justify-between gap-3">
                    <div className={isRtl ? "" : "text-left"}>
                      <p className="text-sm font-bold text-[#1a3a5c] font-cairo">{isAr ? majorMatch.major.name_ar : majorMatch.major.name_en}</p>
                      <p className="text-[11px] text-gray-400 font-cairo">{isAr ? majorMatch.major.name_en : majorMatch.major.name_ar}</p>
                      {majorMatch.universityMajor.min_score != null && (
                        <p className="text-[11px] text-gray-500 font-cairo">
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
