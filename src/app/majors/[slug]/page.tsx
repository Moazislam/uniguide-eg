import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getMajorBySlug, getMajorUniversities } from "@/lib/majors";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  ChevronRight,
  MapPin,
  Clock,
  DollarSign,
  Trophy,
  BadgeCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import type { University, UniversityMajor } from "@/types";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

const categoryLabels: Record<string, { ar: string; en: string; emoji: string }> = {
  medicine:         { ar: "طب",             en: "Medicine",         emoji: "🏥" },
  engineering:      { ar: "هندسة",          en: "Engineering",      emoji: "⚙️" },
  business:         { ar: "تجارة وإدارة",   en: "Business",         emoji: "💼" },
  computer_science: { ar: "علوم حاسب",      en: "Computer Science", emoji: "💻" },
  arts:             { ar: "آداب وفنون",      en: "Arts",             emoji: "🎨" },
  science:          { ar: "علوم",           en: "Science",          emoji: "🔬" },
  law:              { ar: "حقوق",           en: "Law",              emoji: "⚖️" },
  pharmacy:         { ar: "صيدلة",          en: "Pharmacy",         emoji: "💊" },
  dentistry:        { ar: "طب أسنان",        en: "Dentistry",        emoji: "🦷" },
  architecture:     { ar: "عمارة",          en: "Architecture",     emoji: "🏛️" },
  media:            { ar: "إعلام",          en: "Media",            emoji: "📡" },
  education:        { ar: "تربية",          en: "Education",        emoji: "📚" },
  other:            { ar: "أخرى",           en: "Other",            emoji: "🎓" },
};

