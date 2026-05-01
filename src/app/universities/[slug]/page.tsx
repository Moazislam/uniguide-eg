import { Metadata } from "next";
import { notFound } from "next/navigation";
// ... existing imports

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) return {};

  const title = `${university.name_ar} | ${university.name_en}`;
  const description = `تعرف على ${university.name_ar}: المصروفات، الكليات، التنسيق، وطرق التقديم. قارن بينها وبين الجامعات الأخرى على UniGuide.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/universities/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/universities/${slug}`,
      type: "website",
      images: [
        {
          url: university.cover_url || "/og-university.png",
          alt: university.name_en,
        },
      ],
    },
  };
}
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompareButton from "@/components/compare/CompareButton";
import ShortlistButton from "@/components/universities/ShortlistButton";
import { getUniversityBySlug } from "@/lib/universities";
import { getUniversityMajors } from "@/lib/majors";
import { getFacultiesByUniversityId } from "@/lib/faculties";
import FacultiesSection from "@/components/universities/FacultiesSection";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { LocalizedHeading, LocalizedText, LocalizedParagraph } from "@/components/layout/LocalizedText";
import {
  MapPin,
  Globe,
  GraduationCap,
  BadgeCheck,
  FileText,
  Star,
  Award,
} from "lucide-react";
import type { University, UniversityMajor, Faculty } from "@/types";

