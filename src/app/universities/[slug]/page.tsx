import { notFound } from "next/navigation";
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

  const [majors, faculties] = await Promise.all([
    getUniversityMajors(university.id),
    getFacultiesByUniversityId(university.id),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Breadcrumbs 
            items={[
              { label: "الجامعات / Universities", href: "/universities" },
              { label: university.name_ar }
            ]} 
          />
        </div>
        
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1a3a5c] to-[#2a5a8c] text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white shadow flex items-center justify-center flex-shrink-0">
              {university.logo_url ? (
                <img
                  src={university.logo_url}
                  alt={university.name_en}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <GraduationCap size={28} className="text-[#1a3a5c]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-[#d4a843]/20 text-[#d4a843] text-xs font-semibold px-2 py-0.5 rounded-full font-cairo">
                  {university.type}
                </span>
                {university.ranking_egypt && (
                  <span className="flex items-center gap-1 text-xs text-blue-200 font-cairo">
                    <BadgeCheck size={12} className="text-[#d4a843]" />#
                    {university.ranking_egypt} في مصر / in Egypt
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-cairo">
                {university.name_ar}
              </h1>
              <p className="text-blue-200 text-sm font-cairo">
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
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-[#1a3a5c]">
                  <FileText size={22} className="text-[#d4a843]" />
                  <LocalizedHeading tKey="details.about" className="text-xl font-bold font-cairo" />
                </div>
                <div className="prose prose-blue max-w-none">
                   {/* We use localized text blocks for description too */}
                   <p className="text-gray-600 font-cairo leading-relaxed whitespace-pre-line">
                     {university.description_ar}
                   </p>
                   <p className="text-gray-400 font-cairo text-sm leading-relaxed whitespace-pre-line border-t pt-4 mt-4">
                     {university.description_en}
                   </p>
                </div>
              </section>

              {/* Admission */}
              {(university.admission_requirements_ar ||
                university.admission_requirements_en) && (
                <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 text-[#1a3a5c]">
                    <BadgeCheck size={22} className="text-[#d4a843]" />
                    <LocalizedHeading tKey="details.admission" className="text-xl font-bold font-cairo" />
                  </div>
                  <div className="space-y-6">
                     {university.admission_requirements_ar && (
                       <p className="text-gray-600 font-cairo text-sm leading-relaxed whitespace-pre-line">
                         {university.admission_requirements_ar}
                       </p>
                     )}
                     {university.admission_requirements_en && (
                       <p className="text-gray-400 font-cairo text-xs leading-relaxed whitespace-pre-line border-t pt-4">
                         {university.admission_requirements_en}
                       </p>
                     )}
                  </div>
                </section>
              )}

              {/* Faculties Section */}
              <FacultiesSection faculties={faculties} universityMajors={majors} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase font-cairo">Location</p>
                      <p className="text-sm font-bold text-[#1a3a5c] font-cairo">
                        {university.location_ar} / {university.location_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Star size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase font-cairo">System</p>
                      <p className="text-sm font-bold text-[#1a3a5c] font-cairo capitalize">
                        {university.system}
                      </p>
                    </div>
                  </div>

                  {university.website && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <Globe size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase font-cairo">Website</p>
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-blue-600 hover:underline font-cairo block truncate"
                        >
                          {university.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 gap-3">
                  <ShortlistButton universityId={university.id} />
                  <CompareButton universityId={university.id} />
                </div>
              </div>

              {/* Accreditation */}
              {university.accreditations && university.accreditations.length > 0 && (
                <div className="bg-[#1a3a5c] rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Award size={22} className="text-[#d4a843]" />
                    <LocalizedHeading tKey="details.accreditations" className="font-bold font-cairo" />
                  </div>
                  <div className="space-y-3">
                    {university.accreditations.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <BadgeCheck size={16} className="text-[#d4a843]" />
                        <span className="text-xs font-medium font-cairo">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compare Promo */}
              <div className="bg-gradient-to-br from-[#fff9ee] to-[#fff4d9] rounded-3xl p-6 border border-[#d4a843]/20">
                <LocalizedHeading tKey="details.compareCta" className="font-black text-[#1a3a5c] font-cairo mb-2" />
                <LocalizedParagraph tKey="details.compareDesc" className="text-xs text-gray-600 font-cairo mb-4 leading-relaxed" />
                <a
                  href="/compare"
                  className="inline-flex items-center justify-center w-full bg-[#1a3a5c] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#b8922a] transition-colors font-cairo"
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
