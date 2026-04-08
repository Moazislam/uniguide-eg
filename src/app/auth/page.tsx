"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildStudentProfilePayload } from "@/lib/student-profile";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, LogIn, Sparkles, UserPlus } from "lucide-react";

type Mode = "signin" | "signup";

const tracks = [
  { id: "science", label: "علمي" },
  { id: "math", label: "رياضي" },
  { id: "arts", label: "أدبي" },
  { id: "ig", label: "IG" },
  { id: "american", label: "أمريكي" },
  { id: "french", label: "فرنسي" },
];

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    name: "",
    track: "",
    score: "",
  });

  const title = useMemo(
    () =>
      mode === "signin"
        ? "ادخل وكمّل رحلتك الجامعية"
        : "أنشئ حسابك وابدأ ملف المطابقة",
    [mode]
  );

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (signInError) {
      setError(signInError.message);
    } else {
      router.push("/profile");
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, phone: form.phone } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("student_profiles").upsert(
        {
          user_id: data.user.id,
          ...buildStudentProfilePayload({
            track: form.track,
            score: form.score,
          }),
        },
        { onConflict: "user_id" }
      );
    }

    setSuccess("تم إنشاء حسابك. راجع بريدك الإلكتروني لتأكيد الحساب ثم ارجع لإكمال ملفك.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-stretch px-4 py-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-6">
        <section className="relative hidden overflow-hidden rounded-[32px] bg-[#173754] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -left-10 h-56 w-56 rounded-full bg-[#d4a843]/18 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Sparkles size={14} className="text-[#d4a843]" />
              UniGuide Egypt
            </div>
            <h1 className="mt-8 max-w-md text-5xl font-black leading-tight font-cairo">
              الجامعة المناسبة
              <span className="block text-[#d4a843]">تبدأ من قرار أوضح</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/78 font-cairo">
              ابحث، طابق، وقارن في تجربة واحدة أبسط. ملفك الشخصي هو نقطة البداية التي تخلّي النتائج
              أقرب لدرجاتك وميزانيتك واهتماماتك.
            </p>
          </div>

          <div className="relative z-10 grid gap-3">
            {[
              "ابنِ ملفًا شخصيًا يحفظ تفضيلاتك",
              "احصل على نتائج مخصصة حسب الدرجة والمكان والميزانية",
              "قارن بين الجامعات قبل اتخاذ القرار النهائي",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/85 font-cairo">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-xl rounded-[32px] border border-white/80 bg-white/92 p-6 shadow-[0_30px_80px_rgba(14,30,52,0.12)] backdrop-blur">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a3a5c] text-white shadow-sm">
                  <GraduationCap size={22} />
                </div>
                <h2 className="mt-4 text-2xl font-black text-[#1a3a5c] font-cairo">{title}</h2>
                <p className="mt-2 text-sm text-gray-500 font-cairo">
                  {mode === "signin"
                    ? "سجّل الدخول للوصول إلى ملفك الشخصي ونتائجك المحفوظة."
                    : "أنشئ حسابًا واحدًا فقط ثم عدّل ملف المطابقة وقتما تريد."}
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf7f2] p-1">
                {(["signin", "signup"] as Mode[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMode(item);
                      setError("");
                      setSuccess("");
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      mode === item
                        ? "bg-[#1a3a5c] text-white shadow-sm"
                        : "text-gray-500 hover:text-[#1a3a5c]"
                    }`}
                  >
                    {item === "signin" ? "دخول" : "حساب جديد"}
                  </button>
                ))}
              </div>
            </div>

            {success && (
              <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 font-cairo">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 font-cairo">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              {mode === "signup" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 font-cairo">الاسم</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => set("name", event.target.value)}
                      placeholder="محمد أحمد"
                      className="w-full rounded-2xl border border-gray-200 bg-[#faf7f2] px-4 py-3 text-sm focus:border-[#d4a843] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 font-cairo">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => set("phone", event.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full rounded-2xl border border-gray-200 bg-[#faf7f2] px-4 py-3 text-sm focus:border-[#d4a843] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600 font-cairo">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => set("email", event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-2xl border border-gray-200 bg-[#faf7f2] px-4 py-3 text-sm focus:border-[#d4a843] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600 font-cairo">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => set("password", event.target.value)}
                    placeholder={mode === "signup" ? "6 أحرف على الأقل" : "••••••••"}
                    className="w-full rounded-2xl border border-gray-200 bg-[#faf7f2] px-4 py-3 pl-11 text-sm focus:border-[#d4a843] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="grid gap-4 sm:grid-cols-[1fr,0.8fr]">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 font-cairo">المسار الدراسي</label>
                    <div className="grid grid-cols-3 gap-2">
                      {tracks.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => set("track", form.track === track.id ? "" : track.id)}
                          className={`rounded-2xl border px-3 py-3 text-xs font-bold transition-all ${
                            form.track === track.id
                              ? "border-[#d4a843] bg-[#fff7e7] text-[#1a3a5c]"
                              : "border-gray-200 bg-[#faf7f2] text-gray-500 hover:border-[#d4a843]/50"
                          }`}
                        >
                          {track.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 font-cairo">الدرجة الحالية</label>
                    <div className="rounded-[24px] border border-gray-200 bg-[#faf7f2] p-3">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-400">Academic score</p>
                          <p className="text-2xl font-black text-[#1a3a5c]">{form.score || "—"}</p>
                        </div>
                        <span className="text-xs text-[#d4a843] font-semibold">%</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        step="0.5"
                        value={form.score || "70"}
                        onChange={(event) => set("score", event.target.value)}
                        className="mt-3 w-full accent-[#d4a843]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={mode === "signin" ? handleSignIn : handleSignUp}
                disabled={
                  loading ||
                  !form.email ||
                  !form.password ||
                  (mode === "signup" && form.password.length < 6)
                }
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a3a5c] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2a5a8c] disabled:opacity-50"
              >
                {mode === "signin" ? <LogIn size={16} /> : <UserPlus size={16} />}
                {loading ? "جارٍ التنفيذ..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[#faf7f2] px-4 py-3 text-xs text-gray-500 font-cairo">
              {mode === "signin"
                ? "بمجرد الدخول ستجد ملفك الشخصي ونتائج المطابقة محفوظة كما تركتها."
                : "لسنا بحاجة إلى خطوات إضافية هنا. الحساب يُنشأ من شاشة واحدة ثم يمكنك إكمال التفاصيل من ملفك الشخصي."}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
