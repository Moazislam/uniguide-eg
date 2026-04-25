import { createClient } from "@/lib/supabase/server";
import type { Faculty } from "@/types";

export async function getFacultiesByUniversityId(universityId: string): Promise<Faculty[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faculties")
    .select("*")
    .eq("university_id", universityId)
    .order("name_ar", { ascending: true });

  if (error) return [];
  return data as Faculty[];
}
