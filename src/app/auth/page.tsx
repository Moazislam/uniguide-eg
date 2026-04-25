"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildStudentProfilePayload } from "@/lib/student-profile";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, LogIn, Sparkles, UserPlus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

type Mode = "signin" | "signup";

const tracks = [
  { id: "science", labelAr: "علمي", labelEn: "Science" },
  { id: "math", labelAr: "رياضي", labelEn: "Math" },
  { id: "arts", labelAr: "أدبي", labelEn: "Arts" },
  { id: "ig", labelAr: "IG", labelEn: "IG" },
  { id: "american", labelAr: "أمريكي", labelEn: "American" },
  { id: "french", labelAr: "فرنسي", labelEn: "French" },
];

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const { t, isRtl, language } = useLanguage();
  const isAr = language === "ar";
  
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!form.email) errors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
    else if (!emailRegex.test(form.email)) errors.email = isAr ? "البريد الإلكتروني غير صحيح" : "Invalid email format";
    
    if (!form.password) errors.password = isAr ? "كلمة المرور مطلوبة" : "Password is required";
    else if (form.password.length < 6) errors.password = isAr ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters";

    if (mode === "signup") {
      if (!form.name) errors.name = isAr ? "الاسم مطلوب" : "Name is required";
      if (!form.phone) errors.phone = isAr ? "رقم الهاتف مطلوب" : "Phone is required";
      else if (!/^01[0125][0-9]{8}$/.test(form.phone)) errors.phone = isAr ? "رقم الهاتف غير صحيح" : "Invalid Egyptian phone number";
      
      if (!form.track) errors.track = isAr ? "يجب اختيار المسار الدراسي" : "Please select an academic track";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const title = useMemo(
    () => mode === "signin" ? t("auth.signinTitle") : t("auth.signupTitle"),
    [mode, t]
  );

  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
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
    if (!validate()) return;
    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
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

    setSuccess(t("auth.success"));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream transition-colors duration-300">
      <div className={`mx-auto grid min-h-screen max-w-7xl items-stretch px-4 py-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-6 ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}>
        <section className={`relative hidden overflow-hidden rounded-[32px] bg-blue dark:bg-blue-dark p-10 text-white lg:flex lg:flex-col lg:justify-between ${isRtl ? 'order-1' : 'order-1'}`}>
          <div className="absolute inset-0">
            <div className={`absolute -top-20 ${isRtl ? '-right-10' : '-left-10'} h-56 w-56 rounded-full bg-amber/18 blur-2xl`} />
            <div className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} h-64 w-64 rounded-full bg-white/8 blur-3xl`} />
          </div>

          <div className={`relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className={`inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <Sparkles size={14} className="text-amber" />
              UniGuide Egypt
            </div>
            <h1 className="mt-8 max-w-md text-5xl font-black leading-tight font-cairo">
              {t("auth.heroTitle")}
              <span className="block text-amber">{t("auth.heroHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/78 font-cairo">
              {t("auth.heroDesc")}
            </p>
          </div>

          <div className="relative z-10 grid gap-3">
            {[t("auth.feat1"), t("auth.feat2"), t("auth.feat3")].map((item) => (
              <div key={item} className={`rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/85 font-cairo ${isRtl ? 'text-right' : 'text-left'}`}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-xl rounded-[32px] border border-border bg-card-bg/92 dark:bg-card-bg/80 p-6 shadow-[0_30px_80px_rgba(14,30,52,0.12)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur">
            <div className={`mb-6 flex items-start justify-between gap-4 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-blue dark:bg-amber text-white dark:text-blue-dark shadow-sm ${isRtl ? 'mr-0' : 'ml-0'}`}>
                  <GraduationCap size={22} />
                </div>
                <h2 className="mt-4 text-2xl font-black text-blue dark:text-text-primary font-cairo">{title}</h2>
                <p className="mt-2 text-sm text-text-secondary font-cairo">
                  {mode === "signin" ? t("auth.signinDesc") : t("auth.signupDesc")}
                </p>
              </div>

              <div className="rounded-2xl bg-cream dark:bg-blue/20 p-1 shrink-0">
                {(["signin", "signup"] as Mode[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMode(item);
                      setError("");
                      setSuccess("");
                      setValidationErrors({});
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      mode === item
                        ? "bg-blue dark:bg-amber text-white dark:text-blue-dark shadow-sm"
                        : "text-text-secondary hover:text-blue dark:hover:text-amber"
                    }`}
                  >
                    {item === "signin" ? t("nav.login") : t("nav.signup")}
                  </button>
                ))}
              </div>
            </div>

            {success && (
              <div className={`mb-4 rounded-2xl border border-green-100 bg-green-50/10 px-4 py-3 text-sm text-green-500 font-cairo ${isRtl ? 'text-right' : 'text-left'}`}>
                {success}
              </div>
            )}
            {error && (
              <div className={`mb-4 rounded-2xl border border-red-100/20 bg-red-50/10 px-4 py-3 text-sm text-red-500 font-cairo ${isRtl ? 'text-right' : 'text-left'}`}>
                {error}
              </div>
            )}

            <div className="grid gap-4">
              {mode === "signup" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary font-cairo">{t("auth.name")}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => set("name", event.target.value)}
                      placeholder={t("auth.namePlaceholder")}
                      className={`w-full rounded-2xl border ${validationErrors.name ? 'border-red-300 ring-4 ring-red-50/10' : 'border-border'} bg-cream dark:bg-blue/10 px-4 py-3 text-sm focus:border-amber focus:outline-none transition-all text-text-primary ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                    {validationErrors.name && <p className="mt-1 text-[10px] text-red-500 font-bold">{validationErrors.name}</p>}
                  </div>
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary font-cairo">{t("auth.phone")}</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => set("phone", event.target.value)}
                      placeholder="01xxxxxxxxx"
                      className={`w-full rounded-2xl border ${validationErrors.phone ? 'border-red-300 ring-4 ring-red-50/10' : 'border-border'} bg-cream dark:bg-blue/10 px-4 py-3 text-sm focus:border-amber focus:outline-none transition-all text-text-primary ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                    {validationErrors.phone && <p className="mt-1 text-[10px] text-red-500 font-bold">{validationErrors.phone}</p>}
                  </div>
                </div>
              )}

              <div className={isRtl ? 'text-right' : 'text-left'}>
                <label className="mb-1.5 block text-xs font-semibold text-text-secondary font-cairo">{t("auth.email")}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => set("email", event.target.value)}
                  placeholder="example@email.com"
                  className={`w-full rounded-2xl border ${validationErrors.email ? 'border-red-300 ring-4 ring-red-50/10' : 'border-border'} bg-cream dark:bg-blue/10 px-4 py-3 text-sm focus:border-amber focus:outline-none transition-all text-text-primary ${isRtl ? 'text-right' : 'text-left'}`}
                />
                {validationErrors.email && <p className="mt-1 text-[10px] text-red-500 font-bold">{validationErrors.email}</p>}
              </div>

              <div className={isRtl ? 'text-right' : 'text-left'}>
                <label className="mb-1.5 block text-xs font-semibold text-text-secondary font-cairo">{t("auth.password")}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => set("password", event.target.value)}
                    placeholder={mode === "signup" ? t("auth.passwordHint") : "••••••••"}
                    className={`w-full rounded-2xl border ${validationErrors.password ? 'border-red-300 ring-4 ring-red-50/10' : 'border-border'} bg-cream dark:bg-blue/10 px-4 py-3 ${isRtl ? 'pr-4 pl-11 text-right' : 'pl-4 pr-11 text-left'} text-sm focus:border-amber focus:outline-none transition-all text-text-primary`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-text-secondary`}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {validationErrors.password && <p className="mt-1 text-[10px] text-red-500 font-bold">{validationErrors.password}</p>}
              </div>

              {mode === "signup" && (
                <div className="grid gap-4 sm:grid-cols-[1fr,0.8fr]">
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary font-cairo">{t("auth.track")}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {tracks.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => set("track", form.track === track.id ? "" : track.id)}
                          className={`rounded-2xl border px-1 py-3 text-[10px] font-bold transition-all ${
                            form.track === track.id
                              ? "border-amber bg-amber/10 text-blue dark:text-amber"
                              : validationErrors.track ? "border-red-200 bg-red-50/10 text-text-secondary" : "border-border bg-cream dark:bg-blue/10 text-text-secondary hover:border-amber/50"
                          }`}
                        >
                          {isAr ? track.labelAr : track.labelEn}
                        </button>
                      ))}
                    </div>
                    {validationErrors.track && <p className="mt-1 text-[10px] text-red-500 font-bold">{validationErrors.track}</p>}
                  </div>
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary font-cairo">{t("auth.score")}</label>
                    <div className="rounded-[24px] border border-border bg-cream dark:bg-blue/10 p-3">
                      <div className={`flex items-end justify-between gap-3 ${isRtl ? 'flex-row' : 'flex-row'}`}>
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                          <p className="text-[10px] text-text-secondary">Academic score</p>
                          <p className="text-2xl font-black text-blue dark:text-amber">{form.score || "—"}</p>
                        </div>
                        <span className="text-xs text-amber font-semibold">%</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        step="0.5"
                        value={form.score || "70"}
                        onChange={(event) => set("score", event.target.value)}
                        className="mt-3 w-full accent-amber"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={mode === "signin" ? handleSignIn : handleSignUp}
                disabled={loading}
                className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue dark:bg-amber px-5 py-3.5 text-sm font-bold text-white dark:text-blue-dark transition-colors hover:bg-blue-light dark:hover:bg-amber-dark disabled:opacity-50 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {mode === "signin" ? <LogIn size={16} /> : <UserPlus size={16} />}
                {loading ? t("common.loading") : mode === "signin" ? t("auth.signinBtn") : t("auth.signupBtn")}
              </button>
            </div>

            <div className={`mt-6 rounded-2xl bg-cream dark:bg-blue/10 px-4 py-3 text-xs text-text-secondary font-cairo ${isRtl ? 'text-right' : 'text-left'}`}>
              {mode === "signin" ? t("auth.switchSignin") : t("auth.switchSignup")}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
