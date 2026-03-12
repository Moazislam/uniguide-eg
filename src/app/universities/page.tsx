import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UniversityCard from "@/components/universities/UniversityCard";
import UniversitySearchBar from "@/components/universities/UniversitySearchBar";
import { getUniversities } from "@/lib/universities";
import type { UniversityFilters, UniversityType } from "@/types";
import { Suspense } from "react";

interface SearchParams {
  search?: string;
  type?: string;
  page?: string;
}

async function UniversitiesGrid({ searchParams }: { searchParams: SearchParams }) {
  const filters: UniversityFilters = {
    search: searchParams.search,
    type: searchParams.type ? [searchParams.type as UniversityType] : undefined,
  };
  const page = parseInt(searchParams.page ?? "1");

  const { data: universities, count } = await getUniversities(filters, page, 12);

  if (!universities.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 font-cairo text-sm">لا توجد نتائج / No results found</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500 font-cairo mb-4">
        {count} جامعة / {count} universities found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {universities.map((uni) => (
          <UniversityCard key={uni.id} university={uni} />
        ))}
      </div>

      {/* Pagination */}
      {count > 12 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(count / 12) }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}${searchParams.search ? `&search=${searchParams.search}` : ""}${searchParams.type ? `&type=${searchParams.type}` : ""}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-cairo ${
                p === page
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#d4a843]"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#1a3a5c] font-cairo">
            الجامعات المصرية
          </h1>
          <p className="text-gray-500 font-cairo text-sm">Egyptian Universities — حكومية وخاصة ودولية</p>
        </div>

        <div className="mb-6">
          <Suspense>
            <UniversitySearchBar />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          }
        >
          <UniversitiesGrid searchParams={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
