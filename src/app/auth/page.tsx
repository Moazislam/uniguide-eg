"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildStudentProfilePayload } from "@/lib/student-profile";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";

type Mode = "signin" | "signup";
type Step = 1 | 2;

const tracks = [
  { id: "science", label: "علمي", emoji: "🔬" },
  { id: "math",    label: "رياضي", emoji: "📐" },
  { id: "arts",    label: "أدبي",  emoji: "📚" },
  { id: "ig",      label: "دولي IG", emoji: "🌍" },
  { id: "american",label: "أمريكي", emoji: "🇺🇸" },
  { id: "french",  label: "فرنسي",  emoji: "🇫🇷" },
];

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ email: "", password: "", phone: "", name: "", track: "", score: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSignIn = async () => {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) setError(error.message);
    else router.push("/profile");
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name, phone: form.phone } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("student_profiles").upsert({
        user_id: data.user.id,
        ...buildStudentProfilePayload({
          track: form.track,
          score: form.score,
        }),
      }, { onConflict: "user_id" });
    }
    setSuccess("تم إنشاء حسابك! ✅ تحقق من بريدك الإلكتروني لتأكيد الحساب.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1a3a5c] flex items-center justify-center mx-auto mb-3">
            <span className="text-[#d4a843] font-bold text-xl font-cairo">U</span>
          </div>
          <h1 className="text-2xl font-black text-[#1a3a5c] font-cairo">UniGuide</h1>
          <p className="text-sm text-gray-500 font-cairo mt-1">
            {mode === "signin" ? "سجّل دخولك وابدأ رحلتك" : "إنشاء حساب جديد"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); setStep(1); setError(""); setSuccess(""); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all font-cairo ${mode === m ? "bg-white text-[#1a3a5c] shadow-sm" : "text-gray-400"}`}>
                {m === "signin" ? "تسجيل الدخول" : "حساب جديد"}
              </button>
            ))}
          </div>

          {success && <div className="bg-green-50 border border-green-100 text-green-700 text-sm font-cairo rounded-xl p-3 mb-4 text-center">{success}</div>}
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-cairo rounded-xl p-3 mb-4 text-center">{error}</div>}

          {mode === "signin" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1.5">البريد الإلكتروني *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-[#faf7f2] font-cairo" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1.5">كلمة المرور *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-[#faf7f2] font-cairo" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button onClick={handleSignIn} disabled={loading || !form.email || !form.password}
                className="w-full bg-[#1a3a5c] text-white font-bold py-3 rounded-xl hover:bg-[#2a5a8c] transition-colors disabled:opacity-50 font-cairo">
                {loading ? "جاري الدخول..." : "تسجيل الدخول ←"}
              </button>
            </div>
          )}

          {mode === "signup" && step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1.5">البريد الإلكتروني *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-[#faf7f2] font-cairo" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1.5">كلمة المرور *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)}
                    placeholder="٦ أحرف على الأقل"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-[#faf7f2] font-cairo" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1.5">
                  رقم الهاتف <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-[#faf7f2] font-cairo" />
              </div>
              <button onClick={() => setStep(2)} disabled={!form.email || form.password.length < 6}
                className="w-full bg-[#1a3a5c] text-white font-bold py-3 rounded-xl hover:bg-[#2a5a8c] transition-colors disabled:opacity-50 font-cairo flex items-center justify-center gap-2">
                التالي <ChevronLeft size={16} />
              </button>
            </div>
          )}

          {mode === "signup" && step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-[#1a3a5c]"><ChevronRight size={18} /></button>
                <div className="flex-1 h-1 bg-gray-100 rounded-full"><div className="h-full w-full bg-[#d4a843] rounded-full" /></div>
                <span className="text-xs text-gray-400 font-cairo">٢/٢</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1.5">
                  الاسم الكامل <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="محمد أحمد..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-[#faf7f2] font-cairo" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-2">
                  قسمك الدراسي <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {tracks.map((t) => (
                    <button key={t.id} onClick={() => set("track", form.track === t.id ? "" : t.id)}
                      className={`p-2 rounded-xl border text-center transition-all font-cairo text-xs ${form.track === t.id ? "border-[#d4a843] bg-[#d4a843]/5 text-[#1a3a5c] font-bold" : "border-gray-100 hover:border-[#d4a843]/40 text-gray-500"}`}>
                      <div className="text-lg mb-0.5">{t.emoji}</div>
                      <div>{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 font-cairo mb-1.5">
                  درجة الثانوية % <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <input type="number" min="0" max="100" value={form.score} onChange={(e) => set("score", e.target.value)}
                  placeholder="مثال: 85.5"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] bg-[#faf7f2] font-cairo" />
              </div>
              <button onClick={handleSignUp} disabled={loading}
                className="w-full bg-[#d4a843] text-white font-bold py-3 rounded-xl hover:bg-[#b8922a] transition-colors disabled:opacity-50 font-cairo">
                {loading ? "جاري الإنشاء..." : "إنشاء الحساب ✓"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 font-cairo mt-4">
          بتسجيلك، بتوافق على شروط الاستخدام وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
}
