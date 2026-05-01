"use client";

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  universityId: string;
  compact?: boolean;
}

export default function ShortlistButton({ universityId, compact = false }: Props) {
  const supabase = createClient();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    let active = true;
    async function check() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const { data } = await supabase
        .from("student_profiles")
        .select("shortlist")
        .eq("user_id", authData.user.id)
        .maybeSingle();
      if (active && data?.shortlist) {
        setSaved((data.shortlist as string[]).includes(universityId));
      }
    }
    check();
    return () => { active = false; };
  }, [supabase, universityId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      window.location.href = "/auth";
      return;
    }

    const { data: profileData } = await supabase
      .from("student_profiles")
      .select("shortlist")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    const current: string[] = (profileData?.shortlist as string[]) ?? [];
    const next = saved
      ? current.filter((id) => id !== universityId)
      : [...current, universityId];

    await supabase.from("student_profiles").upsert(
      { user_id: authData.user.id, shortlist: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

    setSaved(!saved);
    setLoading(false);
  }

  if (!hydrated) {
    if (compact) {
      return <div className="w-8 h-8 rounded-xl bg-border/20 animate-pulse" />;
    }
    return <div className="w-36 h-9 rounded-xl bg-border/20 animate-pulse" />;
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        title={saved ? "إزالة من القائمة" : "حفظ في القائمة"}
        className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-all disabled:opacity-50 ${
          saved
            ? "border-amber bg-amber/10 text-amber"
            : "border-border bg-card-bg text-text-secondary/60 hover:border-amber/50 hover:text-amber"
        }`}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : (saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />)}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold font-cairo transition-all disabled:opacity-50 ${
        saved
          ? "border-amber bg-amber/10 text-amber"
          : "border-border bg-card-bg text-text-primary dark:text-text-secondary hover:border-amber/50 hover:text-amber"
      }`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : (saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />)}
      {loading ? "جاري الحفظ..." : (saved ? "محفوظ في قائمتي" : "احفظ في قائمتي")}
    </button>
  );
}
