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

export async function getFacultyById(id: string): Promise<Faculty | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faculties")
    .select("*, university:universities(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as (Faculty & { university: any });
}
