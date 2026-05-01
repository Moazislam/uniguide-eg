"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { useState, useCallback, useEffect, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function UniversitySearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") ?? "")) {
        updateParams("search", search);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, searchParams, updateParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        {isPending ? (
          <Loader2 size={16} className={`absolute top-1/2 ${isAr ? 'right-3' : 'left-3'} -translate-y-1/2 text-amber animate-spin`} />
        ) : (
          <Search size={16} className={`absolute top-1/2 ${isAr ? 'right-3' : 'left-3'} -translate-y-1/2 text-text-secondary/60`} />
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search.placeholder")}
          className={`w-full ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/10 bg-card-bg text-text-primary font-cairo transition-all placeholder:text-text-secondary/50`}
          aria-label="Search universities"
        />
      </div>

      {/* Track filter */}
      <select
        value={searchParams.get("track") || ""}
        onChange={(e) => updateParams("track", e.target.value)}
        className="px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/10 bg-card-bg font-cairo text-text-primary transition-all cursor-pointer"
        aria-label="Filter by academic track"
      >
        <option value="" className="bg-card-bg">{isAr ? "جميع الشهادات" : "All Tracks"}</option>
        <option value="national" className="bg-card-bg">{isAr ? "ثانوية عامة" : "Thanaweya"}</option>
        <option value="ig" className="bg-card-bg">{isAr ? "IGCSE" : "IG"}</option>
        <option value="american" className="bg-card-bg">{isAr ? "American" : "American"}</option>
        <option value="french" className="bg-card-bg">{isAr ? "French" : "French"}</option>
      </select>

      {/* Type filter */}
      <select
        value={type}
        onChange={(e) => { 
          setType(e.target.value); 
          updateParams("type", e.target.value); 
        }}
        className="px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/10 bg-card-bg font-cairo text-text-primary transition-all cursor-pointer"
        aria-label="Filter by university type"
      >
        <option value="" className="bg-card-bg">{isAr ? "الكل" : "All Types"}</option>
        <option value="public" className="bg-card-bg">{isAr ? "حكومية" : "Public"}</option>
        <option value="private" className="bg-card-bg">{isAr ? "خاصة" : "Private"}</option>
        <option value="international" className="bg-card-bg">{isAr ? "دولية" : "International"}</option>
      </select>
    </div>
  );
}
