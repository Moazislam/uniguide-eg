"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import type { University } from "@/types";
import { GitCompareArrows, X, Plus, MapPin, GraduationCap } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "uniguide_compare";

const rows = [
  { key: "type",             label_ar: "النوع",               label_en: "Type" },
  { key: "location_ar",      label_ar: "الموقع",              label_en: "Location" },
  { key: "founded_year",     label_ar: "سنة التأسيس",         label_en: "Founded" },
  { key: "faculties_count",  label_ar: "عدد الكليات",         label_en: "Faculties" },
  { key: "total_students",   label_ar: "عدد الطلاب",          label_en: "Students" },
  { key: "tuition_min",      label_ar: "المصروفات (تبدأ من)", label_en: "Tuition (from)" },
  { key: "ranking_egypt",    label_ar: "الترتيب في مصر",      label_en: "Egypt Ranking" },
];

const typeLabels: Record<string, string> = {
  public: "حكومية / Public",
  private: "خاصة / Private",
  international: "دولية / International",
};

function formatValue(key: string, val: unknown): string {
  if (val == null) return "—";
  if (key === "type") return typeLabels[val as string] ?? String(val);
  if (key === "tuition_min") return `${Number(val).toLocaleString()} EGP`;
  if (key === "total_students") return Number(val).toLocaleString();
  if (key === "ranking_egypt") return `#${val}`;
  return String(val);
}

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setIds(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!ids.length) { setUniversities([]); return; }
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("universities")
      .select("*")
      .in("id", ids)
      .then(({ data }) => {
        setUniversities((data as University[]) ?? []);
        setLoading(false);
      });
  }, [ids]);

  const remove = (id: string) => {
    const next = ids.filter((x) => x !== id);
    setIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#1a3a5c] font-cairo flex items-center gap-2">
            <GitCompareArrows className="text-[#d4a843]" />
            مقارنة الجامعات
          </h1>
          <p className="text-gray-500 font-cairo text-sm">Side-by-Side University Comparison — حتى ٣ جامعات</p>
        </div>

        {ids.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <GitCompareArrows size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-[#1a3a5c] font-cairo mb-2">لا توجد جامعات للمقارنة</p>
            <p className="text-sm text-gray-400 font-cairo mb-6">No universities added to compare yet</p>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo"
            >
              <Plus size={16} />
              أضف جامعات / Add Universities
            </Link>
          </div>
        ) : (
          <>
            {/* University headers */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid font-cairo" style={{ gridTemplateColumns: `200px repeat(${universities.length}, 1fr)` }}>
                {/* Label col header */}
                <div className="p-4 border-b border-r border-gray-100 bg-gray-50" />

                {/* University headers */}
                {loading
                  ? ids.map((id) => (
                      <div key={id} className="p-4 border-b border-r border-gray-100 animate-pulse">
                        <div className="h-12 bg-gray-100 rounded-xl" />
                      </div>
                    ))
                  : universities.map((uni) => (
                      <div key={uni.id} className="p-4 border-b border-r border-gray-100 last:border-r-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-[#1a3a5c]/5 flex items-center justify-center mb-2">
                              {uni.logo_url ? (
                                <img src={uni.logo_url} alt={uni.name_en} className="w-8 h-8 object-contain" />
                              ) : (
                                <GraduationCap size={18} className="text-[#1a3a5c]" />
                              )}
                            </div>
                            <p className="font-bold text-[#1a3a5c] text-sm">{uni.name_ar}</p>
                            <p className="text-xs text-gray-400">{uni.name_en}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <MapPin size={10} />{uni.location_ar}
                            </p>
                          </div>
                          <button
                            onClick={() => remove(uni.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                {/* Add slot */}
                {universities.length < 3 && (
                  <Link
                    href="/universities"
                    className="p-4 border-b border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300 hover:text-[#d4a843] hover:bg-[#d4a843]/5 transition-colors"
                  >
                    <Plus size={20} />
                    <span className="text-xs font-cairo">أضف جامعة</span>
                  </Link>
                )}
              </div>

              {/* Comparison rows */}
              {rows.map((row, idx) => (
                <div
                  key={row.key}
                  className="grid font-cairo"
                  style={{ gridTemplateColumns: `200px repeat(${universities.length}, 1fr)` }}
                >
                  {/* Row label */}
                  <div className={`p-4 border-r border-gray-100 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <p className="text-xs font-semibold text-[#1a3a5c]">{row.label_ar}</p>
                    <p className="text-[10px] text-gray-400">{row.label_en}</p>
                  </div>

                  {/* Values */}
                  {universities.map((uni) => (
                    <div
                      key={uni.id}
                      className={`p-4 border-r border-gray-100 last:border-r-0 ${idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                    >
                      <p className={`text-sm font-semibold ${row.key === "tuition_min" ? "text-[#d4a843]" : "text-[#1a3a5c]"}`}>
                        {formatValue(row.key, uni[row.key as keyof University])}
                      </p>
                    </div>
                  ))}
                  {universities.length < 3 && <div className={`p-4 ${idx % 2 === 0 ? "bg-gray-50/30" : ""}`} />}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
