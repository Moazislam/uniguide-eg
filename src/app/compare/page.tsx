"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { University } from "@/types";
import { GitCompareArrows, MapPin, GraduationCap, Plus, Trash2, ArrowLeftRight, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const STORAGE_KEY = "uniguide_compare";

const rows = [
  { key: "type", label_ar: "النوع", label_en: "Type" },
  { key: "location_ar", label_ar: "الموقع", label_en: "Location" },
  { key: "founded_year", label_ar: "سنة التأسيس", label_en: "Founded" },
  { key: "faculties_count", label_ar: "عدد الكليات", label_en: "Faculties" },
  { key: "total_students", label_ar: "عدد الطلاب", label_en: "Students" },
  { key: "tuition_min", label_ar: "المصروفات (تبدأ من)", label_en: "Tuition (from)" },
  { key: "ranking_egypt", label_ar: "الترتيب في مصر", label_en: "Egypt Ranking" },
];

const typeLabels: Record<string, { ar: string; en: string }> = {
  public: { ar: "حكومية", en: "Public" },
  private: { ar: "خاصة", en: "Private" },
  international: { ar: "دولية", en: "International" },
};

function readCompareIds() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ComparePage() {
  const { t, isRtl, language } = useLanguage();
  const isAr = language === "ar";
  
  const [ids, setIds] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIds(readCompareIds());
  }, []);

  useEffect(() => {
    if (!ids.length) {
      setUniversities([]);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    supabase
      .from("universities")
      .select("*")
      .in("id", ids)
      .then(({ data }) => {
        const mapped = new Map(((data as University[]) ?? []).map((university) => [university.id, university]));
        const ordered = ids.map((id) => mapped.get(id)).filter(Boolean) as University[];
        setUniversities(ordered);
        setLoading(false);
      });
  }, [ids]);

  const remove = (id: string) => {
    const next = ids.filter((value) => value !== id);
    setIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("compare-updated", { detail: next }));
  };

  const clearAll = () => {
    setIds([]);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("compare-updated", { detail: [] }));
  };

  const gridTemplate = useMemo(
    () => `220px repeat(${Math.max(universities.length, 1)}, minmax(220px, 1fr))`,
    [universities.length]
  );

  function formatValue(key: string, value: unknown): string {
    if (value == null) return "—";
    if (key === "type") return isAr ? typeLabels[value as string]?.ar : typeLabels[value as string]?.en;
    if (key === "tuition_min") return `${Number(value).toLocaleString()} ${isAr ? "ج.م" : "EGP"}`;
    if (key === "total_students") return Number(value).toLocaleString();
    if (key === "ranking_egypt") return `#${value}`;
    return String(value);
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />

      <main className={`flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className={`mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <div className={`inline-flex items-center gap-2 rounded-full bg-blue/6 dark:bg-amber/10 px-4 py-1.5 text-xs font-semibold text-blue dark:text-amber mb-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <ArrowLeftRight size={14} className="text-amber" />
              {t("compare.badge")}
            </div>
            <h1 className={`text-3xl font-black text-blue dark:text-text-primary font-cairo flex items-center gap-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <GitCompareArrows className="text-amber" />
              {t("compare.title")}
            </h1>
            <p className="text-text-secondary font-cairo text-sm mt-2">
              {t("compare.subtitle")}
            </p>
          </div>

          {ids.length > 0 && (
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <button
                onClick={clearAll}
                className={`inline-flex items-center gap-2 rounded-xl border border-border bg-card-bg px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-red-200 hover:text-red-500 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <Trash2 size={14} />
                {t("compare.clearAll")}
              </button>
              <Link
                href="/universities"
                className={`inline-flex items-center gap-2 rounded-xl bg-blue dark:bg-amber px-4 py-2.5 text-sm font-semibold text-white dark:text-blue-dark transition-colors hover:bg-blue-light dark:hover:bg-amber-dark ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <Plus size={14} />
                {t("compare.addUni")}
              </Link>
            </div>
          )}
        </div>

        {ids.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-border bg-card-bg/50 dark:bg-card-bg/20 py-20 text-center">
            <GitCompareArrows size={44} className="text-text-secondary/20 mx-auto mb-4" />
            <p className="font-bold text-blue dark:text-text-primary font-cairo mb-2">{t("compare.emptyTitle")}</p>
            <p className="text-sm text-text-secondary font-cairo mb-6">{t("compare.emptyDesc")}</p>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 bg-blue dark:bg-amber text-white dark:text-blue-dark text-sm font-semibold px-5 py-3 rounded-xl hover:bg-blue-light transition-colors font-cairo"
            >
              <Plus size={16} />
              {t("hero.ctaBrowse")}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {loading ? (
                ids.map(id => (
                  <div key={id} className="h-40 rounded-[28px] bg-card-bg border border-border animate-pulse" />
                ))
              ) : (
                universities.map(university => (
                  <div key={university.id} className="bg-card-bg rounded-[28px] border border-border p-6 shadow-sm overflow-hidden relative">
                    <div className={`flex items-start gap-4 mb-6 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="w-14 h-14 rounded-2xl bg-blue/5 dark:bg-amber/10 flex items-center justify-center shrink-0">
                        {university.logo_url ? (
                          <img src={university.logo_url} alt={isAr ? university.name_ar : university.name_en} className="w-10 h-10 object-contain" />
                        ) : (
                          <GraduationCap size={24} className="text-blue dark:text-amber" />
                        )}
                      </div>
                      <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                         <h3 className="font-black text-blue dark:text-text-primary font-cairo leading-tight">{isAr ? university.name_ar : university.name_en}</h3>
                         <p className="text-xs text-text-secondary font-cairo mt-1">{isAr ? university.name_en : university.name_ar}</p>
                      </div>
                      <button 
                        onClick={() => remove(university.id)}
                        className="text-text-secondary/30 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold font-cairo tracking-wider">{t("profile.location")}</p>
                        <p className="text-sm font-bold text-blue dark:text-white font-cairo mt-0.5">{isAr ? university.location_ar : university.location_en}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold font-cairo tracking-wider">{t("profile.type")}</p>
                        <p className="text-sm font-bold text-blue dark:text-white font-cairo mt-0.5 capitalize">{university.type}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold font-cairo tracking-wider">{t("profile.system")}</p>
                        <p className="text-sm font-bold text-blue dark:text-white font-cairo mt-0.5 capitalize">{university.system}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold font-cairo tracking-wider">National Rank</p>
                        <p className="text-sm font-bold text-amber font-cairo mt-0.5">#{university.ranking_egypt || "—"}</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-border">
                        <p className="text-[10px] text-text-secondary uppercase font-bold font-cairo tracking-wider">{t("profile.budget")}</p>
                        <p className="text-base font-black text-emerald-600 font-cairo mt-0.5">
                          {university.tuition_min != null ? `${university.tuition_min.toLocaleString()} ${isAr ? "ج.م" : "EGP"}` : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-hidden rounded-[28px] border border-border bg-card-bg shadow-sm">
              <div className="border-b border-border bg-cream dark:bg-blue-dark/50 px-5 py-4">
                <p className="text-sm font-semibold text-blue dark:text-amber font-cairo">
                  {t("compare.selected")} {ids.length} {ids.length === 1 ? t("compare.uni") : t("compare.unis")}
                </p>
              </div>

              <div className="overflow-x-auto">
                <div className={`grid md:min-w-[760px] font-cairo ${isRtl ? 'dir-rtl' : 'dir-ltr'}`} style={{ gridTemplateColumns: gridTemplate }}>
                <div className={`p-5 border-b ${isRtl ? 'border-l' : 'border-r'} border-border bg-card-bg`} />
                {loading
                  ? ids.map((id) => (
                      <div key={id} className={`p-5 border-b ${isRtl ? 'border-l' : 'border-r'} border-border last:border-r-0 last:border-l-0`}>
                        <div className="h-20 rounded-2xl bg-cream dark:bg-blue/10 animate-pulse" />
                      </div>
                    ))
                  : universities.map((university) => (
                      <div key={university.id} className={`p-5 border-b ${isRtl ? 'border-l' : 'border-r'} border-border last:border-r-0 last:border-l-0 bg-card-bg`}>
                        <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div className={isRtl ? 'text-right' : 'text-left'}>
                            <div className="w-11 h-11 rounded-2xl bg-blue/5 dark:bg-amber/10 flex items-center justify-center mb-3 overflow-hidden">
                              {university.logo_url ? (
                                <img src={university.logo_url} alt={isAr ? university.name_ar : university.name_en} className="w-9 h-9 object-contain" />
                              ) : (
                                <GraduationCap size={18} className="text-blue dark:text-amber" />
                              )}
                            </div>
                            <p className="font-bold text-blue dark:text-text-primary text-sm">{isAr ? university.name_ar : university.name_en}</p>
                            <p className="text-xs text-text-secondary">{isAr ? university.name_en : university.name_ar}</p>
                            <p className="text-xs text-text-secondary flex items-center gap-1 mt-2">
                              <MapPin size={10} />
                              {isAr ? university.location_ar : university.location_en}
                            </p>
                          </div>
                          <button
                            onClick={() => remove(university.id)}
                            className="rounded-full p-1 text-text-secondary/50 transition-colors hover:bg-red-50 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                {rows.map((row, index) => (
                  <div
                    key={row.key}
                    className="contents"
                  >
                    <div className={`p-4 ${isRtl ? 'border-l' : 'border-r'} border-b border-border ${index % 2 === 0 ? "bg-cream dark:bg-blue-dark/30" : "bg-card-bg"} ${isRtl ? 'text-right' : 'text-left'}`}>
                      <p className="text-xs font-semibold text-blue dark:text-text-primary">{isAr ? row.label_ar : row.label_en}</p>
                      <p className="text-[10px] text-text-secondary">{isAr ? row.label_en : row.label_ar}</p>
                    </div>
                    {universities.map((university) => (
                      <div
                        key={`${row.key}-${university.id}`}
                        className={`p-4 ${isRtl ? 'border-l' : 'border-r'} border-b border-border last:border-r-0 last:border-l-0 ${index % 2 === 0 ? "bg-cream/50 dark:bg-blue-dark/20" : "bg-card-bg"} ${isRtl ? 'text-right' : 'text-left'}`}
                      >
                        <p className={`text-sm font-semibold ${row.key === "tuition_min" ? "text-amber" : "text-blue dark:text-text-primary"}`}>
                          {formatValue(row.key, university[row.key as keyof University])}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </main>

      <Footer />
    </div>
  );
}
