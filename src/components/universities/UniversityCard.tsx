"use client";

import Link from "next/link";
import { BadgeCheck, GraduationCap, MapPin, BookOpen, TrendingUp } from "lucide-react";
import CompareButton from "@/components/compare/CompareButton";
import ShortlistButton from "@/components/universities/ShortlistButton";
import type { MatchRecommendation, University } from "@/types";
import { useLanguage } from "@/lib/LanguageContext";
import { useSearchParams } from "next/navigation";

interface Props {
  university: University;
  recommendation?: MatchRecommendation;
}

const typeConfig: Record<string, { ar: string; en: string; bg: string; text: string; border: string }> = {
  public: {
    ar: "حكومية", en: "Public",
    bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-[#1a3a5c] dark:text-blue-200", border: "border-blue-200/60 dark:border-blue-800/50",
  },
  private: {
    ar: "خاصة", en: "Private",
    bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-[#b8922a] dark:text-amber-200", border: "border-amber-200/60 dark:border-amber-800/50",
  },
  international: {
    ar: "دولية", en: "International",
    bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200/60 dark:border-emerald-800/50",
  },
};

function MatchScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(212,168,67,0.2)" strokeWidth="3.5" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke="#d4a843" strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-black text-white">{score}%</span>
    </div>
  );
}

export default function UniversityCard({ university, recommendation }: Props) {
  const { t, language, isRtl } = useLanguage();
  const isAr = language === "ar";
  const searchParams = useSearchParams();
  const selectedTrack = searchParams.get("track");
  const config = typeConfig[university.type] ?? typeConfig.public;

  const getAdmissionSnippet = () => {
    if (!selectedTrack) return null;
    let admission = "";
    if (selectedTrack === "ig") admission = university.admission_ig || "";
    else if (selectedTrack === "american") admission = university.admission_american || "";
    else if (selectedTrack === "french") admission = university.admission_french || "";
    else if (selectedTrack === "national") admission = university.admission_national || "";

    if (!admission) return null;
    return (
      <div className="mt-3 px-3 py-2 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/20">
        <p className="text-[10px] text-[#b8922a] font-bold uppercase tracking-wider mb-1">
          {isAr ? "متطلبات القبول" : "Admission Info"}
        </p>
        <p className="text-xs text-text-secondary font-cairo line-clamp-2 leading-relaxed">
          {admission}
        </p>
      </div>
    );
  };

  return (
    <Link
      href={`/universities/${university.slug}`}
      className="group relative block rounded-[20px] border-2 border-border bg-card-bg overflow-hidden transition-all duration-300 hover:border-[#d4a843]/40 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="relative h-32 bg-gradient-to-br from-[#1a3a5c] via-[#1f4a70] to-[#2a5a8c] overflow-hidden">
        {university.cover_url && (
          <img
            src={university.cover_url}
            alt={isAr ? `صورة غلاف ${university.name_ar}` : `Cover photo of ${university.name_en}`}
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1a3a5c]/80 dark:from-[#0f2438]/90 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg font-cairo border backdrop-blur-sm ${config.bg} ${config.text} ${config.border}`}>
              {isAr ? config.ar : config.en}
            </span>
            {university.ranking_egypt && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/90 dark:bg-card-bg/90 backdrop-blur-sm text-text-primary font-cairo border border-white/60 dark:border-white/10">
                <BadgeCheck size={11} className="text-[#d4a843]" />
                #{university.ranking_egypt}
              </span>
            )}
          </div>
          {recommendation && (
            <MatchScoreRing score={recommendation.overallScore} />
          )}
        </div>

        <div className={`absolute -bottom-6 ${isRtl ? 'right-5' : 'left-5'} w-14 h-14 rounded-2xl bg-card-bg shadow-[0_4px_16px_rgba(0,0,0,0.1)] border-2 border-card-bg flex items-center justify-center overflow-hidden group-hover:shadow-[0_4px_20px_rgba(212,168,67,0.25)] transition-shadow duration-300 z-10`}>
          {university.logo_url ? (
            <img
              src={university.logo_url}
              alt={isAr ? `شعار ${university.name_ar}` : `Logo of ${university.name_en}`}
              className="w-10 h-10 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <GraduationCap size={24} className="text-text-primary" />
          )}
        </div>
      </div>

      <div className="p-5 pt-9 text-start">
        <h3 className="font-bold text-text-primary text-[15px] leading-snug font-cairo group-hover:text-[#d4a843] transition-colors duration-200">
          {isAr ? university.name_ar : university.name_en}
        </h3>
        <p className="text-xs text-text-secondary font-cairo mt-0.5">{isAr ? university.name_en : university.name_ar}</p>

        <div className="flex items-center gap-1.5 mt-2.5">
          <MapPin size={13} className="text-[#d4a843] flex-shrink-0" />
          <span className="text-xs text-text-secondary font-cairo">{isAr ? university.location_ar : university.location_en}</span>
        </div>

        {getAdmissionSnippet()}

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {university.faculties_count != null && (
            <span className="inline-flex items-center gap-1.5 bg-border/40 text-text-primary text-[11px] font-semibold px-2.5 py-1.5 rounded-lg font-cairo">
              <BookOpen size={11} className="text-[#d4a843]" />
              {university.faculties_count} {isAr ? "كلية" : "Faculties"}
            </span>
          )}
          {university.tuition_min != null && (
            <span className="inline-flex items-center gap-1 bg-[#d4a843]/10 text-[#b8922a] dark:text-[#e8c06a] text-[11px] font-bold px-2.5 py-1.5 rounded-lg font-cairo">
              {university.tuition_min === 0
                ? (isAr ? "مجاني" : "Free")
                : `${university.tuition_min.toLocaleString()} ${isAr ? "ج.م" : "EGP"}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <CompareButton universityId={university.id} compact />
          <ShortlistButton universityId={university.id} compact />
        </div>

        {recommendation && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-[#faf7f2] to-[#fff9ee] dark:from-blue-dark/50 dark:to-blue-dark/30 p-3.5 border border-[#d4a843]/10">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-[#d4a843]" />
                <p className="text-[11px] font-bold text-text-primary font-cairo">
                  {isAr ? "أفضل التخصصات" : "Top matching majors"} ({recommendation.matchedMajorsCount})
                </p>
              </div>
              <div className="space-y-2.5">
                {recommendation.topMajors.map((majorMatch) => (
                  <div key={majorMatch.universityMajor.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary font-cairo truncate">{isAr ? majorMatch.major.name_ar : majorMatch.major.name_en}</p>
                      <p className="text-[10px] text-text-secondary font-cairo">{isAr ? majorMatch.major.name_en : majorMatch.major.name_ar}</p>
                      {majorMatch.universityMajor.min_score != null && (
                        <p className="text-[10px] text-text-secondary font-cairo mt-0.5">
                          {isAr ? "الحد الأدنى" : "Cutoff"}: {majorMatch.universityMajor.min_score}%
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <span className="text-sm font-black text-[#d4a843] font-cairo">{majorMatch.matchScore}%</span>
                      <div className="w-10 h-1 rounded-full bg-[#d4a843]/15 mt-1">
                        <div
                          className="h-full rounded-full bg-[#d4a843] transition-all duration-500"
                          style={{ width: `${majorMatch.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {recommendation.reasons.slice(0, 2).map((reason) => (
                <p key={reason} className="text-[10px] text-text-secondary font-cairo leading-relaxed flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#d4a843] mt-1.5 flex-shrink-0" />
                  {reason}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
