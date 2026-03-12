import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getMajors } from "@/lib/majors";
import Link from "next/link";
import type { MajorCategory } from "@/types";
import { BookOpen, Clock, ChevronLeft } from "lucide-react";
import { Suspense } from "react";

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
          <h1 className="text-2xl font-black text-[#1a3a5c] font-cairo">التخصصات</h1>
          <p className="text-gray-500 font-cairo text-sm">University Majors — استكشف كل التخصصات المتاحة</p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <a
            href="/majors"
            className={`text-xs font-semibold px-3 py-1.5 rounded-full font-cairo transition-colors ${
              !params.category ? "bg-[#1a3a5c] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#d4a843]"
            }`}
          >
            الكل / All
          </a>
          {Object.entries(categoryLabels).map(([key, val]) => (
            <a
              key={key}
              href={`/majors?category=${key}`}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full font-cairo transition-colors ${
                params.category === key
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#d4a843]"
              }`}
            >
              {val.emoji} {val.ar}
            </a>
          ))}
        </div>

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
