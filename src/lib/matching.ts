import { createClient } from "@/lib/supabase/server";
import type {
  Major,
  MajorCategory,
  MatchBreakdown,
  MatchMajorRecommendation,
  MatchProfile,
  MatchRecommendation,
  MobilityPreference,
  StudentTrack,
  StudyLanguage,
  University,
  UniversityMajor,
  UniversitySystem,
  UniversityType,
} from "@/types";

const WEIGHTS = {
  track: 16,
  score: 22,
  interests: 22,
  budget: 12,
  location: 12,
  language: 6,
  type: 4,
  system: 3,
  ranking: 3,
} satisfies MatchBreakdown;

const RELATED_INTERESTS: Partial<Record<MajorCategory, MajorCategory[]>> = {
  medicine: ["pharmacy", "science"],
  pharmacy: ["medicine", "science"],
  engineering: ["architecture", "computer_science", "science"],
  computer_science: ["engineering", "science", "business"],
  architecture: ["engineering", "arts"],
  business: ["law", "computer_science", "media"],
  media: ["arts", "business", "law"],
  law: ["business", "arts", "media"],
  science: ["medicine", "pharmacy", "computer_science", "engineering"],
  arts: ["media", "architecture", "law"],
};

const METRO_AREAS: Record<string, string> = {
  cairo: "greater-cairo",
  "new cairo": "greater-cairo",
  giza: "greater-cairo",
  "sheikh zayed": "greater-cairo",
  alexandria: "alexandria",
};

type JoinedUniversityMajor = UniversityMajor & { university: University; major: Major };

