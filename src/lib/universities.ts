import { createClient } from "@/lib/supabase/server";
import { wrapSupabaseError } from "./errors";
import type { University, UniversityFilters, PaginatedResponse } from "@/types";

export async function getUniversities(
  filters: UniversityFilters = {},
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<University>> {
  const supabase = await createClient();
  let query = supabase.from("universities").select("*", { count: "exact" });

  if (filters.type?.length) {
    query = query.in("type", filters.type);
  }
  if (filters.location?.length) {
    query = query.in("location_en", filters.location);
  }
  if (filters.tuition_max) {
    query = query.lte("tuition_min", filters.tuition_max);
  }
  if (filters.search) {
    query = query.or(
      `name_ar.ilike.%${filters.search}%,name_en.ilike.%${filters.search}%`
    );
  }

  // Phase 9.2: New Filters
  if (filters.track) {
    if (filters.track === "ig") query = query.not("admission_ig", "is", null);
    else if (filters.track === "american") query = query.not("admission_american", "is", null);
    else if (filters.track === "french") query = query.not("admission_french", "is", null);
    else if (filters.track === "german") query = query.not("admission_german", "is", null);
    else if (filters.track === "national") query = query.not("admission_national", "is", null);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("ranking_egypt", { ascending: true, nullsFirst: false })
    .range(from, to);

  if (error) throw wrapSupabaseError(error, "getUniversities");

  return {
    data: data as University[],
    count: count ?? 0,
    page,
    pageSize,
  };
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw wrapSupabaseError(error, "getUniversityBySlug");
  }
  return data as University;
}

export async function getUniversitiesByIds(ids: string[]): Promise<University[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .in("id", ids);

  if (error) throw wrapSupabaseError(error, "getUniversitiesByIds");
  return data as University[];
}
