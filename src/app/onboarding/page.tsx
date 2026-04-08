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
import type { StudentProfile } from "@/types";
import { ChevronLeft, ChevronRight, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "track" | "score" | "interests" | "budget" | "location" | "preferences" | "result";

const tracks = [
  { id: "science", label_ar: "علمي", label_en: "Science", emoji: "Lab" },
  { id: "math", label_ar: "رياضي", label_en: "Math", emoji: "Math" },
  { id: "arts", label_ar: "أدبي", label_en: "Arts", emoji: "Arts" },
  { id: "ig", label_ar: "IG", label_en: "International", emoji: "IG" },
  { id: "american", label_ar: "أمريكي", label_en: "American", emoji: "US" },
  { id: "french", label_ar: "فرنسي", label_en: "French", emoji: "FR" },
];

const interests = [
  { id: "medicine", label_ar: "طب" },
  { id: "engineering", label_ar: "هندسة" },
  { id: "computer_science", label_ar: "علوم حاسب" },
  { id: "business", label_ar: "إدارة وأعمال" },
  { id: "arts", label_ar: "آداب وفنون" },
  { id: "law", label_ar: "حقوق" },
  { id: "pharmacy", label_ar: "صيدلة" },
  { id: "architecture", label_ar: "عمارة" },
  { id: "media", label_ar: "إعلام" },
  { id: "science", label_ar: "علوم" },
];

const budgets = [
  { val: "0-50000", label_ar: "أقل من 50 ألف", label_en: "Under 50K EGP" },
  { val: "50000-150000", label_ar: "50 ألف - 150 ألف", label_en: "50K - 150K EGP" },
  { val: "150000-300000", label_ar: "150 ألف - 300 ألف", label_en: "150K - 300K EGP" },
  { val: "300000+", label_ar: "أكثر من 300 ألف", label_en: "300K+ EGP" },
];

const locations = [
  { id: "Cairo", label_ar: "القاهرة" },
  { id: "Giza", label_ar: "الجيزة" },
  { id: "New Cairo", label_ar: "القاهرة الجديدة" },
  { id: "Sheikh Zayed", label_ar: "الشيخ زايد" },
  { id: "Alexandria", label_ar: "الإسكندرية" },
];

const mobilityOptions = [
  { id: "same_city", label_ar: "نفس المدينة فقط", label_en: "Same city only" },
  { id: "nearby", label_ar: "مدينة قريبة", label_en: "Nearby city is fine" },
  { id: "anywhere", label_ar: "أي مكان مناسب", label_en: "Open to relocate" },
];

const languageOptions = [
  { id: "arabic", label_ar: "عربي", label_en: "Arabic" },
  { id: "english", label_ar: "إنجليزي", label_en: "English" },
  { id: "bilingual", label_ar: "ثنائي اللغة", label_en: "Bilingual" },
];

const typeOptions = [
  { id: "", label_ar: "أي نوع", label_en: "Any type" },
  { id: "public", label_ar: "حكومية", label_en: "Public" },
  { id: "private", label_ar: "خاصة", label_en: "Private" },
  { id: "international", label_ar: "دولية", label_en: "International" },
];

const systemOptions = [
  { id: "", label_ar: "أي نظام", label_en: "Any system" },
  { id: "egyptian", label_ar: "مصري", label_en: "Egyptian" },
  { id: "american", label_ar: "أمريكي", label_en: "American" },
  { id: "british", label_ar: "بريطاني", label_en: "British" },
  { id: "french", label_ar: "فرنسي", label_en: "French" },
];

interface FormState {
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

const EMPTY_FORM: FormState = {
  track: "",
  score: "",
  interests: [],
  budget: "",
  preferredLocation: "",
  mobilityPreference: "nearby",
  preferredLanguage: "",
  preferredType: "",
  preferredSystem: "",
};

const STEPS: Step[] = ["track", "score", "interests", "budget", "location", "preferences", "result"];

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState<Step>("track");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) {
        if (active) setLoadingProfile(false);
        return;
      }

      const { data } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (active && data) {
        setForm(hydrateFormFromProfile(data as Partial<StudentProfile>));
      }
      if (active) setLoadingProfile(false);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [supabase]);

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const queryString = useMemo(() => buildRecommendationQuery(form), [form]);
  const scoreValue = Number.parseFloat(form.score || "70");
  const boundedScore = Number.isFinite(scoreValue) ? Math.max(0, Math.min(100, scoreValue)) : 70;
  const scoreMeterStyle = {
    background: `conic-gradient(#d4a843 0deg ${boundedScore * 3.6}deg, rgba(26,58,92,0.1) ${boundedScore * 3.6}deg 360deg)`,
  };

  const next = () => setStep(STEPS[stepIndex + 1]);
  const prev = () => setStep(STEPS[stepIndex - 1]);

  const toggleInterest = (id: string) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(id)
        ? current.interests.filter((item) => item !== id)
        : [...current.interests, id],
    }));
  };

  const nextDisabled =
    (step === "track" && !form.track) ||
    (step === "interests" && form.interests.length === 0) ||
    (step === "budget" && !form.budget) ||
    (step === "location" && !form.preferredLocation);

  async function handleShowResults() {
    setSaving(true);
    setStatusMessage("");

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (user) {
      const payload = {
        user_id: user.id,
        ...buildStudentProfilePayload(form),
      };

      const { error } = await supabase
        .from("student_profiles")
        .upsert(payload, { onConflict: "user_id" });

      if (error) {
        setStatusMessage(error.message);
        setSaving(false);
        return;
      }
    }

    router.push(`/universities?${queryString}`);
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f2]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="h-40 bg-gray-50 rounded-2xl animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 font-cairo mb-2">
              <span>الخطوة {stepIndex + 1} من {STEPS.length}</span>
              <span>Step {stepIndex + 1} of {STEPS.length}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#d4a843] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {step === "track" && (
              <div>
                <GraduationCap size={32} className="text-[#d4a843] mb-4" />
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">ما هو نظامك الدراسي؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">We use this to remove majors that do not fit your academic path.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => setForm((current) => ({ ...current, track: track.id }))}
                      className={`p-3 rounded-xl border text-right transition-all font-cairo ${
                        form.track === track.id
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#d4a843]">{track.emoji}</span>
                      <p className="text-sm font-semibold text-[#1a3a5c] mt-1">{track.label_ar}</p>
                      <p className="text-xs text-gray-400">{track.label_en}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "score" && (
              <div>
                <span className="text-3xl mb-4 block">Score</span>
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">ما درجتك الحالية أو المتوقعة؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">The meter reacts instantly so you can feel where your score sits before we rank universities.</p>

                <div className="grid gap-6 md:grid-cols-[0.9fr,1.1fr] md:items-center">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div
                        className="h-44 w-44 rounded-full transition-all duration-700 ease-out"
                        style={scoreMeterStyle}
                      />
                      <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
                        <span className="text-xs uppercase tracking-[0.25em] text-gray-400">Score</span>
                        <span className="text-4xl font-black text-[#1a3a5c]">{form.score || "70"}</span>
                        <span className="text-xs text-[#d4a843] font-semibold">Percent</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-gray-100 bg-[#faf7f2] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold text-[#1a3a5c] font-cairo">Academic score meter</p>
                        <p className="text-xs text-gray-400 font-cairo">Adjust it manually or drag the slider.</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a3a5c] shadow-sm">
                        {boundedScore >= 90 ? "Top range" : boundedScore >= 80 ? "Strong range" : boundedScore >= 70 ? "Competitive" : "Building"}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="40"
                      max="100"
                      step="0.5"
                      value={form.score || "70"}
                      onChange={(event) => setForm((current) => ({ ...current, score: event.target.value }))}
                      className="w-full accent-[#d4a843]"
                    />

                    <div className="mt-4 flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={form.score}
                        onChange={(event) => setForm((current) => ({ ...current, score: event.target.value }))}
                        placeholder="Example: 85.5"
                        className="w-32 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center text-lg font-black text-[#1a3a5c] focus:border-[#d4a843] focus:outline-none"
                      />
                      <span className="text-sm text-gray-400 font-cairo">%</span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[11px] text-gray-400">Safer</p>
                        <p className="text-sm font-bold text-[#1a3a5c]">&lt; 75</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[11px] text-gray-400">Competitive</p>
                        <p className="text-sm font-bold text-[#1a3a5c]">75 - 89</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[11px] text-gray-400">Stretch+</p>
                        <p className="text-sm font-bold text-[#1a3a5c]">90+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "interests" && (
              <div>
                <Sparkles size={32} className="text-[#d4a843] mb-4" />
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">ما المجالات التي تريدها؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">Choose more than one so the recommendations stay flexible.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-3 rounded-xl border text-right transition-all font-cairo ${
                        form.interests.includes(interest.id)
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <span className="text-sm font-semibold text-[#1a3a5c]">{interest.label_ar}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "budget" && (
              <div>
                <span className="text-3xl mb-4 block">Budget</span>
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">ما ميزانيتك السنوية؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">This helps us avoid universities that are clearly outside your range.</p>
                <div className="space-y-3">
                  {budgets.map((budget) => (
                    <button
                      key={budget.val}
                      onClick={() => setForm((current) => ({ ...current, budget: budget.val }))}
                      className={`w-full p-4 rounded-xl border text-right transition-all font-cairo flex justify-between items-center ${
                        form.budget === budget.val
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <span className="font-bold text-[#1a3a5c] text-sm">{budget.label_ar}</span>
                      <span className="text-xs text-gray-400">{budget.label_en}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "location" && (
              <div>
                <MapPin size={32} className="text-[#d4a843] mb-4" />
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">أين تفضل الدراسة؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">Location should change the output for every student, not just score and budget.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setForm((current) => ({ ...current, preferredLocation: location.id }))}
                      className={`p-3 rounded-xl border text-right transition-all font-cairo ${
                        form.preferredLocation === location.id
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <span className="text-sm font-semibold text-[#1a3a5c]">{location.label_ar}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {mobilityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setForm((current) => ({ ...current, mobilityPreference: option.id }))}
                      className={`w-full p-3 rounded-xl border text-right transition-all font-cairo ${
                        form.mobilityPreference === option.id
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <p className="text-sm font-semibold text-[#1a3a5c]">{option.label_ar}</p>
                      <p className="text-xs text-gray-400">{option.label_en}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "preferences" && (
              <div>
                <Sparkles size={32} className="text-[#d4a843] mb-4" />
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">ما تفضيلاتك الإضافية؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">These fields help tailor the output for each student instead of showing the same list to everyone.</p>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-[#1a3a5c] font-cairo mb-2">لغة الدراسة المفضلة</p>
                    <div className="grid grid-cols-3 gap-2">
                      {languageOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setForm((current) => ({ ...current, preferredLanguage: option.id }))}
                          className={`p-3 rounded-xl border text-center transition-all font-cairo ${
                            form.preferredLanguage === option.id
                              ? "border-[#d4a843] bg-[#d4a843]/5"
                              : "border-gray-100 hover:border-[#d4a843]/40"
                          }`}
                        >
                          <p className="text-sm font-semibold text-[#1a3a5c]">{option.label_ar}</p>
                          <p className="text-[11px] text-gray-400">{option.label_en}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1a3a5c] font-cairo mb-2">نوع الجامعة</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {typeOptions.map((option) => (
                        <button
                          key={option.id || "any-type"}
                          onClick={() => setForm((current) => ({ ...current, preferredType: option.id }))}
                          className={`p-3 rounded-xl border text-center transition-all font-cairo ${
                            form.preferredType === option.id
                              ? "border-[#d4a843] bg-[#d4a843]/5"
                              : "border-gray-100 hover:border-[#d4a843]/40"
                          }`}
                        >
                          <p className="text-sm font-semibold text-[#1a3a5c]">{option.label_ar}</p>
                          <p className="text-[11px] text-gray-400">{option.label_en}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1a3a5c] font-cairo mb-2">النظام التعليمي</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {systemOptions.map((option) => (
                        <button
                          key={option.id || "any-system"}
                          onClick={() => setForm((current) => ({ ...current, preferredSystem: option.id }))}
                          className={`p-3 rounded-xl border text-center transition-all font-cairo ${
                            form.preferredSystem === option.id
                              ? "border-[#d4a843] bg-[#d4a843]/5"
                              : "border-gray-100 hover:border-[#d4a843]/40"
                          }`}
                        >
                          <p className="text-sm font-semibold text-[#1a3a5c]">{option.label_ar}</p>
                          <p className="text-[11px] text-gray-400">{option.label_en}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "result" && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#d4a843]/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-[#d4a843]" />
                </div>
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-2">النتائج أصبحت شخصية لكل طالب</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">
                  We will save this profile and rank universities and majors around it.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-right mb-6 space-y-2">
                  <p className="text-xs text-gray-500 font-cairo">النظام الدراسي: <strong>{tracks.find((track) => track.id === form.track)?.label_ar}</strong></p>
                  {form.score && <p className="text-xs text-gray-500 font-cairo">الدرجة: <strong>{form.score}%</strong></p>}
                  <p className="text-xs text-gray-500 font-cairo">الاهتمامات: <strong>{form.interests.length} مجالات</strong></p>
                  <p className="text-xs text-gray-500 font-cairo">الميزانية: <strong>{budgets.find((budget) => budget.val === form.budget)?.label_ar}</strong></p>
                  <p className="text-xs text-gray-500 font-cairo">المكان: <strong>{locations.find((location) => location.id === form.preferredLocation)?.label_ar}</strong></p>
                  <p className="text-xs text-gray-500 font-cairo">الحركة: <strong>{mobilityOptions.find((option) => option.id === form.mobilityPreference)?.label_ar}</strong></p>
                  {form.preferredLanguage && <p className="text-xs text-gray-500 font-cairo">لغة الدراسة: <strong>{languageOptions.find((option) => option.id === form.preferredLanguage)?.label_ar}</strong></p>}
                </div>
                {statusMessage && (
                  <p className="text-sm text-red-500 font-cairo mb-3">{statusMessage}</p>
                )}
                <button
                  type="button"
                  onClick={handleShowResults}
                  disabled={saving}
                  className="block w-full bg-[#1a3a5c] text-white font-bold py-3 rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo disabled:opacity-50"
                >
                  {saving ? "جارٍ حفظ الملف..." : "احفظ الملف واعرض النتائج الشخصية ←"}
                </button>
                <p className="text-xs text-gray-400 font-cairo mt-2">Save the profile and show personalized recommendations</p>
              </div>
            )}

            {step !== "result" && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {stepIndex > 0 ? (
                  <button
                    onClick={prev}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#1a3a5c] transition-colors font-cairo"
                  >
                    <ChevronRight size={16} />
                    رجوع
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={next}
                  disabled={nextDisabled}
                  className="flex items-center gap-1 bg-[#d4a843] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#b8922a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-cairo text-sm"
                >
                  التالي
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
