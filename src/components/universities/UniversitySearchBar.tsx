"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useCallback } from "react";

export default function UniversitySearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateParams("search", search)}
          placeholder="ابحث عن جامعة... / Search university..."
          className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-white font-cairo"
        />
      </div>

      {/* Type filter */}
      <select
        value={type}
        onChange={(e) => { setType(e.target.value); updateParams("type", e.target.value); }}
        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-white font-cairo text-gray-600"
      >
        <option value="">الكل / All Types</option>
        <option value="public">حكومية / Public</option>
        <option value="private">خاصة / Private</option>
        <option value="international">دولية / International</option>
      </select>

      <button
        onClick={() => updateParams("search", search)}
        className="px-5 py-2.5 bg-[#1a3a5c] text-white text-sm font-semibold rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo"
      >
        بحث
      </button>
    </div>
  );
}
