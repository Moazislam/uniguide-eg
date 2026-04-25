"use client";

import { useState } from "react";
import type { Faculty, FacultyCategory, UniversityMajor } from "@/types";
import { Clock, DollarSign, Globe2, BookOpen, BadgeCheck, GraduationCap, Info } from "lucide-react";
import Modal from "@/components/layout/Modal";

const categoryMeta: Record<FacultyCategory, { ar: string; emoji: string; color: string }> = {
  medicine:       { ar: "طب",            emoji: "🏥", color: "bg-red-50 text-red-700 border-red-100" },
  pharmacy:       { ar: "صيدلة",         emoji: "💊", color: "bg-amber-50 text-amber-700 border-amber-100" },
  dentistry:      { ar: "أسنان",         emoji: "🦷", color: "bg-sky-50 text-sky-700 border-sky-100" },
  engineering:    { ar: "هندسة",         emoji: "⚙️", color: "bg-blue-50 text-blue-700 border-blue-100" },
  computer_science:{ ar: "حاسبات",       emoji: "💻", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  business:       { ar: "تجارة وإدارة", emoji: "💼", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  law:            { ar: "حقوق",          emoji: "⚖️", color: "bg-purple-50 text-purple-700 border-purple-100" },
  arts:           { ar: "آداب",          emoji: "🎨", color: "bg-pink-50 text-pink-700 border-pink-100" },
  science:        { ar: "علوم",          emoji: "🔬", color: "bg-teal-50 text-teal-700 border-teal-100" },
  architecture:   { ar: "عمارة وفنون",  emoji: "🏛️", color: "bg-orange-50 text-orange-700 border-orange-100" },
  media:          { ar: "إعلام",         emoji: "📡", color: "bg-rose-50 text-rose-700 border-rose-100" },
  education:      { ar: "تربية",         emoji: "📚", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  agriculture:    { ar: "زراعة",         emoji: "🌾", color: "bg-lime-50 text-lime-700 border-lime-100" },
  tourism:        { ar: "سياحة",         emoji: "✈️", color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  other:          { ar: "أخرى",          emoji: "🎓", color: "bg-gray-50 text-gray-600 border-gray-100" },
};

const langLabel: Record<string, string> = {
  arabic:   "عربي",
  english:  "إنجليزي",
  bilingual:"ثنائي",
};

interface Props {
  faculties: Faculty[];
  universityMajors?: UniversityMajor[];
  universityLanguage?: string;
}

export default function FacultiesSection({ faculties, universityMajors = [] }: Props) {
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <BookOpen size={20} className="text-[#d4a843] flex-shrink-0" />
        <div>
          <h2 className="font-bold text-[#1a3a5c] font-cairo text-base">
            الكليات والمعاهد ({faculties.length})
          </h2>
          <p className="text-xs text-gray-400 font-cairo">Faculties & Schools</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-gray-50 bg-[#faf7f2]">
        <button
          onClick={() => setActive("all")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold font-cairo transition-all border ${
            active === "all"
              ? "bg-[#1a3a5c] text-white border-[#1a3a5c]"
              : "bg-white text-gray-500 border-gray-200 hover:border-[#d4a843]/40 hover:text-[#1a3a5c]"
          }`}
        >
          الكل ({faculties.length})
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
              <span>{meta.ar}</span>
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
              className="group text-right rounded-xl border border-gray-100 bg-[#faf7f2] hover:border-[#d4a843]/30 hover:shadow-md hover:bg-white transition-all p-4 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-[#d4a843]/20"
            >
              {/* Card top */}
              <div className="flex items-start gap-3 w-full">
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center text-base ${meta.color}`}>
                  {meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a3a5c] font-cairo text-sm leading-tight line-clamp-2">
                    {faculty.name_ar}
                  </p>
                  <p className="text-[11px] text-gray-400 font-cairo mt-0.5 line-clamp-1">
                    {faculty.name_en}
                  </p>
                </div>
              </div>

              {/* Description */}
              {faculty.description_ar && (
                <p className="text-xs text-gray-500 font-cairo leading-relaxed line-clamp-2 text-right">
                  {faculty.description_ar}
                </p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap mt-auto pt-2 border-t border-gray-100 w-full">
                {faculty.duration_years != null && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-cairo">
                    <Clock size={11} className="text-[#d4a843]" />
                    {faculty.duration_years} سنوات
                  </span>
                )}
                <span className="flex items-center gap-1 text-[11px] text-[#d4a843] font-bold font-cairo mr-auto">
                  <Info size={11} /> التفاصيل
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
        title={selectedFaculty?.name_ar ?? ""}
      >
        {selectedFaculty && (
          <div className="space-y-6 font-cairo">
            {/* Faculty Info */}
            <div className="flex items-start gap-4 p-4 bg-[#faf7f2] rounded-2xl border border-[#d4a843]/10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${categoryMeta[selectedFaculty.category]?.color}`}>
                {categoryMeta[selectedFaculty.category]?.emoji}
              </div>
              <div>
                <h4 className="font-bold text-[#1a3a5c] mb-1">{selectedFaculty.name_en}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedFaculty.description_ar || "لا يوجد وصف متاح حالياً."}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-gray-100 rounded-xl text-center">
                <Clock size={16} className="text-[#d4a843] mx-auto mb-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">المدة / Duration</p>
                <p className="font-bold text-[#1a3a5c]">{selectedFaculty.duration_years} سنوات</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-xl text-center">
                <Globe2 size={16} className="text-[#d4a843] mx-auto mb-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">اللغة / Language</p>
                <p className="font-bold text-[#1a3a5c]">{langLabel[selectedFaculty.language ?? "arabic"]}</p>
              </div>
              {minScore && (
                <div className="p-3 bg-[#fff9ee] border border-[#d4a843]/20 rounded-xl text-center">
                  <BadgeCheck size={16} className="text-[#d4a843] mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">أدنى درجة / Min Score</p>
                  <p className="font-bold text-[#b8922a]">{minScore}%</p>
                </div>
              )}
            </div>

            {/* Departments / Majors */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#1a3a5c]">
                <GraduationCap size={20} className="text-[#d4a843]" />
                <h4 className="font-bold">التخصصات والأقسام / Departments</h4>
              </div>
              
              {facultyMajors.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {facultyMajors.map((um) => (
                    <div key={um.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:border-[#d4a843]/40 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-[#1a3a5c] text-sm">{um.major?.name_ar}</p>
                          <p className="text-xs text-gray-400">{um.major?.name_en}</p>
                        </div>
                        {um.tuition_per_year != null && (
                          <div className="text-left">
                            <p className="text-sm font-black text-[#d4a843]">
                              {um.tuition_per_year === 0 ? "مجاني" : um.tuition_per_year.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase">{um.currency ?? "EGP"} / سنة</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                        {um.min_score && (
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <BadgeCheck size={12} className="text-[#d4a843]" />
                            تنسيق {um.min_score}%
                          </span>
                        )}
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Globe2 size={12} className="text-[#d4a843]" />
                          {langLabel[um.language] ?? um.language}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">سيتم إضافة تفاصيل الأقسام قريباً</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
