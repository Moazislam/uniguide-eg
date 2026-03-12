"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronLeft, ChevronRight, User, Mail, Lock, Phone } from "lucide-react";

type Mode = "signin" | "signup";
type Step = 1 | 2;

const tracks = [
  { id: "science",  label: "علمي",     emoji: "🔬" },
  { id: "math",     label: "رياضي",    emoji: "📐" },
  { id: "arts",     label: "أدبي",     emoji: "📚" },
  { id: "ig",       label: "IG / دولي",emoji: "🌍" },
  { id: "american", label: "أمريكي",   emoji: "🇺🇸" },
  { id: "french",   label: "فرنسي",    emoji: "🇫🇷" },
];

const governorates = [
  "القاهرة","الجيزة","الإسكندرية","الدقهلية","البحيرة","الفيوم",
  "الغربية","الإسماعيلية","المنوفية","المنيا","القليوبية","سوهاج",
  "الأقصر","أسوان","بني سويف","بورسعيد","دمياط","الشرقية",
  "كفر الشيخ","مطروح","الوادي الجديد","شمال سيناء","جنوب سيناء",
  "السويس","قنا","أسيوط","البحر الأحمر",
];

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [track, setTrack] = useState("");
  const [score, setScore] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [gradYear, setGradYear] = useState("2026");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/profile");
      else setCheckingSession(false);
    });
  }, []);

  if (checkingSession) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const handleSignIn = async () => {
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("البريد أو كلمة المرور غلط");
    else router.push("/profile");
    setLoading(false);
  };

  const handleStep1 = () => {
    setError("");
    if (!name.trim()) return setError("من فضلك اكتب اسمك");
    if (!email.trim()) return setError("من فضلك اكتب بريدك الإلكتروني");
    if (password.length < 6) return setError("كلمة المرور لازم تكون ٦ أحرف على الأقل");
    setStep(2);
  };

  const handleSignUp = async () => {
    setError(""); setLoading(true);
    if (!track) { setError("من فضلك اختار قسمك"); setLoading(false); return; }
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, phone: phone || null } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("student_profiles").upsert({
        user_id: data.user.id,
        track,
        score: score ? parseFloat(score) : null,
        updated_at: new Date().toISOString(),
      });
    }
    setSuccess("✅ تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 py-10">
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

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setStep(1); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all font-cairo ${
                mode === m ? "bg-white text-[#1a3a5c] shadow-sm" : "text-gray-400"
              }`}>
              {m === "signin" ? "تسجيل الدخول" : "حساب جديد"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {error && <div className="bg-red-50 text-red-600 text-sm font-cairo p-3 rounded-xl mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 text-sm font-cairo p-3 rounded-xl mb-4">{success}</div>}

          {/* SIGN IN */}
          {mode === "signin" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-9 pl-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">كلمة المرور</label>
                <div className="relative">
                  <Lock size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-9 pl-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button onClick={handleSignIn} disabled={loading}
                className="w-full bg-[#1a3a5c] text-white font-bold py-3 rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo disabled:opacity-60">
                {loading ? "جاري الدخول..." : "تسجيل الدخول ←"}
              </button>
            </div>
          )}

          {/* SIGN UP STEP 1 */}
          {mode === "signup" && step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400 font-cairo">الخطوة ١ من ٢</p>
                <div className="flex gap-1">
                  <div className="w-8 h-1 bg-[#d4a843] rounded-full" />
                  <div className="w-8 h-1 bg-gray-200 rounded-full" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">الاسم بالكامل *</label>
                <div className="relative">
                  <User size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="محمد أحمد"
                    className="w-full pr-9 pl-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com"
                    className="w-full pr-9 pl-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">كلمة المرور *</label>
                <div className="relative">
                  <Lock size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="٦ أحرف على الأقل"
                    className="w-full pr-9 pl-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">
                  رقم الهاتف <span className="text-gray-300 font-normal">(اختياري)</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01xxxxxxxxx"
                    className="w-full pr-9 pl-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2]" />
                </div>
              </div>
              <button onClick={handleStep1}
                className="w-full bg-[#1a3a5c] text-white font-bold py-3 rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo flex items-center justify-center gap-2">
                التالي <ChevronLeft size={16} />
              </button>
            </div>
          )}

          {/* SIGN UP STEP 2 */}
          {mode === "signup" && step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400 font-cairo">الخطوة ٢ من ٢ — بياناتك الدراسية</p>
                <div className="flex gap-1">
                  <div className="w-8 h-1 bg-[#d4a843] rounded-full" />
                  <div className="w-8 h-1 bg-[#d4a843] rounded-full" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-2 block">قسمك *</label>
                <div className="grid grid-cols-3 gap-2">
                  {tracks.map((t) => (
                    <button key={t.id} onClick={() => setTrack(t.id)}
                      className={`p-2 rounded-xl border text-center transition-all font-cairo ${
                        track === t.id ? "border-[#d4a843] bg-[#d4a843]/10" : "border-gray-100 hover:border-[#d4a843]/40"
                      }`}>
                      <div className="text-lg">{t.emoji}</div>
                      <div className="text-xs font-semibold text-[#1a3a5c] mt-0.5">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">
                  درجة الثانوية % <span className="text-gray-300 font-normal">(اختياري)</span>
                </label>
                <input type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)}
                  placeholder="مثال: 85.5"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">
                  المحافظة <span className="text-gray-300 font-normal">(اختياري)</span>
                </label>
                <select value={governorate} onChange={e => setGovernorate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4a843] font-cairo bg-[#faf7f2] text-gray-600">
                  <option value="">اختار المحافظة</option>
                  {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 font-cairo mb-1 block">سنة التخرج</label>
                <div className="flex gap-2">
                  {["2025","2026","2027"].map(y => (
                    <button key={y} onClick={() => setGradYear(y)}
                      className={`flex-1 py-2 text-sm rounded-xl border font-cairo font-semibold transition-all ${
                        gradYear === y ? "border-[#d4a843] bg-[#d4a843]/10 text-[#1a3a5c]" : "border-gray-100 text-gray-400"
                      }`}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)}
                  className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-400 hover:border-gray-300 transition-colors font-cairo">
                  <ChevronRight size={16} /> رجوع
                </button>
                <button onClick={handleSignUp} disabled={loading}
                  className="flex-1 bg-[#d4a843] text-white font-bold py-3 rounded-xl hover:bg-[#b8922a] transition-colors font-cairo disabled:opacity-60">
                  {loading ? "جاري الإنشاء..." : "إنشاء الحساب ✓"}
                </button>
              </div>
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