function normalizeValue(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function parseBudgetRange(budget?: string): { min?: number; max?: number } {
  if (!budget) return {};
  if (budget.endsWith("+")) {
    return { min: Number.parseInt(budget.replace("+", ""), 10) || undefined };
  }

  const [min, max] = budget.split("-").map((value) => Number.parseInt(value, 10));
  return {
    min: Number.isFinite(min) ? min : undefined,
    max: Number.isFinite(max) ? max : undefined,
  };
}

function getCompatibleTracks(track?: StudentTrack): StudentTrack[] {
  if (!track) return [];
  if (track === "ig" || track === "american" || track === "french") {
    return ["science", "math", "arts"];
  }
  return [track];
}

function getMetroArea(value?: string) {
  const normalized = normalizeValue(value);
  return METRO_AREAS[normalized] ?? normalized;
}

function getTrackScore(track: StudentTrack | undefined, major: Major) {
  if (!major.required_tracks?.length || !track) {
    return {
      score: Math.round(WEIGHTS.track * 0.55),
      reason: "Track compatibility is estimated because the requirement data is incomplete",
    };
  }

  const compatibleTracks = getCompatibleTracks(track);
  const matches = major.required_tracks.some((requiredTrack) =>
    compatibleTracks.includes(requiredTrack as StudentTrack)
  );

  if (matches) {
    return {
      score: WEIGHTS.track,
      reason: compatibleTracks.length > 1
        ? "Your academic system can map into this major"
        : "Your track fits this major directly",
    };
  }

  return { score: 0, reason: "Your current track is not a strong fit for this major" };
}

function getScoreScore(score: number | undefined, minScore: number | undefined) {
  if (score == null || minScore == null) {
    return {
      score: Math.round(WEIGHTS.score * 0.5),
      reason: "Score fit is estimated because cutoff data is incomplete",
    };
  }

  const gap = score - minScore;
  if (gap >= 8) {
    return { score: WEIGHTS.score, reason: "Your score is safely above the expected cutoff" };
  }
  if (gap >= 0) {
    return {
      score: Math.round(WEIGHTS.score * (0.7 + (gap / 8) * 0.3)),
      reason: "Your score clears the expected cutoff",
    };
  }
  if (gap >= -4) {
    return {
      score: Math.round(WEIGHTS.score * (0.25 + ((gap + 4) / 4) * 0.35)),
      reason: "Your score is close to the expected cutoff",
    };
  }

  return { score: 0, reason: "This major is likely too competitive for the current score" };
}

function getInterestScore(interests: MajorCategory[] | undefined, majorCategory: MajorCategory) {
  if (!interests?.length) {
    return {
      score: Math.round(WEIGHTS.interests * 0.3),
      reason: "Add academic interests to sharpen the personalization",
    };
  }

  if (interests.includes(majorCategory)) {
    return { score: WEIGHTS.interests, reason: "This major directly matches the student's interests" };
  }

  if (interests.some((interest) => RELATED_INTERESTS[interest]?.includes(majorCategory))) {
    return { score: Math.round(WEIGHTS.interests * 0.55), reason: "This major is adjacent to the student's interests" };
  }

  return { score: Math.round(WEIGHTS.interests * 0.1), reason: "This major is outside the student's main interests" };
}

function getBudgetScore(budget: string | undefined, tuition: number | undefined) {
  if (!budget || tuition == null) {
    return {
      score: Math.round(WEIGHTS.budget * 0.5),
      reason: "Budget fit is estimated from incomplete tuition data",
    };
  }

  const { min, max } = parseBudgetRange(budget);
  if (max != null && tuition <= max) {
    return { score: WEIGHTS.budget, reason: "Tuition fits the student's budget range" };
  }
  if (min != null && max == null && tuition >= min) {
    return { score: WEIGHTS.budget, reason: "Tuition fits the student's open-ended budget range" };
  }
  if (max != null && tuition <= max * 1.15) {
    return { score: Math.round(WEIGHTS.budget * 0.45), reason: "Tuition is slightly above the student's budget" };
  }

  return { score: 0, reason: "Tuition is outside the student's budget target" };
}

function getLocationScore(
  preferredLocation: string | undefined,
  mobilityPreference: MobilityPreference | undefined,
  university: University
) {
  if (!preferredLocation) {
    return {
      score: Math.round(WEIGHTS.location * 0.5),
      reason: "Location fit is neutral because no preferred area was selected",
    };
  }

  const studentLocation = normalizeValue(preferredLocation);
  const universityLocation = normalizeValue(university.governorate ?? university.location_en);
  if (studentLocation === universityLocation) {
    return { score: WEIGHTS.location, reason: "This university is in the student's preferred area" };
  }

  const sameMetroArea = getMetroArea(studentLocation) === getMetroArea(universityLocation);
  if (sameMetroArea) {
    return {
      score: mobilityPreference === "same_city" ? Math.round(WEIGHTS.location * 0.45) : Math.round(WEIGHTS.location * 0.75),
      reason: "This university is in a nearby metro area",
    };
  }

  if (mobilityPreference === "anywhere") {
    return { score: Math.round(WEIGHTS.location * 0.6), reason: "The student is open to relocating for the right fit" };
  }
  if (mobilityPreference === "nearby") {
    return { score: Math.round(WEIGHTS.location * 0.2), reason: "This option is farther than the student's preferred area" };
  }

  return { score: 0, reason: "This location is outside the student's preferred study area" };
}

function getLanguageScore(preferredLanguage: StudyLanguage | undefined, majorLanguage: StudyLanguage) {
  if (!preferredLanguage) {
    return { score: Math.round(WEIGHTS.language * 0.5), reason: "Language preference was not specified" };
  }
  if (preferredLanguage === majorLanguage) {
    return { score: WEIGHTS.language, reason: "Program language matches the student's preference" };
  }
  if (preferredLanguage === "bilingual" || majorLanguage === "bilingual") {
    return { score: Math.round(WEIGHTS.language * 0.7), reason: "Program language is still flexible for the student" };
  }
  return { score: 0, reason: "Program language does not match the student's preference" };
}

function getTypeScore(preferredType: UniversityType | undefined, universityType: UniversityType) {
  if (!preferredType) {
    return { score: Math.round(WEIGHTS.type * 0.5) };
  }
  return preferredType === universityType
    ? { score: WEIGHTS.type, reason: "University type fits the student's preference" }
    : { score: 0, reason: "University type is outside the student's preference" };
}

function getSystemScore(preferredSystem: UniversitySystem | undefined, system: UniversitySystem) {
  if (!preferredSystem) {
    return { score: Math.round(WEIGHTS.system * 0.5) };
  }
  return preferredSystem === system
    ? { score: WEIGHTS.system, reason: "University system fits the student's preference" }
    : { score: 0, reason: "University system differs from the student's preference" };
}

function getRankingScore(rankingEgypt: number | undefined) {
  if (!rankingEgypt) {
    return { score: Math.round(WEIGHTS.ranking * 0.4) };
  }
  if (rankingEgypt <= 3) {
    return { score: WEIGHTS.ranking, reason: "Strong national ranking adds confidence" };
  }
  if (rankingEgypt <= 8) {
    return { score: Math.round(WEIGHTS.ranking * 0.7), reason: "Solid national ranking" };
  }
  return { score: 1 };
}

function hardReject(profile: MatchProfile, row: JoinedUniversityMajor) {
  const compatibleTracks = getCompatibleTracks(profile.track);
  
  // 1. Explicit Track Compatibility (Database-driven)
  if (
    profile.track &&
    row.major.required_tracks?.length &&
    !row.major.required_tracks.some((requiredTrack) => compatibleTracks.includes(requiredTrack as StudentTrack))
  ) {
    return true;
  }

  // 2. Hard Egyptian Eligibility Constraints (Fallback/Explicit)
  // Math track students (national) cannot enter medical fields
  if (profile.track === "math") {
    const medicalCategories: MajorCategory[] = ["medicine", "pharmacy", "dentistry", "vet"];
    if (medicalCategories.includes(row.major.category)) return true;
  }

  // Science or Arts track students (national) cannot enter Engineering
  if (profile.track === "science" || profile.track === "arts") {
    if (row.major.category === "engineering") return true;
  }

  // Arts track students (national) cannot enter most scientific fields
  if (profile.track === "arts") {
    const scientificCategories: MajorCategory[] = ["medicine", "pharmacy", "dentistry", "vet", "science", "engineering"];
    if (scientificCategories.includes(row.major.category)) return true;
  }

  // 3. Score Thresholds (Strict rejection if way below cutoff)
  if (profile.score != null && row.min_score != null && profile.score < row.min_score - 7) {
    return true;
  }

  // 4. Budget constraints (Rejection if way over budget)
  const { max } = parseBudgetRange(profile.budget);
  const tuition = row.tuition_per_year ?? row.university.tuition_min;
  if (max != null && tuition != null && tuition > max * 1.35) {
    return true;
  }

  // 5. Location/Mobility
  if (
    profile.preferredLocation &&
    profile.mobilityPreference === "same_city" &&
    normalizeValue(profile.preferredLocation) !== normalizeValue(row.university.governorate ?? row.university.location_en)
  ) {
    return true;
  }

  return false;
}

function uniqReasons(reasons: string[]) {
  return Array.from(new Set(reasons)).slice(0, 4);
}

function buildMajorRecommendation(profile: MatchProfile, row: JoinedUniversityMajor): MatchMajorRecommendation {
  const track = getTrackScore(profile.track, row.major);
  const score = getScoreScore(profile.score, row.min_score);
  const interests = getInterestScore(profile.interests, row.major.category);
  const budget = getBudgetScore(profile.budget, row.tuition_per_year ?? row.university.tuition_min);
  const location = getLocationScore(profile.preferredLocation, profile.mobilityPreference, row.university);
  const language = getLanguageScore(profile.preferredLanguage, row.language);
  const type = getTypeScore(profile.preferredType, row.university.type);
  const system = getSystemScore(profile.preferredSystem, row.university.system);
  const ranking = getRankingScore(row.university.ranking_egypt);

  const breakdown: MatchBreakdown = {
    track: track.score,
    score: score.score,
    interests: interests.score,
    budget: budget.score,
    location: location.score,
    language: language.score,
    type: type.score,
    system: system.score,
    ranking: ranking.score,
  };

  const matchScore = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    major: row.major,
    universityMajor: row,
    matchScore: Math.max(0, Math.min(100, matchScore)),
    reasons: uniqReasons([
      interests.reason ?? "",
      score.reason ?? "",
      budget.reason ?? "",
      location.reason ?? "",
      language.reason ?? "",
      track.reason ?? "",
      type.reason ?? "",
      system.reason ?? "",
      ranking.reason ?? "",
    ].filter(Boolean)),
    breakdown,
  };
}

