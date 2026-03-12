"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight, Sparkles, GraduationCap } from "lucide-react";

type Step = "track" | "score" | "interests" | "budget" | "result";

const tracks = [
  { id: "science", label_ar: "علمي", label_en: "Science", emoji: "🔬" },
  { id: "math",    label_ar: "رياضي", label_en: "Math",   emoji: "📐" },
  { id: "arts",    label_ar: "أدبي",  label_en: "Arts",   emoji: "📚" },
  { id: "ig",      label_ar: "نظام دولي (IG)", label_en: "International (IG)", emoji: "🌍" },
  { id: "american",label_ar: "نظام أمريكي",  label_en: "American",  emoji: "🇺🇸" },
  { id: "french",  label_ar: "نظام فرنسي",   label_en: "French",    emoji: "🇫🇷" },
];

const interests = [
  { id: "medicine",         label_ar: "طب",          emoji: "🏥" },
  { id: "engineering",      label_ar: "هندسة",       emoji: "⚙️" },
  { id: "computer_science", label_ar: "علوم حاسب",  emoji: "💻" },
  { id: "business",         label_ar: "تجارة",       emoji: "💼" },
  { id: "arts",             label_ar: "آداب وفنون",  emoji: "🎨" },
  { id: "law",              label_ar: "حقوق",        emoji: "⚖️" },
  { id: "pharmacy",         label_ar: "صيدلة",       emoji: "💊" },
  { id: "architecture",     label_ar: "عمارة",       emoji: "🏛️" },
  { id: "media",            label_ar: "إعلام",       emoji: "📡" },
  { id: "science",          label_ar: "علوم",        emoji: "🔬" },
];

interface FormState {
  track: string;
  score: string;
  interests: string[];
  budget: string;
}

const STEPS: Step[] = ["track", "score", "interests", "budget", "result"];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("track");
  const [form, setForm] = useState<FormState>({
    track: "",
    score: "",
    interests: [],
    budget: "",
  });

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const next = () => setStep(STEPS[stepIndex + 1]);
  const prev = () => setStep(STEPS[stepIndex - 1]);

  const toggleInterest = (id: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter((x) => x !== id)
        : [...f.interests, id],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 font-cairo mb-2">
              <span>الخطوة {stepIndex + 1} من {STEPS.length}</span>
              <span>Step {stepIndex + 1} of {STEPS.length}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#d4a843] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {/* Step: Track */}
            {step === "track" && (
              <div>
                <GraduationCap size={32} className="text-[#d4a843] mb-4" />
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">ما هو قسمك؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">What's your academic track?</p>
                <div className="grid grid-cols-2 gap-3">
                  {tracks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setForm((f) => ({ ...f, track: t.id }))}
                      className={`p-3 rounded-xl border text-right transition-all font-cairo ${
                        form.track === t.id
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <span className="text-xl">{t.emoji}</span>
                      <p className="text-sm font-semibold text-[#1a3a5c] mt-1">{t.label_ar}</p>
                      <p className="text-xs text-gray-400">{t.label_en}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Score */}
            {step === "score" && (
              <div>
                <span className="text-3xl mb-4 block">📊</span>
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">كام درجتك؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">What's your Thanaweya Amma score? (% percentage)</p>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.score}
                  onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
                  placeholder="مثال: 85.5"
                  className="w-full text-center text-3xl font-black text-[#1a3a5c] border-b-2 border-[#d4a843] bg-transparent py-3 focus:outline-none font-cairo"
                />
                <p className="text-xs text-gray-400 font-cairo text-center mt-2">%</p>
              </div>
            )}

            {/* Step: Interests */}
            {step === "interests" && (
              <div>
                <Sparkles size={32} className="text-[#d4a843] mb-4" />
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">إيه اهتماماتك؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">What fields interest you? (اختار أكتر من واحد)</p>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => toggleInterest(i.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-right transition-all font-cairo ${
                        form.interests.includes(i.id)
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <span>{i.emoji}</span>
                      <span className="text-sm font-semibold text-[#1a3a5c]">{i.label_ar}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Budget */}
            {step === "budget" && (
              <div>
                <span className="text-3xl mb-4 block">💰</span>
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-1">ميزانيتك السنوية؟</h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">What's your annual tuition budget? (EGP)</p>
                <div className="space-y-3">
                  {[
                    { val: "0-50000",       label_ar: "أقل من ٥٠ ألف",        label_en: "Under 50K EGP" },
                    { val: "50000-150000",  label_ar: "٥٠ ألف - ١٥٠ ألف",    label_en: "50K - 150K EGP" },
                    { val: "150000-300000", label_ar: "١٥٠ ألف - ٣٠٠ ألف",   label_en: "150K - 300K EGP" },
                    { val: "300000+",       label_ar: "أكتر من ٣٠٠ ألف",      label_en: "300K+ EGP" },
                  ].map((b) => (
                    <button
                      key={b.val}
                      onClick={() => setForm((f) => ({ ...f, budget: b.val }))}
                      className={`w-full p-4 rounded-xl border text-right transition-all font-cairo flex justify-between items-center ${
                        form.budget === b.val
                          ? "border-[#d4a843] bg-[#d4a843]/5"
                          : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}
                    >
                      <span className="font-bold text-[#1a3a5c] text-sm">{b.label_ar}</span>
                      <span className="text-xs text-gray-400">{b.label_en}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Result */}
            {step === "result" && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#d4a843]/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-[#d4a843]" />
                </div>
                <h2 className="text-xl font-black text-[#1a3a5c] font-cairo mb-2">
                  تمام! بنحلل بياناتك...
                </h2>
                <p className="text-sm text-gray-400 font-cairo mb-6">
                  Analyzing your profile to find the best matches
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-right mb-6 space-y-2">
                  <p className="text-xs text-gray-500 font-cairo">القسم: <strong>{tracks.find(t => t.id === form.track)?.label_ar}</strong></p>
                  {form.score && <p className="text-xs text-gray-500 font-cairo">الدرجة: <strong>{form.score}%</strong></p>}
                  <p className="text-xs text-gray-500 font-cairo">الاهتمامات: <strong>{form.interests.length} مجالات</strong></p>
                  {form.budget && <p className="text-xs text-gray-500 font-cairo">الميزانية: <strong>{form.budget} EGP</strong></p>}
                </div>
                <a
                  href={`/universities?${new URLSearchParams({ track: form.track, score: form.score, budget: form.budget }).toString()}`}
                  className="block w-full bg-[#1a3a5c] text-white font-bold py-3 rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo"
                >
                  اعرض النتائج المقترحة ←
                </a>
                <p className="text-xs text-gray-400 font-cairo mt-2">Show Recommended Results</p>
              </div>
            )}

            {/* Navigation */}
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
                ) : <div />}

                <button
                  onClick={next}
                  disabled={
                    (step === "track" && !form.track) ||
                    (step === "interests" && form.interests.length === 0)
                  }
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
