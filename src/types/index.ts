// ─── University ──────────────────────────────────────────────────
export type UniversityType = "public" | "private" | "international";
export type UniversitySystem = "egyptian" | "american" | "british" | "french";

export interface University {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  type: UniversityType;
  system: UniversitySystem;
  location_ar: string;
  location_en: string;
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
  created_at: string;
}

// ─── Major / Faculty ─────────────────────────────────────────────
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
  required_tracks?: string[]; // e.g. ["science", "math"]
  created_at: string;
}

// ─── University Major (join) ──────────────────────────────────────
export interface UniversityMajor {
  id: string;
  university_id: string;
  major_id: string;
  university?: University;
  major?: Major;
  tuition_per_year?: number;
  currency?: string;
  min_score?: number;           // تنسيق score
  available_seats?: number;
  language: "arabic" | "english" | "bilingual";
  admission_requirements?: string[];
  created_at: string;
}

// ─── Student Profile ──────────────────────────────────────────────
export type StudentTrack = "science" | "math" | "arts" | "ig" | "american" | "french";

export interface StudentProfile {
  id: string;
  user_id: string;
  name_ar?: string;
  name_en?: string;
  track: StudentTrack;
  score?: number;              // Thanaweya Amma score %
  graduation_year?: number;
  governorate?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_language?: "arabic" | "english" | "bilingual";
  interests?: MajorCategory[];
  shortlist?: string[];        // university_major IDs
  created_at: string;
  updated_at: string;
}

// ─── Comparison ───────────────────────────────────────────────────
export interface ComparisonItem {
  university: University;
  major?: Major;
  universityMajor?: UniversityMajor;
}

// ─── Search & Filter ─────────────────────────────────────────────
export interface UniversityFilters {
  type?: UniversityType[];
  location?: string[];
  tuition_max?: number;
  tracks?: StudentTrack[];
  search?: string;
}

export interface MajorFilters {
  category?: MajorCategory[];
  language?: string[];
  tuition_max?: number;
  min_score?: number;
  search?: string;
}

// ─── API Response ─────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}
