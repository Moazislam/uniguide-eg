import { createClient } from "@/lib/supabase/server";
import { wrapSupabaseError } from "./errors";
import type { Major, UniversityMajor, MajorFilters, PaginatedResponse } from "@/types";

export async function getMajors(
  filters: MajorFilters = {},
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<Major>> {
  const supabase = await createClient();
  let query = supabase.from("majors").select("*", { count: "exact" });

  if (filters.category?.length) {
    query = query.in("category", filters.category);
  }
  if (filters.search) {
    query = query.or(
      `name_ar.ilike.%${filters.search}%,name_en.ilike.%${filters.search}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("name_ar", { ascending: true })
    .range(from, to);

  if (error) throw wrapSupabaseError(error, "getMajors");
  return { data: data as Major[], count: count ?? 0, page, pageSize };
}

export async function getMajorBySlug(slug: string): Promise<Major | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("majors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw wrapSupabaseError(error, "getMajorBySlug");
  }
  return data as Major;
}

export async function getUniversityMajors(universityId: string): Promise<UniversityMajor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("university_majors")
    .select(`*, major:majors(*)`)
    .eq("university_id", universityId);

  if (error) throw wrapSupabaseError(error, "getUniversityMajors");
  return data as UniversityMajor[];
}

export async function getMajorUniversities(
  majorId: string,
  sortBy: "tuition" | "ranking" = "tuition"
): Promise<UniversityMajor[]> {
  const supabase = await createClient();
  let query = supabase
    .from("university_majors")
    .select(`*, university:universities(*)`)
    .eq("major_id", majorId);

  if (sortBy === "tuition") {
    query = query.order("tuition_per_year", { ascending: true });
  }

  const { data, error } = await query;

  if (error) throw wrapSupabaseError(error, "getMajorUniversities");
  
  const results = data as UniversityMajor[];

  if (sortBy === "ranking") {
    return results.sort((a, b) => {
      const rankA = a.university?.ranking_egypt ?? 999;
      const rankB = b.university?.ranking_egypt ?? 999;
      return rankA - rankB;
    });
  }

  return results;
}
