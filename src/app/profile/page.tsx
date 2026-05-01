"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/client";
import ShortlistExport from "@/components/universities/ShortlistExport";
import { User as AuthUser } from "@supabase/supabase-js";
import { AppError, wrapSupabaseError } from "@/lib/errors";
import {
  buildRecommendationQuery,
  buildStudentProfilePayload,
  hydrateFormFromProfile,
} from "@/lib/student-profile";
import type { MajorCategory, StudentProfile, University } from "@/types";
import {
  BadgeCheck,
  BookmarkX,
  CheckCircle2,
  GraduationCap,
  LogOut,
  MapPin,
  Save,
  Sparkles,
  User,
  LayoutDashboard,
  Settings2,
  Heart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { gsap } from "gsap";

interface ProfileFormState {
  track: string;
  score: string;
  interests: string[];
  budget: string;
  preferredLocation: string;
  mobilityPreference: string;
  preferredLanguage: string;
  preferredType: string;
  preferredSystem: string;
}

const tracks = [
  { id: "science", labelAr: "علمي", labelEn: "Science" },
  { id: "math", labelAr: "رياضي", labelEn: "Math" },
  { id: "arts", labelAr: "أدبي", labelEn: "Arts" },
  { id: "ig", labelAr: "IG", labelEn: "IG" },
  { id: "american", labelAr: "أمريكي", labelEn: "American" },
  { id: "french", labelAr: "فرنسي", labelEn: "French" },
];

const budgets = [
  { id: "0-50000", labelAr: "أقل من 50 ألف", labelEn: "Under 50K" },
  { id: "50000-150000", labelAr: "50 ألف - 150 ألف", labelEn: "50K - 150K" },
  { id: "150000-300000", labelAr: "150 ألف - 300 ألف", labelEn: "150K - 300K" },
  { id: "300000+", labelAr: "أكثر من 300 ألف", labelEn: "300K+" },
];

const locations = [
  { id: "Cairo", labelAr: "القاهرة", labelEn: "Cairo" },
  { id: "Giza", labelAr: "الجيزة", labelEn: "Giza" },
  { id: "New Cairo", labelAr: "القاهرة الجديدة", labelEn: "New Cairo" },
  { id: "Sheikh Zayed", labelAr: "الشيخ زايد", labelEn: "Sheikh Zayed" },
  { id: "Alexandria", labelAr: "الإسكندرية", labelEn: "Alexandria" },
];

const mobilityOptions = [
  { id: "same_city", labelAr: "نفس المدينة فقط", labelEn: "Same city only" },
  { id: "nearby", labelAr: "مدينة قريبة", labelEn: "Nearby is fine" },
  { id: "anywhere", labelAr: "أي مكان مناسب", labelEn: "Open to relocate" },
];

const languageOptions = [
  { id: "arabic", labelAr: "عربي", labelEn: "Arabic" },
  { id: "english", labelAr: "إنجليزي", labelEn: "English" },
  { id: "bilingual", labelAr: "ثنائي اللغة", labelEn: "Bilingual" },
];

const typeOptions = [
  { id: "", labelAr: "أي نوع", labelEn: "Any type" },
  { id: "public", labelAr: "حكومية", labelEn: "Public" },
  { id: "private", labelAr: "خاصة", labelEn: "Private" },
  { id: "international", labelAr: "دولية", labelEn: "International" },
];

const systemOptions = [
  { id: "", labelAr: "أي نظام", labelEn: "Any system" },
  { id: "egyptian", labelAr: "مصري", labelEn: "Egyptian" },
  { id: "american", labelAr: "أمريكي", labelEn: "American" },
  { id: "british", labelAr: "بريطاني", labelEn: "British" },
  { id: "french", labelAr: "فرنسي", labelEn: "French" },
];

const interests = [
  { id: "medicine", labelAr: "طب", labelEn: "Medicine" },
  { id: "engineering", labelAr: "هندسة", labelEn: "Engineering" },
  { id: "computer_science", labelAr: "علوم حاسب", labelEn: "CS" },
  { id: "business", labelAr: "إدارة وأعمال", labelEn: "Business" },
  { id: "arts", labelAr: "آداب وفنون", labelEn: "Arts" },
  { id: "law", labelAr: "حقوق", labelEn: "Law" },
  { id: "pharmacy", labelAr: "صيدلة", labelEn: "Pharmacy" },
  { id: "architecture", labelAr: "عمارة", labelEn: "Architecture" },
  { id: "media", labelAr: "إعلام", labelEn: "Media" },
  { id: "science", labelAr: "علوم", labelEn: "Science" },
];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SelectionCard({
  active,
  onClick,
  title,
  subtitle,
  isRtl,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  isRtl: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-2xl border px-4 py-3 transition-all duration-300 transform active:scale-95",
        isRtl ? "text-right" : "text-left",
        active
          ? "border-amber bg-amber/5 shadow-[0_4px_12px_rgba(212,168,67,0.12)] scale-[1.02]"
          : "border-border bg-card-bg hover:border-amber/40 hover:bg-cream dark:hover:bg-blue/10 hover:shadow-sm"
      )}
    >
      <p className={classNames("text-sm font-bold font-cairo", active ? "text-amber" : "text-blue dark:text-text-primary")}>{title}</p>
      {subtitle && <p className="text-[11px] text-text-secondary font-cairo mt-1">{subtitle}</p>}
    </button>
  );
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-full border px-4 py-2 text-sm font-bold font-cairo transition-all duration-300",
        active
          ? "border-amber bg-amber text-white dark:text-blue-dark shadow-md scale-105"
          : "border-border bg-card-bg text-blue dark:text-text-primary hover:border-amber/50 hover:bg-cream dark:hover:bg-blue/10"
      )}
    >
      {label}
    </button>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">{label}</p>
      <p className="text-sm font-black text-amber font-cairo truncate">{value || "—"}</p>
    </div>
  );
}

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const { t, isRtl, language } = useLanguage();
  const isAr = language === "ar";
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Partial<StudentProfile> | null>(null);
  const [activeTab, setActiveTab] = useState<"matching" | "shortlist">("matching");
  const [form, setForm] = useState<ProfileFormState>({
    track: "",
    score: "",
    interests: [],
    budget: "",
    preferredLocation: "",
    mobilityPreference: "nearby",
    preferredLanguage: "",
    preferredType: "",
    preferredSystem: "",
  });
  const [initialForm, setInitialForm] = useState<ProfileFormState | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<AppError | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        const authUser = authData.user;
        if (!active) return;
        setUser(authUser);

        if (!authUser) {
          setLoading(false);
          return;
        }

        const { data, error: profileError } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!active) return;

        const currentProfile = (data as Partial<StudentProfile> | null) ?? null;
        const hydratedForm = hydrateFormFromProfile(currentProfile);
        setProfile(currentProfile);
        setForm(hydratedForm);
        setInitialForm(hydratedForm);

        const ids = currentProfile?.shortlist ?? [];
        setShortlistIds(ids);
        if (ids.length) {
          const { data: universitiesData, error: shortlistError } = await supabase
            .from("universities")
            .select("*")
            .in("id", ids);

          if (shortlistError) throw shortlistError;

          if (active) {
            setUniversities((universitiesData as University[]) ?? []);
          }
        }

        if (active) {
          setLoading(false);
          // Subtle entrance animation
          gsap.fromTo(".profile-animate", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
          );
        }
      } catch (err: any) {
        if (active) {
          setError(wrapSupabaseError(err, "loadProfile"));
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [supabase]);

  const recommendationQuery = useMemo(() => buildRecommendationQuery(form), [form]);
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  const completionCount = [
    form.track,
    form.score,
    form.budget,
    form.preferredLocation,
    form.mobilityPreference,
    form.preferredLanguage,
    form.preferredType,
    form.preferredSystem,
    form.interests.length ? "interests" : "",
  ].filter(Boolean).length;
  const profileCompletion = Math.round((completionCount / 9) * 100);

  const removeFromShortlist = async (id: string) => {
    const next = shortlistIds.filter((value) => value !== id);
    setShortlistIds(next);
    setUniversities((current) => current.filter((item) => item.id !== id));
    if (user) {
      await supabase.from("student_profiles").upsert(
        {
          user_id: user.id,
          shortlist: next,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const toggleInterest = (interestId: string) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interestId)
        ? current.interests.filter((item) => item !== interestId)
        : [...current.interests, interestId],
    }));
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("student_profiles").upsert(
      {
        user_id: user.id,
        shortlist: shortlistIds,
        ...buildStudentProfilePayload(form),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    const nextProfile = {
      ...profile,
      track: form.track ? (form.track as StudentProfile["track"]) : undefined,
      score: form.score ? Number.parseFloat(form.score) : undefined,
      budget_min: buildStudentProfilePayload(form).budget_min ?? undefined,
      budget_max: buildStudentProfilePayload(form).budget_max ?? undefined,
      interests: form.interests as MajorCategory[],
      city: form.preferredLocation || undefined,
      preferred_locations: form.preferredLocation ? [form.preferredLocation] : undefined,
      mobility_preference: form.mobilityPreference as StudentProfile["mobility_preference"],
      preferred_language: form.preferredLanguage as StudentProfile["preferred_language"],
      preferred_university_types: form.preferredType
        ? [form.preferredType as NonNullable<StudentProfile["preferred_university_types"]>[number]]
        : undefined,
      preferred_systems: form.preferredSystem
        ? [form.preferredSystem as NonNullable<StudentProfile["preferred_systems"]>[number]]
        : undefined,
      shortlist: shortlistIds,
      updated_at: new Date().toISOString(),
    } as Partial<StudentProfile>;

    setProfile(nextProfile);
    setInitialForm(form);
    setMessage(t("profile.success"));
    setSaving(false);

    // Fade out message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />
      
      {/* Dynamic Header */}
      <div className="bg-blue dark:bg-blue-dark text-white pt-10 pb-20 relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-amber/10 rotate-[15deg] blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[120%] bg-blue-light/5 rotate-[-10deg] blur-3xl" />
         </div>

         <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${isRtl ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
               <div className={`flex items-center gap-5 ${isRtl ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 dark:bg-card-bg/20 border border-white/20 flex items-center justify-center shadow-xl backdrop-blur-md">
                      <User size={36} className="text-amber" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-blue dark:border-blue-dark flex items-center justify-center shadow-lg">
                       <CheckCircle2 size={12} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black font-cairo tracking-tight">{t("profile.title")}</h1>
                    <p className="text-blue-100/60 font-cairo text-sm">{user?.email ?? ""}</p>
                  </div>
               </div>
               
               <div className={`flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <button
                    onClick={signOut}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white/80 hover:bg-red-500/20 hover:text-white hover:border-red-500/40 transition-all duration-300 font-cairo ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <LogOut size={16} />
                    {t("profile.logout")}
                  </button>
               </div>
            </div>
         </main>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className={`rounded-[24px] border border-red-200 bg-red-50/50 backdrop-blur-sm p-5 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-base font-black text-red-900 font-cairo leading-tight">
                  {isAr ? error.messageAr : error.messageEn}
                </p>
                <p className="text-sm text-red-700/70 font-cairo mt-1">
                  {isAr ? "يرجى تحديث الصفحة أو المحاولة لاحقاً." : "Please refresh the page or try again later."}
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className={`px-4 py-2 rounded-xl bg-red-100 text-red-700 text-xs font-bold font-cairo hover:bg-red-200 transition-colors ${isRtl ? 'mr-auto' : 'ml-auto'}`}
              >
                {isAr ? "إعادة المحاولة" : "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16 w-full relative z-20">
        <div className="grid gap-8 xl:grid-cols-[1.35fr,0.85fr]">
          
          <div className="space-y-8">
            {/* Desktop Tabs */}
            <div className={`flex gap-4 p-1.5 bg-card-bg/60 dark:bg-card-bg/80 backdrop-blur rounded-[24px] border border-border shadow-sm w-fit ${isRtl ? 'ml-auto' : 'mr-auto'}`}>
               <button 
                 onClick={() => setActiveTab("matching")}
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-[20px] text-sm font-black font-cairo transition-all duration-300 ${activeTab === "matching" ? 'bg-blue dark:bg-amber text-white dark:text-blue-dark shadow-lg' : 'text-text-secondary hover:text-blue dark:hover:text-amber'}`}
               >
                 <Settings2 size={16} />
                 {t("profile.matchingProfile")}
               </button>
               <button 
                 onClick={() => setActiveTab("shortlist")}
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-[20px] text-sm font-black font-cairo transition-all duration-300 ${activeTab === "shortlist" ? 'bg-blue dark:bg-amber text-white dark:text-blue-dark shadow-lg' : 'text-text-secondary hover:text-blue dark:hover:text-amber'}`}
               >
                 <Heart size={16} />
                 {t("profile.shortlist")}
                 {universities.length > 0 && (
                   <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "shortlist" ? 'bg-white/20' : 'bg-cream dark:bg-blue/20 text-text-secondary'}`}>
                     {universities.length}
                   </span>
                 )}
               </button>
            </div>

            {activeTab === "matching" && (
              <div className="profile-animate overflow-hidden rounded-[32px] border border-border bg-card-bg shadow-xl shadow-blue/5">
                <div className="border-b border-border bg-gradient-to-r from-blue via-blue-light to-amber p-8 text-white relative">
                  <div className={`flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-3">
                         <BrainCircuit size={12} className="text-amber" />
                         Matching System V2.1
                      </div>
                      <h2 className="text-3xl font-black font-cairo tracking-tight">{t("profile.customize")}</h2>
                      <p className="mt-3 max-w-xl text-blue-100/70 font-cairo text-sm leading-relaxed">
                        {t("profile.customizeDesc")}
                      </p>
                    </div>
                    <div className="min-w-[200px] rounded-3xl bg-white/10 px-5 py-4 backdrop-blur-md border border-white/10 shadow-lg">
                      <div className={`flex items-center justify-between text-xs font-bold text-white/80 mb-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        <span>{t("profile.completion")}</span>
                        <span className="text-amber text-lg font-black">{profileCompletion}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber to-white transition-all duration-1000 ease-out"
                          style={{ width: `${profileCompletion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex items-center gap-3 p-3 rounded-2xl bg-cream dark:bg-blue/10 border border-border ${isRtl ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                      <div className="w-10 h-10 rounded-xl bg-card-bg flex items-center justify-center shadow-sm">
                         <Sparkles size={18} className="text-amber" />
                      </div>
                      <div>
                        <p className="text-blue dark:text-text-primary font-black text-sm font-cairo">
                          {isAr ? "نظام التخصيص التلقائي نشط" : "Auto-Personalization Active"}
                        </p>
                        <p className="text-[11px] text-text-secondary font-cairo">
                          {isAr ? "نقوم بتحديث النتائج بناءً على اختياراتك." : "We adjust results as you type."}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                      {isDirty && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber/10 text-amber text-[11px] font-bold border border-amber/20 animate-pulse">
                          <TrendingUp size={12} />
                          {t("profile.unsaved")}
                        </div>
                      )}
                      <button
                        onClick={saveProfile}
                        disabled={saving || loading || !isDirty}
                        className={`inline-flex items-center gap-2 rounded-2xl bg-blue dark:bg-amber px-6 py-3 text-sm font-black text-white dark:text-blue-dark shadow-xl shadow-blue/20 dark:shadow-amber/10 transition-all duration-300 hover:bg-blue-light dark:hover:bg-amber-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
                      >
                        <Save size={16} />
                        {saving ? t("profile.saving") : t("profile.save")}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <section className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="mb-5 flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-amber rounded-full" />
                         <div>
                            <h3 className="text-lg font-black text-blue dark:text-text-primary font-cairo leading-none">{t("profile.academic")}</h3>
                            <p className="text-xs text-text-secondary font-cairo mt-1">{t("profile.academicDesc")}</p>
                         </div>
                      </div>
                      <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
                        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}>
                          {tracks.map((track) => (
                            <SelectionCard
                              key={track.id}
                              active={form.track === track.id}
                              onClick={() => setForm((current) => ({ ...current, track: track.id }))}
                              title={isAr ? track.labelAr : track.labelEn}
                              subtitle={isAr ? track.labelEn : track.labelAr}
                              isRtl={isRtl}
                            />
                          ))}
                        </div>
                        <div className="rounded-3xl border border-border bg-cream dark:bg-blue/10 p-6 flex flex-col justify-between">
                          <div className={`flex items-start justify-between gap-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={isRtl ? 'text-right' : 'text-left'}>
                              <p className="text-xs font-black text-blue dark:text-text-primary font-cairo uppercase tracking-widest">{t("profile.score")}</p>
                              <p className="text-[11px] text-text-secondary font-cairo mt-0.5">{t("profile.scoreDesc")}</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                               <span className="text-4xl font-black text-blue dark:text-text-primary tracking-tighter">{form.score || "—"}</span>
                               <span className="text-xs font-black text-amber">%</span>
                            </div>
                          </div>
                          <div className="mt-8 relative pt-2">
                             <input
                                type="range"
                                min="40"
                                max="100"
                                step="0.5"
                                value={form.score || "70"}
                                onChange={(event) => {
                                  const val = Number.parseFloat(event.target.value);
                                  const clamped = Math.max(0, Math.min(100, val));
                                  setForm((current) => ({ ...current, score: clamped.toString() }));
                                }}
                                className="w-full accent-amber cursor-pointer"
                             />
                             <div className="flex justify-between mt-2 text-[10px] text-text-secondary/50 font-bold px-1">
                                <span>40%</span>
                                <span>70%</span>
                                <span>100%</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="mb-5 flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-amber rounded-full" />
                         <div>
                            <h3 className="text-lg font-black text-blue dark:text-text-primary font-cairo leading-none">{t("profile.interests")}</h3>
                            <p className="text-xs text-text-secondary font-cairo mt-1">{t("profile.interestsDesc")}</p>
                         </div>
                      </div>
                      <div className={`flex flex-wrap gap-2.5 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                        {interests.map((interest) => (
                          <Chip
                            key={interest.id}
                            active={form.interests.includes(interest.id)}
                            label={isAr ? interest.labelAr : interest.labelEn}
                            onClick={() => toggleInterest(interest.id)}
                          />
                        ))}
                      </div>
                    </section>

                    <section className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="mb-5 flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-amber rounded-full" />
                         <div>
                            <h3 className="text-lg font-black text-blue dark:text-text-primary font-cairo leading-none">{t("profile.budgetLocation")}</h3>
                            <p className="text-xs text-text-secondary font-cairo mt-1">{t("profile.budgetLocationDesc")}</p>
                         </div>
                      </div>
                      <div className="grid gap-8 lg:grid-cols-2">
                        <div className="p-6 rounded-3xl bg-cream dark:bg-blue/10 border border-border">
                          <p className="mb-4 text-[11px] font-black text-blue dark:text-text-primary uppercase tracking-widest">{t("profile.budget")}</p>
                          <div className="grid grid-cols-2 gap-3">
                            {budgets.map((budget) => (
                              <SelectionCard
                                key={budget.id}
                                active={form.budget === budget.id}
                                onClick={() => setForm((current) => ({ ...current, budget: budget.id }))}
                                title={isAr ? budget.labelAr : budget.labelEn}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="p-6 rounded-3xl bg-cream dark:bg-blue/10 border border-border">
                            <p className="mb-4 text-[11px] font-black text-blue dark:text-text-primary uppercase tracking-widest">{t("profile.location")}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {locations.map((location) => (
                                <SelectionCard
                                  key={location.id}
                                  active={form.preferredLocation === location.id}
                                  onClick={() => setForm((current) => ({ ...current, preferredLocation: location.id }))}
                                  title={isAr ? location.labelAr : location.labelEn}
                                  isRtl={isRtl}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="p-6 rounded-3xl bg-cream dark:bg-blue/10 border border-border">
                            <p className="mb-4 text-[11px] font-black text-blue dark:text-text-primary uppercase tracking-widest">{t("profile.mobility")}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {mobilityOptions.map((option) => (
                                <SelectionCard
                                  key={option.id}
                                  active={form.mobilityPreference === option.id}
                                  onClick={() => setForm((current) => ({ ...current, mobilityPreference: option.id }))}
                                  title={isAr ? option.labelAr : option.labelEn}
                                  isRtl={isRtl}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="mb-5 flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-amber rounded-full" />
                         <div>
                            <h3 className="text-lg font-black text-blue dark:text-text-primary font-cairo leading-none">{t("profile.studyPrefs")}</h3>
                            <p className="text-xs text-text-secondary font-cairo mt-1">{t("profile.studyPrefsDesc")}</p>
                         </div>
                      </div>
                      <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-2">{t("details.language")}</p>
                          <div className="grid grid-cols-1 gap-2.5">
                            {languageOptions.map((option) => (
                              <SelectionCard
                                key={option.id}
                                active={form.preferredLanguage === option.id}
                                onClick={() => setForm((current) => ({ ...current, preferredLanguage: option.id }))}
                                title={isAr ? option.labelAr : option.labelEn}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-2">{t("profile.type")}</p>
                          <div className="grid grid-cols-1 gap-2.5">
                            {typeOptions.map((option) => (
                              <SelectionCard
                                key={option.id || "any-type"}
                                active={form.preferredType === option.id}
                                onClick={() => setForm((current) => ({ ...current, preferredType: option.id }))}
                                title={isAr ? option.labelAr : option.labelEn}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-2">{t("profile.system")}</p>
                          <div className="grid grid-cols-1 gap-2.5">
                            {systemOptions.map((option) => (
                              <SelectionCard
                                key={option.id || "any-system"}
                                active={form.preferredSystem === option.id}
                                onClick={() => setForm((current) => ({ ...current, preferredSystem: option.id }))}
                                title={isAr ? option.labelAr : option.labelEn}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    {message && (
                      <div className={`profile-animate fixed bottom-24 ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} z-[60] flex items-center gap-3 rounded-full border border-green-200 bg-card-bg px-6 py-4 shadow-2xl text-sm text-green-700 animate-in fade-in slide-in-from-bottom-10 duration-500 font-bold ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        <CheckCircle2 size={20} className="text-green-500" />
                        <span className="font-cairo">{message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shortlist" && (
              <div className="profile-animate space-y-6">
                <div className={`rounded-[32px] border border-border bg-card-bg p-10 shadow-xl shadow-blue/5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className={`mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div>
                      <h2 className={`flex items-center gap-3 text-2xl font-black text-blue dark:text-text-primary font-cairo ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        <GraduationCap size={28} className="text-amber" />
                        {t("profile.shortlist")}
                      </h2>
                      <p className="text-sm text-text-secondary font-cairo mt-2">
                        {isAr ? "قم بالوصول إلى جامعاتك المفضلة في أي وقت للمقارنة السريعة." : "Access your saved favorites anytime for quick comparison."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShortlistExport universities={universities} />
                      <Link
                         href="/universities"
                         className="px-5 py-2.5 rounded-xl border border-border text-blue dark:text-amber text-xs font-black font-cairo hover:bg-cream dark:hover:bg-blue/10 transition-colors"
                      >
                         {t("hero.ctaBrowse")}
                      </Link>
                    </div>
                  </div>
                  
                  {loading ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                           <div key={i} className="h-28 rounded-3xl bg-cream dark:bg-blue/10 animate-pulse" />
                        ))}
                     </div>
                  ) : universities.length === 0 ? (
                    <div className="rounded-[40px] border border-dashed border-border bg-cream/50 dark:bg-blue/10 py-20 text-center">
                      <div className="w-20 h-20 bg-card-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                         <GraduationCap size={40} className="text-text-secondary/20" />
                      </div>
                      <p className="mb-4 text-lg font-black text-blue dark:text-text-primary font-cairo">{t("profile.noShortlist")}</p>
                      <p className="text-sm text-text-secondary font-cairo mb-8 max-w-sm mx-auto">
                        {isAr ? "استكشف جميع الجامعات المصرية وأضف مفضلاتك إلى هذه القائمة للمقارنة بينها جنباً إلى جنب." : "Explore all Egyptian universities and add your favorites to this list to compare them side-by-side."}
                      </p>
                      <Link
                        href="/universities"
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue dark:bg-amber px-8 py-3.5 text-sm font-black text-white dark:text-blue-dark shadow-lg shadow-blue/20 dark:shadow-amber/10 hover:bg-blue-light dark:hover:bg-amber-dark transition-all"
                      >
                        {t("hero.ctaBrowse")}
                        {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {universities.map((university) => (
                        <div
                          key={university.id}
                          className={`group flex items-center justify-between rounded-[28px] border border-border p-5 transition-all duration-300 hover:border-amber/40 hover:shadow-lg hover:bg-cream/50 dark:hover:bg-blue/10 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                          <div className={`flex items-center gap-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card-bg border border-border shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                               {university.logo_url ? (
                                  <img src={university.logo_url} alt={university.name_en} className="w-10 h-10 object-contain" />
                               ) : (
                                  <GraduationCap size={24} className="text-blue dark:text-amber" />
                               )}
                            </div>
                            <div className={isRtl ? 'text-right' : 'text-left'}>
                              <Link
                                href={`/universities/${university.slug}`}
                                className="text-base font-black text-blue dark:text-text-primary font-cairo group-hover:text-amber transition-colors"
                              >
                                {isAr ? university.name_ar : university.name_en}
                              </Link>
                              <p className={`flex items-center gap-1 text-xs text-text-secondary font-cairo mt-1 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                                <MapPin size={10} className="text-amber" />
                                {isAr ? university.location_ar : university.location_en}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromShortlist(university.id)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary/30 transition-all duration-300 hover:bg-red-50 hover:text-red-500 active:scale-90"
                          >
                            <BookmarkX size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Recommendation Engine Sidebar Card */}
            <div className={`profile-animate rounded-[32px] bg-blue dark:bg-blue-dark p-8 text-white shadow-2xl shadow-blue/30 relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div className={`relative z-10 flex items-start justify-between gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{t("profile.engine")}</p>
                  <p className="mt-2 text-xl font-black font-cairo">{t("profile.currentProfile")}</p>
                  <p className="mt-3 text-sm text-blue-100/70 font-cairo leading-relaxed">
                    {profile
                      ? t("profile.profilePowered")
                      : t("profile.profileEmpty")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                   <BadgeCheck size={24} className="text-amber shrink-0" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 relative z-10">
                <SummaryPill label={isAr ? "المسار" : "Track"} value={isAr ? (tracks.find((item) => item.id === form.track)?.labelAr ?? "") : (tracks.find((item) => item.id === form.track)?.labelEn ?? "")} />
                <SummaryPill label={isAr ? "الميزانية" : "Budget"} value={isAr ? (budgets.find((item) => item.id === form.budget)?.labelAr ?? "") : (budgets.find((item) => item.id === form.budget)?.labelEn ?? "")} />
                <SummaryPill label={isAr ? "الموقع" : "Location"} value={isAr ? (locations.find((item) => item.id === form.preferredLocation)?.labelAr ?? form.preferredLocation) : (locations.find((item) => item.id === form.preferredLocation)?.labelEn ?? form.preferredLocation)} />
                <SummaryPill label={isAr ? "الاهتمامات" : "Interests"} value={form.interests.length ? (isAr ? `${form.interests.length} مجالات` : `${form.interests.length} selected`) : ""} />
              </div>

              <div className="mt-8 space-y-3 relative z-10">
                 <Link
                   href={`/universities?${recommendationQuery}`}
                   className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber px-6 py-4 text-sm font-black text-white dark:text-blue-dark shadow-xl shadow-amber/20 transition-all duration-300 hover:bg-amber-dark hover:scale-[1.02]"
                 >
                   {t("profile.showResults")}
                   {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                 </Link>
                 <Link
                   href="/onboarding"
                   className="inline-flex w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 px-6 py-3.5 text-sm font-bold text-white/80 transition-all hover:bg-white/10"
                 >
                   {t("profile.fullExperience")}
                 </Link>
              </div>
            </div>

            {/* Snapshot Sidebar Card */}
            <div className={`profile-animate rounded-[32px] border border-border bg-card-bg p-8 shadow-xl shadow-blue/5 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-cream dark:bg-blue/10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-blue dark:text-amber" />
                 </div>
                 <h2 className="text-lg font-black text-blue dark:text-text-primary font-cairo">{t("profile.snapshot")}</h2>
              </div>
              <div className="space-y-4 text-sm text-text-secondary font-cairo">
                <div className={`flex items-center justify-between pb-3 border-b border-border ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span className="font-bold">{t("profile.score")}</span>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-blue dark:text-text-primary text-lg font-black">{form.score || "—"}</strong>
                    <span className="text-[10px] font-bold text-amber">%</span>
                  </div>
                </div>
                <div className={`flex items-center justify-between pb-3 border-b border-border ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span className="font-bold">{t("profile.mobility")}</span>
                  <strong className="text-blue dark:text-text-primary font-black">
                    {isAr ? (mobilityOptions.find((item) => item.id === form.mobilityPreference)?.labelAr || "—") : (mobilityOptions.find((item) => item.id === form.mobilityPreference)?.labelEn || "—")}
                  </strong>
                </div>
                <div className={`flex items-center justify-between pb-3 border-b border-border ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span className="font-bold">{t("details.language")}</span>
                  <strong className="text-blue dark:text-text-primary font-black">
                    {isAr ? (languageOptions.find((item) => item.id === form.preferredLanguage)?.labelAr || "—") : (languageOptions.find((item) => item.id === form.preferredLanguage)?.labelEn || "—")}
                  </strong>
                </div>
                <div className={`flex items-center justify-between pb-3 border-b border-border ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span className="font-bold">{isAr ? "النوع" : "Type"}</span>
                  <strong className="text-blue dark:text-text-primary font-black">
                    {isAr ? (typeOptions.find((item) => item.id === form.preferredType)?.labelAr || "—") : (typeOptions.find((item) => item.id === form.preferredType)?.labelEn || "—")}
                  </strong>
                </div>
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span className="font-bold">{isAr ? "النظام" : "System"}</span>
                  <strong className="text-blue dark:text-text-primary font-black">
                    {isAr ? (systemOptions.find((item) => item.id === form.preferredSystem)?.labelAr || "—") : (systemOptions.find((item) => item.id === form.preferredSystem)?.labelEn || "—")}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
