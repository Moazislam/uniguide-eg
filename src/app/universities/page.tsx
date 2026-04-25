import { Suspense } from "react";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CompareTray } from "@/components/compare/CompareButton";
import UniversityCard from "@/components/universities/UniversityCard";
import UniversitySearchBar from "@/components/universities/UniversitySearchBar";
import {
  getMatchRecommendations,
  normalizeMatchType,
  normalizeMobilityPreference,
  normalizeStudyLanguage,
  normalizeTrack,
  normalizeUniversitySystem,
  parseInterests,
} from "@/lib/matching";
import { getUniversities } from "@/lib/universities";
import type { MatchProfile, UniversityFilters, UniversityType } from "@/types";
import { LocalizedHeading, LocalizedParagraph } from "@/components/layout/LocalizedText";

export const metadata: Metadata = {
  title: "Egyptian Universities — UniGuide",
  description: "Browse and compare public, private, and international universities in Egypt.",
};

interface SearchParams {
  search?: string;
  type?: string;
  page?: string;
  track?: string;
  score?: string;
  budget?: string;
  interests?: string;
  location?: string;
  mobility?: string;
  language?: string;
  universityType?: string;
  system?: string;
}

function isMatchingMode(searchParams: SearchParams) {
  return Boolean(
    searchParams.track ||
    searchParams.score ||
    searchParams.budget ||
    searchParams.interests ||
    searchParams.location ||
    searchParams.language ||
    searchParams.universityType ||
    searchParams.system
  );
}

async function UniversitiesGrid({ searchParams }: { searchParams: SearchParams }) {
  if (isMatchingMode(searchParams)) {
    const profile: MatchProfile = {
      track: normalizeTrack(searchParams.track),
      score: searchParams.score ? Number.parseFloat(searchParams.score) : undefined,
      budget: searchParams.budget,
      interests: parseInterests(searchParams.interests),
      search: searchParams.search,
      preferredLocation: searchParams.location,
      mobilityPreference: normalizeMobilityPreference(searchParams.mobility),
      preferredLanguage: normalizeStudyLanguage(searchParams.language),
      preferredType: normalizeMatchType(searchParams.universityType ?? searchParams.type),
      preferredSystem: normalizeUniversitySystem(searchParams.system),
    };

    const recommendations = await getMatchRecommendations(profile, 12);

    if (!recommendations.length) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-500 font-cairo text-sm">
            No strong personalized matches were found
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {recommendations.map((recommendation) => (
            <UniversityCard
              key={recommendation.university.id}
              university={recommendation.university}
              recommendation={recommendation}
            />
          ))}
        </div>
      </>
    );
  }

  const filters: UniversityFilters = {
    search: searchParams.search,
    type: searchParams.type ? [searchParams.type as UniversityType] : undefined,
  };
  const page = Number.parseInt(searchParams.page ?? "1", 10);
  const { data: universities, count } = await getUniversities(filters, page, 12);

  if (!universities.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 font-cairo text-sm">No results found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {universities.map((university) => (
          <UniversityCard key={university.id} university={university} />
        ))}
      </div>

      {count > 12 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(count / 12) }, (_, index) => index + 1).map((p) => (
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
  const matchingMode = isMatchingMode(params);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <LocalizedHeading 
            tKey={matchingMode ? "uni.matchTitle" : "uni.title"} 
            className="text-2xl font-black text-[#1a3a5c] font-cairo" 
          />
          <LocalizedParagraph 
            tKey={matchingMode ? "uni.matchSubtitle" : "uni.subtitle"} 
            className="text-gray-500 font-cairo text-sm" 
          />
        </div>

        <div className="mb-6">
          <Suspense>
            <UniversitySearchBar />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          }
        >
          <UniversitiesGrid searchParams={params} />
        </Suspense>
      </main>

      <CompareTray />
      <Footer />
    </div>
  );
}
