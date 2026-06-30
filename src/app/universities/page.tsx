import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CompareTray } from "@/components/compare/CompareButton";
import UniversityCard from "@/components/universities/UniversityCard";
import UniversitySearchBar from "@/components/universities/UniversitySearchBar";
import { LocalizedHeading, LocalizedParagraph, LocalizedText } from "@/components/layout/LocalizedText";
import { GraduationCap, Search, Sparkles, SlidersHorizontal } from "lucide-react";
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
        <div className="text-center py-20 bg-card-bg/50 rounded-[32px] border border-dashed border-border mt-8">
          <div className="w-16 h-16 rounded-2xl bg-card-bg border border-border flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-text-secondary" />
          </div>
          <p className="text-lg font-bold text-text-primary font-cairo mb-2">
            <LocalizedText tKey="uni.noMatch" />
          </p>
          <p className="text-sm text-text-secondary font-cairo max-w-md mx-auto mb-6">
            <LocalizedText tKey="uni.noMatchDesc" />
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-blue dark:bg-amber text-white dark:text-blue-dark text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-light dark:hover:bg-amber-dark transition-colors font-cairo"
          >
            <SlidersHorizontal size={14} />
            <LocalizedText tKey="uni.editProfile" />
          </Link>
        </div>
      );
    }

    return (
      <>
        {/* Matching mode summary banner */}
        <div className="rounded-2xl bg-gradient-to-l from-amber/10 to-amber/5 border border-amber/20 dark:border-amber/10 p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-amber-dark dark:text-amber" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary font-cairo">
                {recommendations.length} <LocalizedText tKey="uni.matchesCount" />
              </p>
              <p className="text-xs text-text-secondary font-cairo">
                <LocalizedText tKey="uni.matchesDesc" />
              </p>
            </div>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-dark dark:text-amber hover:text-amber transition-colors font-cairo"
          >
            <SlidersHorizontal size={12} />
            <LocalizedText tKey="uni.editProfileSmall" />
          </Link>
        </div>

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

  // === Browse mode ===
  const filters: UniversityFilters = {
    search: searchParams.search,
    type: searchParams.type ? [searchParams.type as UniversityType] : undefined,
    track: searchParams.track,
  };
  const page = Number.parseInt(searchParams.page ?? "1", 10);
  const { data: universities, count } = await getUniversities(filters, page, 12);

  if (!universities.length) {
    return (
      <div className="text-center py-20 bg-card-bg/50 rounded-[32px] border border-dashed border-border mt-8">
        <div className="w-16 h-16 rounded-2xl bg-card-bg border border-border flex items-center justify-center mx-auto mb-4">
          <GraduationCap size={28} className="text-text-secondary" />
        </div>
        <p className="text-lg font-bold text-text-primary font-cairo mb-2">
          <LocalizedText tKey="uni.noResults" />
        </p>
        <p className="text-sm text-text-secondary font-cairo mb-6">
          <LocalizedText tKey="uni.noResultsDesc" />
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(count / 12);

  return (
    <>
      <p className="text-sm text-text-secondary font-cairo mb-5">
        {count} <LocalizedText tKey="uni.universities" />
        {searchParams.search && <span className="text-text-secondary/70"> — <LocalizedText tKey="uni.searchFor" /> &quot;{searchParams.search}&quot;</span>}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {universities.map((university) => (
          <UniversityCard key={university.id} university={university} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-10">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => {
            const params = new URLSearchParams();
            if (searchParams.search) params.set("search", searchParams.search);
            if (searchParams.type) params.set("type", searchParams.type);
            if (searchParams.track) params.set("track", searchParams.track);
            params.set("page", String(p));

            return (
              <Link
                key={p}
                href={`/universities?${params.toString()}`}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold font-cairo transition-all duration-200 ${
                  p === page
                    ? "bg-blue dark:bg-amber text-white dark:text-blue-dark shadow-sm"
                    : "bg-card-bg border-2 border-border text-text-secondary hover:border-amber/40 hover:text-text-primary hover:shadow-sm"
                }`}
              >
                {p}
              </Link>
            );
          })}
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
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Hero header */}
        <div className="relative overflow-hidden border-b border-border bg-card-bg/30">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(212,168,67,0.06),transparent_60%)]" />
            <div className="absolute left-[-80px] top-0 h-48 w-48 rounded-full bg-amber/10 blur-3xl" />
            <div className="absolute right-[-60px] top-5 h-56 w-56 rounded-full bg-blue/5 dark:bg-blue-light/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-card-bg backdrop-blur border border-border px-4 py-1.5 text-xs font-semibold text-text-primary mb-4">
                  {matchingMode ? (
                    <>
                      <Sparkles size={12} className="text-amber" />
                      <LocalizedText tKey="uni.personalizedTag" />
                    </>
                  ) : (
                    <>
                      <GraduationCap size={12} className="text-blue dark:text-amber" />
                      <LocalizedText tKey="uni.browseTag" />
                    </>
                  )}
                </div>
                <LocalizedHeading 
                  tKey={matchingMode ? "uni.matchTitle" : "uni.title"} 
                  className="text-3xl font-black text-text-primary font-cairo" 
                />
                <LocalizedParagraph 
                  tKey={matchingMode ? "uni.matchSubtitle" : "uni.subtitle"} 
                  className="text-text-secondary font-cairo text-sm mt-3 max-w-xl" 
                />
              </div>

              {!matchingMode && (
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 bg-blue dark:bg-amber text-white dark:text-blue-dark text-sm font-bold px-5 py-3 rounded-xl hover:bg-blue-light dark:hover:bg-amber-dark transition-colors font-cairo shadow-sm"
                >
                  <Sparkles size={14} />
                  <LocalizedText tKey="uni.tryMatch" />
                </Link>
              )}
            </div>

            <Suspense>
              <UniversitySearchBar />
            </Suspense>
          </div>
        </div>

        {/* Content area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-72 bg-card-bg/50 border border-border rounded-[20px] animate-pulse" />
                ))}
              </div>
            }
          >
            <UniversitiesGrid searchParams={params} />
          </Suspense>
        </div>
      </main>

      <CompareTray />
      <Footer />
    </div>
  );
}
