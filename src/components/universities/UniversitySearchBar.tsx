"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2, Search, X, Filter } from "lucide-react";
import { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const typeOptions = [
  { value: "", labelAr: "الكل", labelEn: "All Types" },
  { value: "public", labelAr: "حكومية", labelEn: "Public" },
  { value: "private", labelAr: "خاصة", labelEn: "Private" },
  { value: "international", labelAr: "دولية", labelEn: "International" },
];

export default function UniversitySearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t, language, isRtl } = useLanguage();
  const isAr = language === "ar";
  
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [track, setTrack] = useState(searchParams.get("track") ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page");
      
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  /* Debounced search — 350ms after the user stops typing */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const currentSearch = searchParams.get("search") ?? "";
      if (search !== currentSearch) {
        updateParams({ search });
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, searchParams, updateParams]);

  const hasActiveFilters = search || type || track;

  const clearAll = () => {
    setSearch("");
    setType("");
    setTrack("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("type");
    params.delete("track");
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      {/* Search row */}
      <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Search input with glassmorphism */}
        <div className={`relative flex-1 transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-[#d4a843]/30 shadow-[0_0_20px_rgba(212,168,67,0.1)]"
            : ""
        } rounded-2xl`}>
          {isPending ? (
            <Loader2 size={18} className={`absolute top-1/2 ${isRtl ? 'right-4' : 'left-4'} -translate-y-1/2 text-[#d4a843] animate-spin`} />
          ) : (
            <Search size={18} className={`absolute top-1/2 ${isRtl ? 'right-4' : 'left-4'} -translate-y-1/2 transition-colors duration-200 ${
              isFocused ? "text-[#d4a843]" : "text-gray-400"
            }`} />
          )}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t("search.placeholder")}
            className={`w-full ${isRtl ? 'pr-11 pl-11' : 'pl-11 pr-11'} py-3.5 text-sm border-2 border-border rounded-2xl focus:outline-none focus:border-[#d4a843] bg-card-bg/80 backdrop-blur-sm text-text-primary font-cairo placeholder:text-text-secondary/50 transition-all duration-200`}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); updateParams({ search: "" }); }}
              className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-border flex items-center justify-center text-text-secondary hover:bg-border/80 hover:text-text-primary transition-colors`}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Track filter */}
        <select
          value={track}
          onChange={(e) => { 
            setTrack(e.target.value); 
            updateParams({ track: e.target.value }); 
          }}
          className="px-4 py-3.5 text-sm border-2 border-border rounded-2xl focus:outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/10 bg-card-bg/80 backdrop-blur-sm font-cairo text-text-primary transition-all cursor-pointer"
          aria-label="Filter by academic track"
        >
          <option value="" className="bg-card-bg">{isAr ? "جميع الشهادات" : "All Tracks"}</option>
          <option value="national" className="bg-card-bg">{isAr ? "ثانوية عامة" : "Thanaweya"}</option>
          <option value="ig" className="bg-card-bg">{isAr ? "IGCSE" : "IG"}</option>
          <option value="american" className="bg-card-bg">{isAr ? "American" : "American"}</option>
          <option value="french" className="bg-card-bg">{isAr ? "French" : "French"}</option>
        </select>

        {/* Type filter pills */}
        <div className="flex items-center gap-1.5 bg-card-bg/80 backdrop-blur-sm border-2 border-border rounded-2xl p-1.5 overflow-x-auto scrollbar-hide">
          {typeOptions.map((option) => (
            <button
              key={option.value || "all"}
              onClick={() => { setType(option.value); updateParams({ type: option.value }); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-cairo transition-all duration-200 whitespace-nowrap ${
                type === option.value
                  ? "bg-blue dark:bg-amber text-white dark:text-blue-dark shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-border/50"
              }`}
            >
              {isAr ? option.labelAr : option.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters bar */}
      {hasActiveFilters && (
        <div className={`flex items-center gap-2 flex-wrap ${isRtl ? 'flex-row' : 'flex-row-reverse text-right'}`}>
          <Filter size={12} className="text-text-secondary" />
          {search && (
            <span className="inline-flex items-center gap-1.5 bg-blue/10 dark:bg-amber/10 text-blue dark:text-amber text-xs font-semibold px-3 py-1.5 rounded-full font-cairo">
              {isAr ? "بحث" : "Search"}: &quot;{search}&quot;
              <button onClick={() => { setSearch(""); updateParams({ search: "" }); }} className="hover:text-red-500 transition-colors">
                <X size={11} />
              </button>
            </span>
          )}
          {type && (
            <span className="inline-flex items-center gap-1.5 bg-amber/10 text-amber-dark dark:text-amber text-xs font-semibold px-3 py-1.5 rounded-full font-cairo">
              {isAr ? typeOptions.find((o) => o.value === type)?.labelAr : typeOptions.find((o) => o.value === type)?.labelEn}
              <button onClick={() => { setType(""); updateParams({ type: "" }); }} className="hover:text-red-500 transition-colors">
                <X size={11} />
              </button>
            </span>
          )}
          {track && (
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-semibold px-3 py-1.5 rounded-full font-cairo">
              {track}
              <button onClick={() => { setTrack(""); updateParams({ track: "" }); }} className="hover:text-red-500 transition-colors">
                <X size={11} />
              </button>
            </span>
          )}
          <button
            onClick={clearAll}
            className="text-xs text-text-secondary hover:text-red-500 font-cairo transition-colors"
          >
            {isAr ? "مسح الكل" : "Clear all"}
          </button>
        </div>
      )}
    </div>
  );
}
