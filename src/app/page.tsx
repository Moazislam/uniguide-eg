import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { BookOpen, ChevronLeft, GitCompareArrows, Search, Sparkles, Target, Wallet } from "lucide-react";

const features = [
  {
    icon: <Search size={20} className="text-[#d4a843]" />,
    titleAr: "استكشف الجامعات",
    titleEn: "Browse Universities",
    description: "فلترة واضحة وسريعة بين الحكومية والخاصة والدولية بدون تشتيت.",
    href: "/universities",
  },
  {
    icon: <Sparkles size={20} className="text-[#d4a843]" />,
    titleAr: "مطابقة مخصصة",
    titleEn: "Personalized Matching",
    description: "نتائج تبنى على درجتك وميزانيتك ومكانك واهتماماتك الفعلية.",
    href: "/onboarding",
  },
  {
    icon: <GitCompareArrows size={20} className="text-[#d4a843]" />,
    titleAr: "مقارنة جانبية",
    titleEn: "Live Compare",
    description: "أضف حتى 3 جامعات وراجع الفروقات الأساسية في شاشة واحدة.",
    href: "/compare",
  },
  {
    icon: <BookOpen size={20} className="text-[#d4a843]" />,
    titleAr: "التخصصات والمسارات",
    titleEn: "Majors & Paths",
    description: "اعرف التخصصات المتاحة وما الذي يمكن أن تقودك إليه بعد الدراسة.",
    href: "/majors",
  },
];

const pillars = [
  {
    icon: <Target size={18} className="text-[#d4a843]" />,
    title: "قرار أوضح",
    text: "نعرض الخيارات الواقعية أولاً ثم نرتبها حسب ملاءمتها لك، لا حسب الشهرة فقط.",
  },
  {
    icon: <Wallet size={18} className="text-[#d4a843]" />,
    title: "ميزانية أذكى",
    text: "النتائج تستبعد الخيارات المبالغ فيها وتبرز البدائل التي ما زالت تناسب أهدافك.",
  },
  {
    icon: <GitCompareArrows size={18} className="text-[#d4a843]" />,
    title: "مقارنة أسرع",
    text: "اجمع الجامعات أثناء التصفح ثم افتح مقارنة مركزة بدل القفز بين صفحات كثيرة.",
  },
];

const steps = [
  "أنشئ ملف المطابقة مرة واحدة",
  "أدخل الدرجة والتفضيلات الأساسية",
  "شاهد الجامعات المناسبة وأفضل التخصصات داخل كل جامعة",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f1e8]">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(212,168,67,0.14),transparent_45%),linear-gradient(180deg,#fdfaf4_0%,#f6f1e8_100%)]" />
            <div className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-[#d4a843]/12 blur-3xl" />
            <div className="absolute right-[-120px] top-10 h-96 w-96 rounded-full bg-[#1a3a5c]/8 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1a3a5c]/10 bg-white/70 px-4 py-2 text-xs font-semibold text-[#1a3a5c] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#d4a843] animate-pulse" />
                Personalized university decisions for Egyptian students
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight text-[#1a3a5c] font-cairo sm:text-5xl lg:text-6xl">
                اختار جامعتك
                <span className="block text-[#d4a843] font-playfair italic">بعقل أهدى ووضوح أكبر</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 font-cairo sm:text-lg">
                UniGuide يجمع لك البحث، المطابقة، والمقارنة في رحلة واحدة. بدل ما تدور في عشرات
                المواقع، خذ نتيجة مرتبة حسب درجتك، ميزانيتك، موقعك، واهتماماتك.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1a3a5c] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-[#264f79]"
                >
                  ابدأ ملف المطابقة
                  <ChevronLeft size={18} />
                </Link>
                <Link
                  href="/universities"
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-[#1a3a5c]/15 bg-white/80 px-8 py-4 text-base font-bold text-[#1a3a5c] transition-colors hover:border-[#d4a843]/40 hover:bg-white"
                >
                  استعرض الجامعات
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {pillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1a3a5c]/6">
                      {pillar.icon}
                    </div>
                    <h2 className="text-sm font-bold text-[#1a3a5c] font-cairo">{pillar.title}</h2>
                    <p className="mt-2 text-xs leading-6 text-gray-500 font-cairo">{pillar.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_80px_rgba(15,36,60,0.12)] backdrop-blur">
                <div className="rounded-[28px] bg-[#173754] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/55">Matching Preview</p>
                      <p className="mt-2 text-2xl font-black font-cairo">ملف واحد، نتائج أذكى</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
                      <p className="text-[11px] text-white/60">Profile fit</p>
                      <p className="text-xl font-black text-[#d4a843]">88%</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {steps.map((step, index) => (
                      <div key={step} className="flex items-start gap-3 rounded-2xl bg-white/6 px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a843] text-sm font-black text-white">
                          {index + 1}
                        </div>
                        <p className="pt-1 text-sm text-white/85 font-cairo">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-100 bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">What changes the ranking</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Score", "Budget", "Location", "Interests", "Language"].map((item) => (
                        <span key={item} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#1a3a5c] shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-gray-100 bg-[#fff9ee] p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Compare mode</p>
                    <p className="mt-3 text-sm leading-7 text-[#1a3a5c] font-cairo">
                      أضف الجامعات أثناء التصفح، ثم افتح شاشة مقارنة جاهزة بدل تدوين الملاحظات يدويًا.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-[32px] bg-[#1a3a5c] px-6 py-8 text-center text-white shadow-sm md:grid-cols-4">
            {[
              { value: "40+", label: "جامعات مصرية" },
              { value: "3", label: "جامعات في المقارنة" },
              { value: "1", label: "ملف شخصي واحد" },
              { value: "100%", label: "نتائج موجهة حسب الطالب" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-black text-[#d4a843]">{item.value}</p>
                <p className="mt-2 text-sm text-blue-100 font-cairo">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black text-[#1a3a5c] font-cairo">رحلة واحدة بدل مواقع كثيرة</h2>
              <p className="mt-2 text-sm text-gray-500 font-cairo">
                كل خطوة في المنصة مصممة لتقليل الحيرة وزيادة وضوح القرار.
              </p>
            </div>
            <Link href="/onboarding" className="text-sm font-semibold text-[#1a3a5c] hover:text-[#d4a843]">
              جرّب التجربة الكاملة
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#d4a843]/30 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf7f2] transition-colors group-hover:bg-[#fff4d9]">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1a3a5c] font-cairo">{feature.titleAr}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{feature.titleEn}</p>
                <p className="mt-4 text-sm leading-7 text-gray-500 font-cairo">{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-[#d4a843]/20 bg-[#fff9ee] py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4a843]">Ready to decide better?</p>
            <h2 className="mt-4 text-3xl font-black text-[#1a3a5c] font-cairo">
              ابدأ بملفك الشخصي ثم دع النظام يرتّب الخيارات لك
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-500 font-cairo">
              ليس الهدف أن تشاهد كل جامعة، بل أن ترى أولاً الخيارات التي تملك فرصة حقيقية ومناسبة لك.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="rounded-2xl bg-[#d4a843] px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#b8922a]"
              >
                ابدأ الآن
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl border border-[#1a3a5c]/15 bg-white px-8 py-3.5 text-base font-bold text-[#1a3a5c] transition-colors hover:border-[#d4a843]/40"
              >
                افتح المقارنة
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
