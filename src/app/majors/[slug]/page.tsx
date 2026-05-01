import { Metadata } from "next";
import { notFound } from "next/navigation";
// ... existing imports

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const major = await getMajorBySlug(slug);

  if (!major) return {};

  const title = `دراسة ${major.name_ar} في مصر | ${major.name_en}`;
  const description = `اكتشف تخصص ${major.name_ar}: مجالات العمل، الجامعات المتاحة، والرواتب المتوقعة في مصر. كل ما تحتاج لمعرفته على UniGuide.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/majors/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/majors/${slug}`,
      type: "website",
      images: [
        {
          url: "/og-major.png",
          alt: major.name_en,
        },
      ],
    },
  };
}
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getMajorBySlug, getMajorUniversities } from "@/lib/majors";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  ChevronLeft,
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
import { LocalizedHeading, LocalizedText, LocalizedParagraph } from "@/components/layout/LocalizedText";

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

export default async function MajorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const major = await getMajorBySlug(slug);
  if (!major) notFound();

  const [bestUniversities, allUniversities] = await Promise.all([
    getMajorUniversities(major.id, "ranking"),
    getMajorUniversities(major.id, "tuition"),
  ]);

  const cat = categoryLabels[major.category] ?? categoryLabels.other;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs 
          items={[
            { label: "التخصصات / Majors", href: "/majors" },
            { label: major.name_ar }
          ]} 
        />

        {/* Hero */}
        <header className="mb-10 pb-8 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="bg-blue p-4 rounded-2xl flex-shrink-0 shadow-lg">
              <span className="text-3xl">{cat.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-amber uppercase tracking-wider font-cairo">
                  {cat.ar} / {cat.en}
                </span>
              </div>
              <h1 className="text-3xl font-black text-blue dark:text-white font-cairo mt-1">
                {major.name_ar}
              </h1>
              <p className="text-text-secondary font-cairo text-lg">{major.name_en}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary font-cairo flex-wrap">
                <span className="flex items-center gap-1 bg-card-bg px-3 py-1 rounded-full border border-border">
                  <Clock size={14} className="text-amber" />
                  {major.duration_years} <LocalizedText tKey="details.years" />
                </span>
                {bestUniversities.length > 0 && (
                  <span className="flex items-center gap-1 bg-card-bg px-3 py-1 rounded-full border border-border">
                    <GraduationCap size={14} className="text-amber" />
                    {bestUniversities.length} جامعة متاحة / Universities
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
                <div className="flex items-center gap-3 text-blue dark:text-white">
                  <div className="bg-amber p-2 rounded-xl text-white">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <LocalizedHeading tKey="details.bestUnis" className="text-xl font-bold font-cairo leading-tight" />
                    <LocalizedParagraph tKey="details.bestUnisDesc" className="text-xs text-text-secondary/80 font-cairo" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bestUniversities.slice(0, 4).map((um) => {
                  const uni = um.university as University;
                  return (
                    <Link
                      key={um.id}
                      href={`/universities/${uni.slug}`}
                      className="group relative bg-card-bg rounded-3xl p-6 border border-border hover:border-amber/40 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden border border-border">
                          {uni.logo_url ? (
                             <img src={uni.logo_url} alt={uni.name_en} className="w-8 h-8 object-contain" />
                          ) : (
                            <GraduationCap size={24} className="text-blue dark:text-amber" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-cairo bg-blue/10 text-blue dark:text-blue-light">
                              {uni.type}
                            </span>
                            {uni.ranking_egypt && (
                              <span className="text-[10px] font-bold text-text-secondary font-cairo flex items-center gap-1">
                                <BadgeCheck size={12} className="text-amber" />
                                #{uni.ranking_egypt} في مصر / in Egypt
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-blue dark:text-white font-cairo group-hover:text-amber transition-colors">
                            {uni.name_ar}
                          </h3>
                          <p className="text-xs text-text-secondary/80 font-cairo mb-3">{uni.name_en}</p>
                          
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                             <div className="flex items-center gap-3">
                                {um.min_score && (
                                  <div className="text-center">
                                    <p className="text-[10px] text-text-secondary/80 font-cairo"><LocalizedText tKey="details.minScore" /></p>
                                    <p className="text-sm font-black text-blue dark:text-white font-cairo">{um.min_score}%</p>
                                  </div>
                                )}
                             </div>
                             {um.tuition_per_year != null && (
                               <div className="text-left">
                                 <p className="text-[10px] text-text-secondary/80 font-cairo"><LocalizedText tKey="details.tuition" /></p>
                                 <p className="text-sm font-black text-amber font-cairo">
                                   {um.tuition_per_year === 0 ? "مجاني / Free" : `${um.tuition_per_year.toLocaleString()} ${um.currency ?? "EGP"}`}
                                 </p>
                               </div>
                             )}
                          </div>
                        </div>
                        <div className="absolute top-6 left-6 text-amber/20 group-hover:text-amber transition-colors">
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
                <section className="bg-card-bg rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-amber" />
                  <div className="flex items-center gap-3 mb-4 text-blue dark:text-white">
                    <BookOpen size={22} className="text-amber" />
                    <h2 className="text-xl font-bold font-cairo"><LocalizedText tKey="details.about" /></h2>
                  </div>
                  {major.description_ar && (
                    <p className="text-text-primary font-cairo leading-relaxed mb-4 text-lg">
                      {major.description_ar}
                    </p>
                  )}
                  {major.description_en && (
                    <p className="text-text-secondary text-sm leading-relaxed border-t border-border pt-4 italic">
                      {major.description_en}
                    </p>
                  )}
                </section>
              )}

              {/* All Universities List */}
              <section className="bg-card-bg rounded-3xl p-8 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3 text-blue dark:text-white">
                    <MapPin size={22} className="text-amber" />
                    <LocalizedHeading tKey="details.allUnis" className="text-xl font-bold font-cairo" />
                  </div>
                </div>

                {allUniversities.length === 0 ? (
                  <div className="text-center py-10 bg-cream/50 rounded-2xl border border-dashed border-border">
                    <LocalizedParagraph tKey="common.noResults" className="text-sm text-text-secondary/80 font-cairo" />
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
                          className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-amber/40 hover:bg-amber/5 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-card-bg flex items-center justify-center flex-shrink-0 border border-border">
                               {uni.logo_url ? (
                                 <img src={uni.logo_url} alt={uni.name_en} className="w-6 h-6 object-contain" />
                               ) : (
                                <GraduationCap size={18} className="text-blue dark:text-white" />
                               )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-blue dark:text-white font-cairo group-hover:text-amber transition-colors">
                                {uni.name_ar}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-text-secondary/80 font-cairo flex-wrap">
                                <span className="flex items-center gap-1">
                                  <MapPin size={10} />
                                  {uni.location_ar} / {uni.location_en}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {um.tuition_per_year != null && (
                              <p className="text-sm font-black text-amber font-cairo">
                                {um.tuition_per_year === 0 ? "Free" : `${um.tuition_per_year.toLocaleString()} ${um.currency ?? "EGP"}`}
                              </p>
                            )}
                            {um.min_score != null && (
                              <p className="text-[10px] text-text-secondary/80 font-cairo">
                                {um.min_score}%
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
                <section className="bg-blue rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase size={22} className="text-amber" />
                    <LocalizedHeading tKey="details.futureCareer" className="text-lg font-bold font-cairo" />
                  </div>
                  <div className="space-y-3">
                    {major.career_paths.map((path) => (
                      <div
                        key={path}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                        <span className="text-sm font-medium font-cairo">{path}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Help Card */}
              <div className="bg-card-bg rounded-3xl p-6 border border-border shadow-sm text-center">
                 <div className="w-12 h-12 bg-amber/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber">
                   <GraduationCap size={24} />
                 </div>
                 <LocalizedHeading tKey="details.needHelp" className="font-bold text-blue dark:text-white font-cairo mb-2" />
                 <LocalizedParagraph tKey="details.helpDesc" className="text-xs text-text-secondary/80 font-cairo mb-4" />
                 <Link href="/onboarding" className="block w-full bg-blue text-white py-2.5 rounded-xl text-sm font-bold font-cairo hover:bg-blue-light transition-colors">
                    <LocalizedText tKey="details.tryEngine" />
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
