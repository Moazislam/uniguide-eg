import Link from "next/link";
import { MapPin, GraduationCap, BadgeCheck } from "lucide-react";
import type { University } from "@/types";

interface Props {
  university: University;
}

const typeColors: Record<string, string> = {
  public: "bg-blue-100 text-[#1a3a5c]",
  private: "bg-amber-100 text-[#b8922a]",
  international: "bg-green-100 text-green-700",
};

const typeLabels: Record<string, { ar: string; en: string }> = {
  public:        { ar: "حكومية",      en: "Public" },
  private:       { ar: "خاصة",        en: "Private" },
  international: { ar: "دولية",       en: "International" },
};

export default function UniversityCard({ university }: Props) {
  return (
    <Link
      href={`/universities/${university.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Cover / Header */}
      <div className="h-28 bg-gradient-to-br from-[#1a3a5c] to-[#2a5a8c] relative">
        {university.cover_url && (
          <img
            src={university.cover_url}
            alt={university.name_en}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        {/* Logo */}
        <div className="absolute -bottom-5 right-4 w-14 h-14 rounded-xl bg-white shadow border border-gray-100 flex items-center justify-center overflow-hidden">
          {university.logo_url ? (
            <img src={university.logo_url} alt={university.name_en} className="w-10 h-10 object-contain" />
          ) : (
            <GraduationCap size={24} className="text-[#1a3a5c]" />
          )}
        </div>
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full font-cairo ${typeColors[university.type]}`}>
            {typeLabels[university.type]?.ar}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <h3 className="font-bold text-[#1a3a5c] text-base leading-snug font-cairo group-hover:text-[#d4a843] transition-colors">
          {university.name_ar}
        </h3>
        <p className="text-xs text-gray-500 font-cairo mt-0.5">{university.name_en}</p>

        <div className="flex items-center gap-1 mt-2 text-gray-500">
          <MapPin size={12} />
          <span className="text-xs font-cairo">{university.location_ar}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          {university.faculties_count && (
            <div className="text-center">
              <p className="text-xs font-bold text-[#1a3a5c] font-cairo">{university.faculties_count}</p>
              <p className="text-[10px] text-gray-400 font-cairo">كلية</p>
            </div>
          )}
          {university.tuition_min && (
            <div className="text-center">
              <p className="text-xs font-bold text-[#d4a843] font-cairo">
                {university.tuition_min.toLocaleString()} {university.tuition_currency ?? "EGP"}
              </p>
              <p className="text-[10px] text-gray-400 font-cairo">يبدأ من</p>
            </div>
          )}
          {university.ranking_egypt && (
            <div className="mr-auto">
              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-cairo">
                <BadgeCheck size={11} className="text-[#d4a843]" />
                #{university.ranking_egypt} في مصر
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
