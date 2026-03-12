import { createClient } from "@/lib/supabase/server";
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

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("ranking_egypt", { ascending: true, nullsFirst: false })
    .range(from, to);

  if (error) throw error;

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

  if (error) return null;
  return data as University;
}

export async function getUniversitiesByIds(ids: string[]): Promise<University[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .in("id", ids);

  if (error) throw error;
  return data as University[];
}