const typeLabels: Record<string, { ar: string; en: string }> = {
  public: { ar: "حكومية", en: "Public" },
  private: { ar: "خاصة", en: "Private" },
  international: { ar: "دولية", en: "International" },
};

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) notFound();

  let majors: any[] = [];
  let faculties: any[] = [];
  let dataError = false;

  try {
    const [majorsData, facultiesData] = await Promise.all([
      getUniversityMajors(university.id),
      getFacultiesByUniversityId(university.id),
    ]);
    majors = majorsData;
    faculties = facultiesData;
  } catch (err) {
    console.error("Error loading university details:", err);
    dataError = true;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1">
        {dataError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm font-cairo flex items-center gap-3">
              <span>⚠️</span>
              <p>
                حدث خطأ أثناء تحميل بعض تفاصيل الكليات. قد تكون المعلومات المعروضة أدناه غير مكتملة.
                <br />
                Some faculty details could not be loaded. Information below might be incomplete.
              </p>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Breadcrumbs 
            items={[
              { label: "الجامعات / Universities", href: "/universities" },
              { label: university.name_ar }
            ]} 
          />
        </div>
        
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue to-blue-light text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white shadow flex items-center justify-center flex-shrink-0">
              {university.logo_url ? (
                <img
                  src={university.logo_url}
                  alt={university.name_en}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <GraduationCap size={28} className="text-blue" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-amber/20 text-amber text-xs font-semibold px-2 py-0.5 rounded-full font-cairo">
                  {university.type}
                </span>
                {university.ranking_egypt && (
                  <span className="flex items-center gap-1 text-xs text-blue-100/80 font-cairo">
                    <BadgeCheck size={12} className="text-amber" />#
                    {university.ranking_egypt} في مصر / in Egypt
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-cairo">
                {university.name_ar}
              </h1>
              <p className="text-blue-100/80 text-sm font-cairo">
                {university.name_en}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <section className="bg-card-bg rounded-3xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-blue dark:text-white">
                  <FileText size={22} className="text-amber" />
                  <LocalizedHeading tKey="details.about" className="text-xl font-bold font-cairo" />
                </div>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                   {/* We use localized text blocks for description too */}
                   <p className="text-text-secondary font-cairo leading-relaxed whitespace-pre-line">
                     {university.description_ar}
                   </p>
                   <p className="text-text-secondary/80 font-cairo text-sm leading-relaxed whitespace-pre-line border-t border-border pt-4 mt-4">
                     {university.description_en}
                   </p>
                </div>
              </section>

              {/* Admission */}
              {(university.admission_national || university.admission_ig || university.admission_american || university.admission_french || university.admission_german) && (
                <section className="bg-card-bg rounded-3xl p-8 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-6 text-blue dark:text-white">
                    <BadgeCheck size={22} className="text-amber" />
                    <LocalizedHeading tKey="details.admission" className="text-xl font-bold font-cairo" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {university.admission_national && (
                      <div className="p-4 rounded-2xl bg-blue/5 border border-blue/10">
                        <h4 className="font-bold text-blue dark:text-blue-light text-xs uppercase tracking-wider mb-2 font-cairo"><LocalizedText tKey="details.thanaweya" /></h4>
                        <p className="text-text-secondary font-cairo text-sm leading-relaxed whitespace-pre-line">
                          {university.admission_national}
                        </p>
                      </div>
                    )}
                    {university.admission_ig && (
                      <div className="p-4 rounded-2xl bg-amber/5 border border-amber/10">
                        <h4 className="font-bold text-blue dark:text-amber text-xs uppercase tracking-wider mb-2 font-cairo"><LocalizedText tKey="details.ig" /></h4>
                        <p className="text-text-secondary font-cairo text-sm leading-relaxed whitespace-pre-line">
                          {university.admission_ig}
                        </p>
                      </div>
                    )}
                    {university.admission_american && (
                      <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-900/20">
                        <h4 className="font-bold text-blue dark:text-purple-400 text-xs uppercase tracking-wider mb-2 font-cairo"><LocalizedText tKey="details.american" /></h4>
                        <p className="text-text-secondary font-cairo text-sm leading-relaxed whitespace-pre-line">
                          {university.admission_american}
                        </p>
                      </div>
                    )}
                    {(university.admission_french || university.admission_german) && (
                      <div className="p-4 rounded-2xl bg-cream/50 border border-border">
                        <h4 className="font-bold text-blue dark:text-white text-xs uppercase tracking-wider mb-2 font-cairo">Other Diplomas / شهادات أخرى</h4>
                        <p className="text-text-secondary font-cairo text-sm leading-relaxed whitespace-pre-line">
                          {[university.admission_french, university.admission_german].filter(Boolean).join('\n\n')}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Faculties Section */}
              <FacultiesSection 
              faculties={faculties} 
              universityMajors={majors} 
              universitySlug={slug}
            />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card-bg rounded-3xl p-6 border border-border shadow-sm">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary/80 font-bold uppercase font-cairo">Location</p>
                      <p className="text-sm font-bold text-blue dark:text-white font-cairo">
                        {university.location_ar} / {university.location_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber/5 flex items-center justify-center text-amber flex-shrink-0">
                      <Star size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary/80 font-bold uppercase font-cairo">System</p>
                      <p className="text-sm font-bold text-blue dark:text-white font-cairo capitalize">
                        {university.system}
                      </p>
                    </div>
                  </div>

                  {university.website && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <Globe size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-text-secondary/80 font-bold uppercase font-cairo">Website</p>
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-blue hover:underline font-cairo block truncate"
                        >
                          {university.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-3">
                  <ShortlistButton universityId={university.id} />
                  <CompareButton universityId={university.id} />
                </div>
              </div>

              {/* Accreditation */}
              {university.accreditations && university.accreditations.length > 0 && (
                <div className="bg-blue rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Award size={22} className="text-amber" />
                    <LocalizedHeading tKey="details.accreditations" className="font-bold font-cairo" />
                  </div>
                  <div className="space-y-3">
                    {university.accreditations.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <BadgeCheck size={16} className="text-amber" />
                        <span className="text-xs font-medium font-cairo">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compare Promo */}
              <div className="bg-gradient-to-br from-cream to-amber/5 rounded-3xl p-6 border border-amber/20">
                <LocalizedHeading tKey="details.compareCta" className="font-black text-blue dark:text-white font-cairo mb-2" />
                <LocalizedParagraph tKey="details.compareDesc" className="text-xs text-text-secondary font-cairo mb-4 leading-relaxed" />
                <a
                  href="/compare"
                  className="inline-flex items-center justify-center w-full bg-blue text-white py-3 rounded-xl text-xs font-bold hover:bg-amber-dark transition-colors font-cairo"
                >
                  <LocalizedText tKey="details.goToCompare" /> →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
