import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getMajors } from "@/lib/majors";
import Link from "next/link";
import type { MajorCategory } from "@/types";
import { BookOpen, Clock, ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import { LocalizedHeading, LocalizedParagraph } from "@/components/layout/LocalizedText";
import MajorCategoryFilters from "@/components/majors/MajorCategoryFilters";

const categoryLabels: Record<string, { ar: string; en: string; emoji: string }> = {
  medicine:        { ar: "طب",               en: "Medicine",         emoji: "🏥" },
  engineering:     { ar: "هندسة",            en: "Engineering",      emoji: "⚙️" },
  business:        { ar: "تجارة وإدارة",    en: "Business",         emoji: "💼" },
  computer_science:{ ar: "علوم حاسب",       en: "Computer Science", emoji: "💻" },
  arts:            { ar: "آداب وفنون",       en: "Arts",             emoji: "🎨" },
  science:         { ar: "علوم",             en: "Science",          emoji: "🔬" },
  law:             { ar: "حقوق",             en: "Law",              emoji: "⚖️" },
  pharmacy:        { ar: "صيدلة",            en: "Pharmacy",         emoji: "💊" },
  dentistry:       { ar: "طب أسنان",         en: "Dentistry",        emoji: "🦷" },
  architecture:    { ar: "عمارة",            en: "Architecture",     emoji: "🏛️" },
  media:           { ar: "إعلام",            en: "Media",            emoji: "📡" },
  education:       { ar: "تربية",            en: "Education",        emoji: "📚" },
  other:           { ar: "أخرى",             en: "Other",            emoji: "🎓" },
};

async function MajorsGrid({ category, search }: { category?: string; search?: string }) {
  const { data: majors, count } = await getMajors(
    {
      category: category ? [category as MajorCategory] : undefined,
      search,
    },
    1,
    50
  );

  return (
    <div>
      <p className="text-sm text-gray-500 font-cairo mb-4">{count} تخصص / {count} majors</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {majors.map((major) => {
          const cat = categoryLabels[major.category] ?? categoryLabels.other;
          return (
            <Link
              key={major.id}
              href={`/majors/${major.slug}`}
              className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-cairo">
                  {cat.ar}
                </span>
              </div>
              <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm group-hover:text-[#d4a843] transition-colors">
                {major.name_ar}
              </h3>
              <p className="text-xs text-gray-400 font-cairo mb-2">{major.name_en}</p>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500 font-cairo">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {major.duration_years} سنوات
                </span>
                {major.career_paths?.length ? (
                  <span className="flex items-center gap-1">
                    <BookOpen size={11} />
                    {major.career_paths.length} مسار مهني
                  </span>
                ) : null}
                <ChevronLeft size={12} className="mr-auto text-[#d4a843]" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function MajorsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <LocalizedHeading tKey="major.title" className="text-2xl font-black text-[#1a3a5c] font-cairo" />
          <LocalizedParagraph tKey="major.subtitle" className="text-gray-500 font-cairo text-sm" />
        </div>

        {/* Search + Category filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form method="GET" action="/majors" className="flex-1 relative">
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            <input
              type="search"
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="ابحث عن تخصص... / Search majors"
              className="w-full h-11 rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm font-cairo focus:border-[#d4a843] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d4a843]"
              aria-label="Search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>
        </div>

        <MajorCategoryFilters activeCategory={params.category} />

        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        }>
          <MajorsGrid category={params.category} search={params.search} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