const typeLabels: Record<string, { ar: string; color: string }> = {
  public: { ar: "حكومية", color: "bg-blue-50 text-blue-700" },
  private: { ar: "خاصة", color: "bg-amber-50 text-amber-700" },
  international: { ar: "دولية", color: "bg-green-50 text-green-700" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const major = await getMajorBySlug(slug);
  if (!major) return { title: "Major not found — UniGuide" };
  return {
    title: `${major.name_ar} / ${major.name_en} — UniGuide`,
    description: major.description_en ?? `Explore ${major.name_en} universities and career paths in Egypt.`,
  };
}

export default async function MajorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const major = await getMajorBySlug(slug);
  if (!major) notFound();

  // Get best universities (sorted by ranking)
  const bestUniversities = await getMajorUniversities(major.id, "ranking");
  // Get all universities (sorted by tuition for the full list)
  const allUniversities = await getMajorUniversities(major.id, "tuition");

  const cat = categoryLabels[major.category] ?? categoryLabels.other;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs 
          items={[
            { label: "التخصصات", href: "/majors" },
            { label: major.name_ar }
          ]} 
        />

        {/* Hero */}
        <header className="mb-10 pb-8 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="bg-[#1a3a5c] p-4 rounded-2xl flex-shrink-0 shadow-lg">
              <span className="text-3xl">{cat.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#d4a843] uppercase tracking-wider font-cairo">
                  {cat.ar} / {cat.en}
                </span>
                {bestUniversities.length > 0 && (
                  <span className="bg-[#d4a843]/10 text-[#d4a843] text-[10px] px-2 py-0.5 rounded-full font-bold font-cairo flex items-center gap-1">
                    <Trophy size={10} /> أكثر التخصصات طلباً
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black text-[#1a3a5c] font-cairo mt-1">
                {major.name_ar}
              </h1>
              <p className="text-gray-500 font-cairo text-lg">{major.name_en}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 font-cairo flex-wrap">
                <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-100">
                  <Clock size={14} className="text-[#d4a843]" />
                  {major.duration_years} سنوات / {major.duration_years} years
                </span>
                {bestUniversities.length > 0 && (
                  <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-100">
                    <GraduationCap size={14} className="text-[#d4a843]" />
                    {bestUniversities.length} جامعة متاحة
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10">

          {/* Best Universities Highlight */}
          {bestUniversities.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-[#1a3a5c]">
                  <div className="bg-[#d4a843] p-2 rounded-xl text-white">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-cairo leading-tight">أفضل الجامعات لهذا التخصص</h2>
                    <p className="text-xs text-gray-400 font-cairo">Best Ranked Universities for this Major</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bestUniversities.slice(0, 4).map((um, index) => {
                  const uni = um.university as University;
                  return (
                    <Link
                      key={um.id}
                      href={`/universities/${uni.slug}`}
                      className="group relative bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden border border-gray-50">
                          {uni.logo_url ? (
                             <img src={uni.logo_url} alt={uni.name_en} className="w-8 h-8 object-contain" />
                          ) : (
                            <GraduationCap size={24} className="text-[#1a3a5c]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-cairo ${typeLabels[uni.type]?.color}`}>
                              {typeLabels[uni.type]?.ar}
                            </span>
                            {uni.ranking_egypt && (
                              <span className="text-[10px] font-bold text-gray-400 font-cairo flex items-center gap-1">
                                <BadgeCheck size={12} className="text-[#d4a843]" />
                                #{uni.ranking_egypt} في مصر
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-[#1a3a5c] font-cairo group-hover:text-[#d4a843] transition-colors">
                            {uni.name_ar}
                          </h3>
                          <p className="text-xs text-gray-400 font-cairo mb-3">{uni.name_en}</p>
                          
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                             <div className="flex items-center gap-3">
                                {um.min_score && (
                                  <div className="text-center">
                                    <p className="text-[10px] text-gray-400 font-cairo">أدنى درجة</p>
                                    <p className="text-sm font-black text-[#1a3a5c] font-cairo">{um.min_score}%</p>
                                  </div>
                                )}
                             </div>
                             {um.tuition_per_year != null && (
                               <div className="text-left">
                                 <p className="text-[10px] text-gray-400 font-cairo">المصاريف السنوية</p>
                                 <p className="text-sm font-black text-[#d4a843] font-cairo">
                                   {um.tuition_per_year === 0 ? "مجاني" : `${um.tuition_per_year.toLocaleString()} ${um.currency ?? "EGP"}`}
                                 </p>
                               </div>
                             )}
                          </div>
                        </div>
                        <div className="absolute top-6 left-6 text-[#d4a843]/20 group-hover:text-[#d4a843] transition-colors">
                          <Star size={24} fill="currentColor" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {(major.description_ar || major.description_en) && (
                <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-[#d4a843]" />
                  <div className="flex items-center gap-3 mb-4 text-[#1a3a5c]">
                    <BookOpen size={22} className="text-[#d4a843]" />
                    <h2 className="text-xl font-bold font-cairo">عن هذا التخصص</h2>
                  </div>
                  {major.description_ar && (
                    <p className="text-gray-700 font-cairo leading-relaxed mb-4 text-lg">
                      {major.description_ar}
                    </p>
                  )}
                  {major.description_en && (
                    <p className="text-gray-500 text-sm leading-relaxed border-t pt-4 italic">
                      {major.description_en}
                    </p>
                  )}
                </section>
              )}

              {/* All Universities List */}
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3 text-[#1a3a5c]">
                    <MapPin size={22} className="text-[#d4a843]" />
                    <h2 className="text-xl font-bold font-cairo">جميع الجامعات المتاحة ({allUniversities.length})</h2>
                  </div>
                </div>

                {allUniversities.length === 0 ? (
                  <div className="text-center py-10 bg-[#faf7f2] rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 font-cairo">
                      سيتم إضافة الجامعات قريباً — Data coming soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allUniversities.map((um) => {
                      const uni = um.university as University;
                      if (!uni) return null;
                      return (
                        <Link
                          key={um.id}
                          href={`/universities/${uni.slug}`}
                          className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-[#d4a843]/40 hover:bg-[#fffdf9] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-gray-100">
                               {uni.logo_url ? (
                                 <img src={uni.logo_url} alt={uni.name_en} className="w-6 h-6 object-contain" />
                               ) : (
                                <GraduationCap size={18} className="text-[#1a3a5c]" />
                               )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1a3a5c] font-cairo group-hover:text-[#d4a843] transition-colors">
                                {uni.name_ar}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400 font-cairo flex-wrap">
                                <span className="flex items-center gap-1">
                                  <MapPin size={10} />
                                  {uni.location_ar}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded-md font-bold ${typeLabels[uni.type]?.color}`}>
                                  {typeLabels[uni.type]?.ar}
                                </span>
                                {um.language && (
                                  <span className="bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-500">
                                    {um.language === "arabic" ? "عربي" : um.language === "english" ? "إنجليزي" : "ثنائي"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {um.tuition_per_year != null && (
                              <p className="text-sm font-black text-[#d4a843] font-cairo">
                                {um.tuition_per_year === 0 ? "مجاني" : `${um.tuition_per_year.toLocaleString()} ${um.currency ?? "EGP"}`}
                              </p>
                            )}
                            {um.min_score != null && (
                              <p className="text-[10px] text-gray-400 font-cairo">
                                التنسيق: {um.min_score}%
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Career paths */}
              {major.career_paths && major.career_paths.length > 0 && (
                <section className="bg-[#1a3a5c] rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase size={22} className="text-[#d4a843]" />
                    <h2 className="text-lg font-bold font-cairo">مستقبلك المهني</h2>
                  </div>
                  <div className="space-y-3">
                    {major.career_paths.map((path) => (
                      <div
                        key={path}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4a843] flex-shrink-0" />
                        <span className="text-sm font-medium font-cairo">{path}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Help Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                 <div className="w-12 h-12 bg-[#fff9ee] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#d4a843]">
                   <GraduationCap size={24} />
                 </div>
                 <h3 className="font-bold text-[#1a3a5c] font-cairo mb-2">محتاج مساعدة؟</h3>
                 <p className="text-xs text-gray-400 font-cairo mb-4">نقدر نساعدك تختار الجامعة الأنسب لمجموعك وميزانيتك.</p>
                 <Link href="/onboarding" className="block w-full bg-[#1a3a5c] text-white py-2.5 rounded-xl text-sm font-bold font-cairo hover:bg-[#2a5a8c] transition-colors">
                    جرب المحرك الذكي
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
