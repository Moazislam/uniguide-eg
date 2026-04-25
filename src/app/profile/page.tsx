"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/client";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

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
  { id: "ig", labelAr: "IG", labelEn: "International" },
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
        "rounded-2xl border px-4 py-3 transition-all",
        isRtl ? "text-right" : "text-left",
        active
          ? "border-[#d4a843] bg-[#fff8e8] shadow-sm"
          : "border-gray-200 bg-white hover:border-[#d4a843]/40 hover:bg-[#faf7f2]"
      )}
    >
      <p className="text-sm font-bold text-[#1a3a5c] font-cairo">{title}</p>
      {subtitle && <p className="text-[11px] text-gray-400 font-cairo mt-1">{subtitle}</p>}
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
        "rounded-full border px-3 py-2 text-sm font-semibold font-cairo transition-all",
        active
          ? "border-[#d4a843] bg-[#d4a843] text-white"
          : "border-gray-200 bg-white text-[#1a3a5c] hover:border-[#d4a843]/50"
      )}
    >
      {label}
    </button>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#faf7f2] px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#1a3a5c] font-cairo">{value || "—"}</p>
    </div>
  );
}

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const { t, isRtl, language } = useLanguage();
  const isAr = language === "ar";
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Partial<StudentProfile> | null>(null);
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

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData.user;
      if (!active) return;
      setUser(authUser);

      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (!active) return;

      const currentProfile = (data as Partial<StudentProfile> | null) ?? null;
      const hydratedForm = hydrateFormFromProfile(currentProfile);
      setProfile(currentProfile);
      setForm(hydratedForm);
      setInitialForm(hydratedForm);

      const ids = currentProfile?.shortlist ?? [];
      setShortlistIds(ids);
      if (ids.length) {
        const { data: universitiesData } = await supabase
          .from("universities")
          .select("*")
          .in("id", ids);

        if (active) {
          setUniversities((universitiesData as University[]) ?? []);
        }
      }

      if (active) setLoading(false);
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className={`flex items-center justify-between mb-8 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-12 h-12 rounded-full bg-[#1a3a5c] flex items-center justify-center">
              <User size={22} className="text-white" />
            </div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h1 className="text-xl font-black text-[#1a3a5c] font-cairo">{t("profile.title")}</h1>
              <p className="text-sm text-gray-400 font-cairo">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className={`flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors font-cairo ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <LogOut size={16} />
            {t("profile.logout")}
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr,0.85fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-[#1a3a5c] via-[#21486f] to-[#d4a843] p-6 text-white">
                <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">{t("profile.matchingProfile")}</p>
                    <h2 className="mt-2 text-2xl font-black font-cairo">{t("profile.customize")}</h2>
                    <p className="mt-2 max-w-xl text-sm text-white/80 font-cairo">
                      {t("profile.customizeDesc")}
                    </p>
                  </div>
                  <div className="min-w-[180px] rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm text-right">
                    <div className={`flex items-center justify-between text-xs text-white/75 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span>{t("profile.completion")}</span>
                      <span>{profileCompletion}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className={`mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex items-center gap-2 text-sm font-cairo ${isRtl ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                    <Sparkles size={16} className="text-[#d4a843]" />
                    <span className="text-[#1a3a5c] font-semibold">Personalize score, budget, location, and study preferences</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                    {isDirty && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {t("profile.unsaved")}
                      </span>
                    )}
                    {!isDirty && !loading && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        {t("profile.upToDate")}
                      </span>
                    )}
                    <button
                      onClick={saveProfile}
                      disabled={saving || loading || !isDirty}
                      className={`inline-flex items-center gap-2 rounded-xl bg-[#1a3a5c] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2a5a8c] disabled:opacity-50 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <Save size={14} />
                      {saving ? t("profile.saving") : t("profile.save")}
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="h-48 rounded-2xl bg-gray-50 animate-pulse" />
                ) : (
                  <div className="space-y-8">
                    <section className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-[#1a3a5c] font-cairo">{t("profile.academic")}</h3>
                        <p className="text-xs text-gray-400 font-cairo">{t("profile.academicDesc")}</p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
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
                        <div className="rounded-2xl border border-gray-200 bg-[#faf7f2] p-4">
                          <div className={`flex items-end justify-between gap-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={isRtl ? 'text-right' : 'text-left'}>
                              <p className="text-sm font-bold text-[#1a3a5c] font-cairo">{t("profile.score")}</p>
                              <p className="text-xs text-gray-400 font-cairo">{t("profile.scoreDesc")}</p>
                            </div>
                            <div className="text-3xl font-black text-[#1a3a5c]">{form.score || "—"}</div>
                          </div>
                          <input
                            type="range"
                            min="40"
                            max="100"
                            step="0.5"
                            value={form.score || "70"}
                            onChange={(event) => setForm((current) => ({ ...current, score: event.target.value }))}
                            className="mt-4 w-full accent-[#d4a843]"
                          />
                          <div className={`mt-3 flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={form.score}
                              onChange={(event) => setForm((current) => ({ ...current, score: event.target.value }))}
                              placeholder="85.5"
                              className={`w-28 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a3a5c] focus:border-[#d4a843] focus:outline-none ${isRtl ? 'text-right' : 'text-left'}`}
                            />
                            <span className="text-xs text-gray-400">%</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-[#1a3a5c] font-cairo">{t("profile.interests")}</h3>
                        <p className="text-xs text-gray-400 font-cairo">{t("profile.interestsDesc")}</p>
                      </div>
                      <div className={`flex flex-wrap gap-2 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
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
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-[#1a3a5c] font-cairo">{t("profile.budgetLocation")}</h3>
                        <p className="text-xs text-gray-400 font-cairo">{t("profile.budgetLocationDesc")}</p>
                      </div>
                      <div className="grid gap-5 lg:grid-cols-2">
                        <div>
                          <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("profile.budget")}</p>
                          <div className="grid grid-cols-2 gap-3">
                            {budgets.map((budget) => (
                              <SelectionCard
                                key={budget.id}
                                active={form.budget === budget.id}
                                onClick={() => setForm((current) => ({ ...current, budget: budget.id }))}
                                title={isAr ? budget.labelAr : budget.labelEn}
                                subtitle={isAr ? budget.labelEn : budget.labelAr}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-5">
                          <div>
                            <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("profile.location")}</p>
                            <div className="grid grid-cols-2 gap-3">
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
                          <div>
                            <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("profile.mobility")}</p>
                            <div className="grid gap-3">
                              {mobilityOptions.map((option) => (
                                <SelectionCard
                                  key={option.id}
                                  active={form.mobilityPreference === option.id}
                                  onClick={() => setForm((current) => ({ ...current, mobilityPreference: option.id }))}
                                  title={isAr ? option.labelAr : option.labelEn}
                                  subtitle={isAr ? option.labelEn : option.labelAr}
                                  isRtl={isRtl}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={isRtl ? 'text-right' : 'text-left'}>
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-[#1a3a5c] font-cairo">{t("profile.studyPrefs")}</h3>
                        <p className="text-xs text-gray-400 font-cairo">{t("profile.studyPrefsDesc")}</p>
                      </div>
                      <div className="grid gap-5 lg:grid-cols-3">
                        <div>
                          <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("details.language")}</p>
                          <div className="grid gap-3">
                            {languageOptions.map((option) => (
                              <SelectionCard
                                key={option.id}
                                active={form.preferredLanguage === option.id}
                                onClick={() => setForm((current) => ({ ...current, preferredLanguage: option.id }))}
                                title={isAr ? option.labelAr : option.labelEn}
                                subtitle={isAr ? option.labelEn : option.labelAr}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("profile.type")}</p>
                          <div className="grid gap-3">
                            {typeOptions.map((option) => (
                              <SelectionCard
                                key={option.id || "any-type"}
                                active={form.preferredType === option.id}
                                onClick={() => setForm((current) => ({ ...current, preferredType: option.id }))}
                                title={isAr ? option.labelAr : option.labelEn}
                                subtitle={isAr ? option.labelEn : option.labelAr}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("profile.system")}</p>
                          <div className="grid gap-3">
                            {systemOptions.map((option) => (
                              <SelectionCard
                                key={option.id || "any-system"}
                                active={form.preferredSystem === option.id}
                                onClick={() => setForm((current) => ({ ...current, preferredSystem: option.id }))}
                                title={isAr ? option.labelAr : option.labelEn}
                                subtitle={isAr ? option.labelEn : option.labelAr}
                                isRtl={isRtl}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    {message && (
                      <div className={`flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 ${isRtl ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                        <CheckCircle2 size={16} />
                        <span className="font-cairo">{message}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
              <h2 className={`mb-4 flex items-center gap-2 font-bold text-[#1a3a5c] font-cairo ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <GraduationCap size={18} className="text-[#d4a843]" />
                {t("profile.shortlist")} ({universities.length})
              </h2>
              {loading && <div className="h-20 rounded-xl bg-gray-50 animate-pulse" />}
              {!loading && universities.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
                  <GraduationCap size={36} className="mx-auto mb-3 text-gray-200" />
                  <p className="mb-4 text-sm text-gray-400 font-cairo">{t("profile.noShortlist")}</p>
                  <Link
                    href="/universities"
                    className="inline-block rounded-xl bg-[#1a3a5c] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    {t("hero.ctaBrowse")}
                  </Link>
                </div>
              )}
              {!loading && universities.map((university) => (
                <div
                  key={university.id}
                  className={`mb-3 flex items-center justify-between rounded-2xl border border-gray-100 p-4 last:mb-0 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a3a5c]/5">
                      <GraduationCap size={18} className="text-[#1a3a5c]" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <Link
                        href={`/universities/${university.slug}`}
                        className="text-sm font-bold text-[#1a3a5c] font-cairo hover:text-[#d4a843]"
                      >
                        {isAr ? university.name_ar : university.name_en}
                      </Link>
                      <p className={`flex items-center gap-1 text-xs text-gray-400 font-cairo ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                        <MapPin size={10} />
                        {isAr ? university.location_ar : university.location_en}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromShortlist(university.id)}
                    className="text-gray-300 transition-colors hover:text-red-400"
                  >
                    <BookmarkX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`rounded-[28px] bg-[#1a3a5c] p-6 text-white shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t("profile.engine")}</p>
                  <p className="mt-2 font-bold font-cairo">{t("profile.currentProfile")}</p>
                  <p className="mt-2 text-sm text-blue-200 font-cairo leading-relaxed">
                    {profile
                      ? t("profile.profilePowered")
                      : t("profile.profileEmpty")}
                  </p>
                </div>
                <BadgeCheck className="text-[#d4a843] shrink-0" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <SummaryPill label={isAr ? "المسار" : "Track"} value={isAr ? (tracks.find((item) => item.id === form.track)?.labelAr ?? "") : (tracks.find((item) => item.id === form.track)?.labelEn ?? "")} />
                <SummaryPill label={isAr ? "الميزانية" : "Budget"} value={isAr ? (budgets.find((item) => item.id === form.budget)?.labelAr ?? "") : (budgets.find((item) => item.id === form.budget)?.labelEn ?? "")} />
                <SummaryPill label={isAr ? "الموقع" : "Location"} value={isAr ? (locations.find((item) => item.id === form.preferredLocation)?.labelAr ?? form.preferredLocation) : (locations.find((item) => item.id === form.preferredLocation)?.labelEn ?? form.preferredLocation)} />
                <SummaryPill label={isAr ? "الاهتمامات" : "Interests"} value={form.interests.length ? (isAr ? `${form.interests.length} مختار` : `${form.interests.length} selected`) : ""} />
              </div>

              <Link
                href={`/universities?${recommendationQuery}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#d4a843] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b8922a]"
              >
                {t("profile.showResults")}
              </Link>
              <Link
                href="/onboarding"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                {t("profile.fullExperience")}
              </Link>
            </div>

            <div className={`rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
              <h2 className="mb-4 font-bold text-[#1a3a5c] font-cairo">{t("profile.snapshot")}</h2>
              <div className="space-y-3 text-sm text-gray-500 font-cairo">
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span>{t("profile.score")}</span>
                  <strong className="text-[#1a3a5c]">{form.score || "—"}</strong>
                </div>
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span>{t("profile.mobility")}</span>
                  <strong className="text-[#1a3a5c]">
                    {isAr ? (mobilityOptions.find((item) => item.id === form.mobilityPreference)?.labelAr || "—") : (mobilityOptions.find((item) => item.id === form.mobilityPreference)?.labelEn || "—")}
                  </strong>
                </div>
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span>{t("details.language")}</span>
                  <strong className="text-[#1a3a5c]">
                    {isAr ? (languageOptions.find((item) => item.id === form.preferredLanguage)?.labelAr || "—") : (languageOptions.find((item) => item.id === form.preferredLanguage)?.labelEn || "—")}
                  </strong>
                </div>
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span>{isAr ? "النوع" : "Type"}</span>
                  <strong className="text-[#1a3a5c]">
                    {isAr ? (typeOptions.find((item) => item.id === form.preferredType)?.labelAr || "—") : (typeOptions.find((item) => item.id === form.preferredType)?.labelEn || "—")}
                  </strong>
                </div>
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span>{isAr ? "النظام" : "System"}</span>
                  <strong className="text-[#1a3a5c]">
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
