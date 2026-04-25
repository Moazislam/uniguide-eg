"use client";

import { useState } from "react";
import type { Faculty, FacultyCategory } from "@/types";
import { Clock, DollarSign, Globe2, BookOpen } from "lucide-react";

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
  universityLanguage?: string;
}

export default function FacultiesSection({ faculties }: Props) {
  const categories = Array.from(new Set(faculties.map((f) => f.category)));
  const [active, setActive] = useState<FacultyCategory | "all">("all");

  const visible = active === "all" ? faculties : faculties.filter((f) => f.category === active);

  if (faculties.length === 0) return null;

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
            <div
              key={faculty.id}
              className="group rounded-xl border border-gray-100 bg-[#faf7f2] hover:border-[#d4a843]/30 hover:shadow-sm transition-all p-4 flex flex-col gap-3"
            >
              {/* Card top */}
              <div className="flex items-start gap-3">
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
                <p className="text-xs text-gray-500 font-cairo leading-relaxed line-clamp-3">
                  {faculty.description_ar}
                </p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap mt-auto pt-2 border-t border-gray-100">
                {faculty.duration_years != null && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-cairo">
                    <Clock size={11} className="text-[#d4a843]" />
                    {faculty.duration_years} سنوات
                  </span>
                )}
                {faculty.language && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-cairo">
                    <Globe2 size={11} className="text-[#d4a843]" />
                    {langLabel[faculty.language] ?? faculty.language}
                  </span>
                )}
                {faculty.tuition_min != null && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#d4a843] font-cairo ml-auto">
                    <DollarSign size={11} />
                    {faculty.tuition_min === 0
                      ? "مجاني"
                      : `${faculty.tuition_min.toLocaleString()} ${faculty.currency ?? "EGP"}`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
