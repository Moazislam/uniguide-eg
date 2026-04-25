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
          <Loader2 size={16} className={`absolute top-1/2 ${isAr ? 'right-3' : 'left-3'} -translate-y-1/2 text-[#d4a843] animate-spin`} />
        ) : (
          <Search size={16} className={`absolute top-1/2 ${isAr ? 'right-3' : 'left-3'} -translate-y-1/2 text-gray-400`} />
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search.placeholder")}
          className={`w-full ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/10 bg-white font-cairo transition-all`}
          aria-label="Search universities"
        />
      </div>

      {/* Type filter */}
      <select
        value={type}
        onChange={(e) => { 
          setType(e.target.value); 
          updateParams("type", e.target.value); 
        }}
        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/10 bg-white font-cairo text-gray-600 transition-all cursor-pointer"
        aria-label="Filter by university type"
      >
        <option value="">{isAr ? "الكل" : "All Types"}</option>
        <option value="public">{isAr ? "حكومية" : "Public"}</option>
        <option value="private">{isAr ? "خاصة" : "Private"}</option>
        <option value="international">{isAr ? "دولية" : "International"}</option>
      </select>
    </div>
  );
}
