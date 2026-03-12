import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, GitCompareArrows, Sparkles, BookOpen, ChevronLeft } from "lucide-react";

const features = [
  {
    icon: <Search size={22} className="text-[#d4a843]" />,
    title_ar: "بحث الجامعات",
    title_en: "University Search",
    desc_ar: "ابحث في كل الجامعات المصرية الحكومية والخاصة بفلاتر دقيقة",
    href: "/universities",
  },
  {
    icon: <Sparkles size={22} className="text-[#d4a843]" />,
    title_ar: "مطابقة ذكية",
    title_en: "AI Major Matching",
    desc_ar: "احنا بنحلل درجاتك واهتماماتك وميزانيتك عشان نقترح التخصص الأنسب",
    href: "/onboarding",
  },
  {
    icon: <GitCompareArrows size={22} className="text-[#d4a843]" />,
    title_ar: "مقارنة جنب لجنب",
    title_en: "Side-by-Side Compare",
    desc_ar: "قارن لغاية ٣ جامعات في نفس الوقت — مصروفات، تخصصات، متطلبات قبول",
    href: "/compare",
  },
  {
    icon: <BookOpen size={22} className="text-[#d4a843]" />,
    title_ar: "التخصصات والمسارات",
    title_en: "Majors & Career Paths",
    desc_ar: "استكشف كل التخصصات المتاحة ومساراتها المهنية بالتفصيل",
    href: "/majors",
  },
];

const stats = [
  { value: "+٤٠", label_ar: "جامعة مصرية", label_en: "Egyptian Universities" },
  { value: "٥٠٠ألف+", label_ar: "طالب سنوياً", label_en: "Students Annually" },
  { value: "#١", label_ar: "منصة matching في مصر", label_en: "Matching Platform in Egypt" },
  { value: "صفر", label_ar: "منافس مماثل", label_en: "Comparable Rivals" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* BG decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4a843]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1a3a5c]/5 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
            <div className="inline-flex items-center gap-2 bg-[#1a3a5c]/5 border border-[#1a3a5c]/10 rounded-full px-4 py-1.5 text-sm text-[#1a3a5c] font-cairo mb-6">
              <span className="w-2 h-2 bg-[#d4a843] rounded-full animate-pulse" />
              يطلق قبل موسم نتائج الثانوية 2026 — Launching Before Thanaweya 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a3a5c] leading-tight font-cairo mb-4">
              خليك{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-playfair italic text-[#d4a843]">واثق</span>
                <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#d4a843]/15 rounded" />
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a5c]/70 font-playfair italic mb-6">
              Choose with <span className="text-[#d4a843]">Clarity.</span>
            </h2>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 font-cairo leading-relaxed mb-8">
              كل الجامعات المصرية في مكان واحد. ابحث، قارن، واختار التخصص الصح بناءً على درجاتك، اهتماماتك، وميزانيتك.
              <br />
              <span className="text-sm text-gray-400">Every Egyptian university. Search, compare, and find the right major for you.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/onboarding"
                className="bg-[#1a3a5c] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo text-base flex items-center justify-center gap-2"
              >
                ابدأ مجاناً
                <ChevronLeft size={18} />
              </Link>
              <Link
                href="/universities"
                className="border-2 border-[#1a3a5c] text-[#1a3a5c] font-bold px-8 py-3.5 rounded-xl hover:bg-[#1a3a5c]/5 transition-colors font-cairo text-base"
              >
                استكشف الجامعات / Browse Universities
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────── */}
        <section className="bg-[#1a3a5c] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((s) => (
                <div key={s.label_en}>
                  <p className="text-2xl sm:text-3xl font-black text-[#d4a843] font-cairo">{s.value}</p>
                  <p className="text-sm text-blue-200 font-cairo mt-1">{s.label_ar}</p>
                  <p className="text-xs text-blue-300/60 font-cairo">{s.label_en}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────── */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a3a5c] font-cairo">
              منصة متكاملة لاتخاذ القرار
            </h2>
            <p className="text-gray-500 font-cairo mt-2 text-sm">A Complete Platform for Smart Decisions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[#faf7f2] flex items-center justify-center mb-4 group-hover:bg-[#d4a843]/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm">{f.title_ar}</h3>
                <p className="text-[10px] text-gray-400 font-cairo mb-2">{f.title_en}</p>
                <p className="text-xs text-gray-500 font-cairo leading-relaxed">{f.desc_ar}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="bg-[#d4a843]/10 border-y border-[#d4a843]/20 py-14">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-[#1a3a5c] font-cairo mb-3">
              جاهز تبدأ؟ Ready to Start?
            </h2>
            <p className="text-gray-600 font-cairo text-sm mb-6">
              سجّل واحنا هنساعدك تلاقي الجامعة والتخصص اللي يناسبك تماماً.
            </p>
            <Link
              href="/onboarding"
              className="inline-block bg-[#d4a843] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#b8922a] transition-colors font-cairo"
            >
              ابدأ الآن — Start Now →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
