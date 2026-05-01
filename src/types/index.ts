export type UniversityType = "public" | "private" | "international";
export type UniversitySystem = "egyptian" | "american" | "british" | "french";
export type MajorCategory =
  | "medicine"
  | "engineering"
  | "business"
  | "arts"
  | "science"
  | "law"
  | "pharmacy"
  | "dentistry"
  | "vet"
  | "education"
  | "media"
  | "computer_science"
  | "architecture"
  | "other";
export type StudentTrack = "science" | "math" | "arts" | "ig" | "american" | "french";
export type StudyLanguage = "arabic" | "english" | "bilingual";
export type MobilityPreference = "same_city" | "nearby" | "anywhere";

export interface University {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  type: UniversityType;
  system: UniversitySystem;
  location_ar: string;
  location_en: string;
  governorate?: string;
  metro_area?: string;
  logo_url?: string;
  cover_url?: string;
  founded_year?: number;
  website?: string;
  description_ar?: string;
  description_en?: string;
  tuition_min?: number;
  tuition_max?: number;
  tuition_currency?: string;
  accreditations?: string[];
  total_students?: number;
  faculties_count?: number;
  ranking_egypt?: number;
  famous_for?: string[];
  admission_national?: string;
  admission_ig?: string;
  admission_american?: string;
  admission_french?: string;
  admission_german?: string;
  created_at: string;
}

export interface Major {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  category: MajorCategory;
  description_ar?: string;
  description_en?: string;
  duration_years: number;
  career_paths?: string[];
  required_tracks?: string[];
  created_at: string;
}

export interface UniversityMajor {
  id: string;
  university_id: string;
  major_id: string;
  university?: University;
  major?: Major;
  tuition_per_year?: number;
  currency?: string;
  min_score?: number;
  available_seats?: number;
  language: StudyLanguage;
  admission_requirements?: string[];
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name_ar?: string;
  name_en?: string;
  track: StudentTrack;
  score?: number;
  graduation_year?: number;
  city?: string;
  governorate?: string;
  home_governorate?: string;
  preferred_locations?: string[];
  mobility_preference?: MobilityPreference;
  budget_min?: number;
  budget_max?: number;
  preferred_language?: StudyLanguage;
  preferred_university_types?: UniversityType[];
  preferred_systems?: UniversitySystem[];
  interests?: MajorCategory[];
  shortlist?: string[];
  created_at: string;
  updated_at: string;
}

export interface MatchProfile {
  track?: StudentTrack;
  score?: number;
  budget?: string;
  interests?: MajorCategory[];
  search?: string;
  preferredLocation?: string;
  mobilityPreference?: MobilityPreference;
  preferredLanguage?: StudyLanguage;
  preferredType?: UniversityType;
  preferredSystem?: UniversitySystem;
}

export interface MatchBreakdown {
  track: number;
  score: number;
  interests: number;
  budget: number;
  location: number;
  language: number;
  type: number;
  system: number;
  ranking: number;
}

export interface MatchMajorRecommendation {
  major: Major;
  universityMajor: UniversityMajor;
  matchScore: number;
  reasons: string[];
  breakdown: MatchBreakdown;
}

export interface MatchRecommendation {
  university: University;
  overallScore: number;
  topMajors: MatchMajorRecommendation[];
  matchedMajorsCount: number;
  reasons: string[];
}

export interface ComparisonItem {
  university: University;
  major?: Major;
  universityMajor?: UniversityMajor;
}

export interface UniversityFilters {
  type?: UniversityType[];
  location?: string[];
  tuition_max?: number;
  tracks?: StudentTrack[];
  track?: string;
  min_score?: number;
  search?: string;
}

export interface MajorFilters {
  category?: MajorCategory[];
  language?: string[];
  tuition_max?: number;
  min_score?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

export type FacultyCategory =
  | "medicine" | "engineering" | "business" | "arts" | "science" | "law"
  | "pharmacy" | "dentistry" | "media" | "computer_science" | "architecture"
  | "education" | "agriculture" | "tourism" | "other";

export interface Faculty {
  id: string;
  university_id: string;
  name_ar: string;
  name_en: string;
  category: FacultyCategory;
  description_ar?: string;
  duration_years?: number;
  tuition_min?: number;
  currency?: string;
  language?: string;
  website?: string;
  admission_national?: string;
  admission_ig?: string;
  admission_american?: string;
  admission_other?: string;
  created_at: string;
}
