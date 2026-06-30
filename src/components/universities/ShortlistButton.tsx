"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  universityId: string;
  compact?: boolean;
}

export default function ShortlistButton({ universityId, compact = false }: Props) {
  const supabase = useMemo(() => createClient(), []);
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
      return <div className="w-9 h-9 rounded-xl bg-border/20 animate-pulse" />;
    }
    return <div className="w-36 h-10 rounded-xl bg-border/20 animate-pulse" />;
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        title={saved ? "إزالة من القائمة" : "حفظ في القائمة"}
        className={`flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 ${
          saved
            ? "border-amber bg-amber/10 text-amber shadow-[0_0_12px_rgba(212,168,67,0.25)]"
            : "border-border bg-card-bg text-text-secondary/60 hover:border-amber/50 hover:text-amber hover:shadow-md"
        }`}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : (saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />)}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold font-cairo transition-all duration-300 disabled:opacity-50 ${
        saved
          ? "border-amber bg-amber/10 text-amber shadow-[0_0_16px_rgba(212,168,67,0.2)]"
          : "border-border bg-card-bg text-text-primary hover:border-amber/50 hover:text-amber hover:shadow-md"
      }`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : (saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />)}
      {loading ? "جاري الحفظ..." : (saved ? "محفوظ في قائمتي" : "احفظ في قائمتي")}
    </button>
  );
}