function aggregateUniversityRecommendation(university: University, majorMatches: MatchMajorRecommendation[]): MatchRecommendation {
  const topMajors = [...majorMatches]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const [first = 0, second = 0, third = 0] = topMajors.map((item) => item.matchScore);
  const overallScore = Math.round(first * 0.65 + second * 0.25 + third * 0.1);

  return {
    university,
    overallScore,
    topMajors,
    matchedMajorsCount: majorMatches.length,
    reasons: uniqReasons(topMajors.flatMap((match) => match.reasons)),
  };
}

export async function getMatchRecommendations(
  profile: MatchProfile,
  limit = 12
): Promise<MatchRecommendation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("university_majors")
    .select("*, university:universities(*), major:majors(*)");

  if (error) throw error;

  const searchTerm = normalizeValue(profile.search);
  const rows = ((data ?? []) as JoinedUniversityMajor[])
    .filter((row) => Boolean(row.university) && Boolean(row.major))
    .filter((row) => !profile.preferredType || row.university.type === profile.preferredType)
    .filter((row) => !profile.preferredSystem || row.university.system === profile.preferredSystem)
    .filter((row) => {
      if (!searchTerm) return true;
      return [row.university.name_ar, row.university.name_en, row.major.name_ar, row.major.name_en]
        .filter(Boolean)
        .some((value) => normalizeValue(value).includes(searchTerm));
    })
    .filter((row) => !hardReject(profile, row));

  const grouped = new Map<string, { university: University; matches: MatchMajorRecommendation[] }>();

  for (const row of rows) {
    const majorRecommendation = buildMajorRecommendation(profile, row);
    const existing = grouped.get(row.university.id);
    if (existing) {
      existing.matches.push(majorRecommendation);
      continue;
    }
    grouped.set(row.university.id, {
      university: row.university,
      matches: [majorRecommendation],
    });
  }

  return Array.from(grouped.values())
    .map(({ university, matches }) => aggregateUniversityRecommendation(university, matches))
    .sort((a, b) => {
      if (b.overallScore !== a.overallScore) return b.overallScore - a.overallScore;
      return (a.university.ranking_egypt ?? Number.MAX_SAFE_INTEGER) - (b.university.ranking_egypt ?? Number.MAX_SAFE_INTEGER);
    })
    .slice(0, limit);
}

export function parseInterests(value?: string): MajorCategory[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) as MajorCategory[];
}

export function normalizeTrack(value?: string): StudentTrack | undefined {
  if (
    value === "science" ||
    value === "math" ||
    value === "arts" ||
    value === "ig" ||
    value === "american" ||
    value === "french"
  ) {
    return value;
  }
  return undefined;
}

export function normalizeMobilityPreference(value?: string): MobilityPreference | undefined {
  if (value === "same_city" || value === "nearby" || value === "anywhere") {
    return value;
  }
  return undefined;
}

export function normalizeStudyLanguage(value?: string): StudyLanguage | undefined {
  if (value === "arabic" || value === "english" || value === "bilingual") {
    return value;
  }
  return undefined;
}

export function normalizeMatchType(value?: string): UniversityType | undefined {
  if (value === "public" || value === "private" || value === "international") {
    return value;
  }
  return undefined;
}

export function normalizeUniversitySystem(value?: string): UniversitySystem | undefined {
  if (value === "egyptian" || value === "american" || value === "british" || value === "french") {
    return value;
  }
  return undefined;
}
