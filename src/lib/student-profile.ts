import type { MatchProfile, StudentProfile } from "@/types";

export interface StudentProfileInput {
  track?: string;
  score?: string;
  budget?: string;
  interests?: string[];
  preferredLocation?: string;
  mobilityPreference?: string;
  preferredLanguage?: string;
  preferredType?: string;
  preferredSystem?: string;
}

export function parseBudgetRange(budget?: string): { min: number | null; max: number | null } {
  if (!budget) return { min: null, max: null };
  if (budget.endsWith("+")) {
    return {
      min: Number.parseInt(budget.replace("+", ""), 10) || null,
      max: null,
    };
  }

  const [min, max] = budget.split("-").map((value) => Number.parseInt(value, 10));
  return {
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
  };
}

export function serializeBudgetRange(profile?: Pick<StudentProfile, "budget_min" | "budget_max"> | null) {
  if (!profile) return "";
  if (profile.budget_min != null && profile.budget_max != null) {
    return `${profile.budget_min}-${profile.budget_max}`;
  }
  if (profile.budget_min != null && profile.budget_max == null) {
    return `${profile.budget_min}+`;
  }
  return "";
}

export function buildStudentProfilePayload(input: StudentProfileInput) {
  const budget = parseBudgetRange(input.budget);

  return {
    track: input.track || null,
    score: input.score ? Number.parseFloat(input.score) : null,
    budget_min: budget.min,
    budget_max: budget.max,
    interests: input.interests?.length ? input.interests : null,
    city: input.preferredLocation || null,
    preferred_locations: input.preferredLocation ? [input.preferredLocation] : null,
    mobility_preference: input.mobilityPreference || null,
    preferred_language: input.preferredLanguage || null,
    preferred_university_types: input.preferredType ? [input.preferredType] : null,
    preferred_systems: input.preferredSystem ? [input.preferredSystem] : null,
    updated_at: new Date().toISOString(),
  };
}

export function hydrateFormFromProfile(profile?: Partial<StudentProfile> | null) {
  return {
    track: profile?.track ?? "",
    score: profile?.score != null ? String(profile.score) : "",
    interests: profile?.interests ?? [],
    budget: serializeBudgetRange(profile as Pick<StudentProfile, "budget_min" | "budget_max">),
    preferredLocation: profile?.preferred_locations?.[0] ?? profile?.city ?? "",
    mobilityPreference: profile?.mobility_preference ?? "nearby",
    preferredLanguage: profile?.preferred_language ?? "",
    preferredType: profile?.preferred_university_types?.[0] ?? "",
    preferredSystem: profile?.preferred_systems?.[0] ?? "",
  };
}

export function buildRecommendationQuery(input: StudentProfileInput) {
  return new URLSearchParams({
    track: input.track ?? "",
    score: input.score ?? "",
    budget: input.budget ?? "",
    interests: input.interests?.join(",") ?? "",
    location: input.preferredLocation ?? "",
    mobility: input.mobilityPreference ?? "",
    language: input.preferredLanguage ?? "",
    universityType: input.preferredType ?? "",
    system: input.preferredSystem ?? "",
  }).toString();
}

export function buildMatchProfileFromStudentProfile(profile?: Partial<StudentProfile> | null): MatchProfile {
  return {
    track: profile?.track,
    score: profile?.score ?? undefined,
    budget: serializeBudgetRange(profile as Pick<StudentProfile, "budget_min" | "budget_max">),
    interests: profile?.interests ?? [],
    preferredLocation: profile?.preferred_locations?.[0] ?? profile?.city ?? undefined,
    mobilityPreference: profile?.mobility_preference ?? undefined,
    preferredLanguage: profile?.preferred_language ?? undefined,
    preferredType: profile?.preferred_university_types?.[0] ?? undefined,
    preferredSystem: profile?.preferred_systems?.[0] ?? undefined,
  };
}
