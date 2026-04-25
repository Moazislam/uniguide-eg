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

const typeLabels: Record<string, string> = {
  public: "حكومية",
  private: "خاصة",
  international: "دولية",
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

  const universityMajors = await getMajorUniversities(major.id);

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
            <div className="bg-[#1a3a5c] p-4 rounded-2xl flex-shrink-0">
              <span className="text-3xl">{cat.emoji}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#d4a843] uppercase tracking-wider font-cairo">
                {cat.ar} / {cat.en}
              </span>
              <h1 className="text-3xl font-black text-[#1a3a5c] font-cairo mt-1">
                {major.name_ar}
              </h1>
              <p className="text-gray-500 font-cairo text-lg">{major.name_en}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 font-cairo flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-[#d4a843]" />
                  {major.duration_years} سنوات / {major.duration_years} years
                </span>
                {universityMajors.length > 0 && (
                  <span className="flex items-center gap-1">
                    <GraduationCap size={14} className="text-[#d4a843]" />
                    {universityMajors.length} جامعة تقدمه
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">

          {/* Description */}
          {(major.description_ar || major.description_en) && (
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-[#1a3a5c]">
                <BookOpen size={22} className="text-[#d4a843]" />
                <h2 className="text-xl font-bold font-cairo">تعريف التخصص / Definition</h2>
              </div>
              {major.description_ar && (
                <p className="text-gray-700 font-cairo leading-relaxed mb-3">
                  {major.description_ar}
                </p>
              )}
              {major.description_en && (
                <p className="text-gray-500 text-sm leading-relaxed border-t pt-3">
                  {major.description_en}
                </p>
              )}
            </section>
          )}

          {/* Career paths */}
          {major.career_paths && major.career_paths.length > 0 && (
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5 text-[#1a3a5c]">
                <Briefcase size={22} className="text-[#d4a843]" />
                <h2 className="text-xl font-bold font-cairo">فرص العمل / Career Paths</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {major.career_paths.map((path) => (
                  <div
                    key={path}
                    className="flex items-center gap-3 p-4 bg-[#faf7f2] rounded-xl border border-gray-50"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#d4a843] flex-shrink-0" />
                    <span className="text-sm font-semibold text-[#1a3a5c] font-cairo">{path}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Universities offering this major */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5 text-[#1a3a5c]">
              <MapPin size={22} className="text-[#d4a843]" />
              <h2 className="text-xl font-bold font-cairo">
                الجامعات التي تقدم هذا التخصص ({universityMajors.length})
              </h2>
            </div>

            {universityMajors.length === 0 ? (
              <p className="text-sm text-gray-400 font-cairo">
                سيتم إضافة الجامعات قريباً — Data coming soon.
              </p>
            ) : (
              <div className="space-y-3">
                {universityMajors.map((um) => {
                  const uni = um.university as University | undefined;
                  if (!uni) return null;
                  return (
                    <Link
                      key={um.id}
                      href={`/universities/${uni.slug}`}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#d4a843]/40 hover:shadow-sm transition-all group"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#1a3a5c] font-cairo group-hover:text-[#d4a843] transition-colors">
                          {uni.name_ar}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-cairo flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {uni.location_ar}
                          </span>
                          <span>{typeLabels[uni.type] ?? uni.type}</span>
                          {um.language && (
                            <span>
                              {um.language === "arabic" ? "عربي" : um.language === "english" ? "إنجليزي" : "ثنائي"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {um.tuition_per_year != null && (
                          <p className="text-sm font-bold text-[#d4a843] font-cairo flex items-center gap-1 justify-end">
                            <DollarSign size={12} />
                            {um.tuition_per_year.toLocaleString()} {um.currency ?? "EGP"}/yr
                          </p>
                        )}
                        {um.min_score != null && (
                          <p className="text-xs text-gray-400 font-cairo">
                            أدنى درجة: {um.min_score}%
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
      </main>

      <Footer />
    </div>
  );
}
