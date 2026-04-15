import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompareButton from "@/components/compare/CompareButton";
import { getUniversityBySlug } from "@/lib/universities";
import { getUniversityMajors } from "@/lib/majors";
import {
  MapPin,
  Globe,
  GraduationCap,
  Users,
  BookOpen,
  BadgeCheck,
  FileText,
  Star,
  Award,
} from "lucide-react";

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
  const [university, universityMajors] = await Promise.all([
    getUniversityBySlug(slug),
    Promise.resolve([]),
  ]);

  if (!university) notFound();

  const majors = await getUniversityMajors(university.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1">
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
                  {typeLabels[university.type]?.ar} /{" "}
                  {typeLabels[university.type]?.en}
                </span>
                {university.ranking_egypt && (
                  <span className="flex items-center gap-1 text-xs text-blue-200 font-cairo">
                    <BadgeCheck size={12} className="text-[#d4a843]" />#
                    {university.ranking_egypt} في مصر
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-cairo">
                {university.name_ar}
              </h1>
              <p className="text-blue-200 text-sm font-cairo">
                {university.name_en}
              </p>
              <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-blue-200 font-cairo">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {university.location_ar}
                </span>
                {university.founded_year && (
                  <span>تأسست {university.founded_year}</span>
                )}
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#d4a843] hover:underline"
                  >
                    <Globe size={14} />
                    الموقع الرسمي
                  </a>
                )}
              </div>
              <div className="mt-4">
                <CompareButton universityId={university.id} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        {(university.faculties_count ||
          university.total_students ||
          university.tuition_min) && (
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-8 flex-wrap">
              {university.faculties_count && (
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#d4a843]" />
                  <div>
                    <p className="text-base font-bold text-[#1a3a5c] font-cairo">
                      {university.faculties_count}
                    </p>
                    <p className="text-xs text-gray-400 font-cairo">
                      كلية / Faculties
                    </p>
                  </div>
                </div>
              )}
              {university.total_students && (
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#d4a843]" />
                  <div>
                    <p className="text-base font-bold text-[#1a3a5c] font-cairo">
                      {university.total_students.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 font-cairo">
                      طالب / Students
                    </p>
                  </div>
                </div>
              )}
              {university.tuition_min && (
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-base font-bold text-[#d4a843] font-cairo">
                      {university.tuition_min.toLocaleString()}{" "}
                      {university.tuition_currency ?? "EGP"}
                    </p>
                    <p className="text-xs text-gray-400 font-cairo">
                      مصروفات تبدأ من / Tuition from
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. University Description Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#1a3a5c]">
                  <FileText size={20} className="text-[#d4a843]" />
                  <h2 className="font-bold font-cairo">
                    وصف الجامعة / University Description
                  </h2>
                </div>
                <p className="text-sm text-gray-600 font-cairo leading-relaxed">
                  {university.description_ar || "سيتم إضافة الوصف قريباً..."}
                </p>
                {university.description_en && (
                  <p className="text-xs text-gray-400 font-cairo mt-3 leading-relaxed border-t pt-3">
                    {university.description_en}
                  </p>
                )}
              </div>

              {/* 2. Most Known For Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-r-4 border-r-[#d4a843]">
                <div className="flex items-center gap-2 mb-3 text-[#1a3a5c]">
                  <Star size={20} className="text-[#d4a843]" />
                  <h2 className="font-bold font-cairo">
                    تشتهر بـ / Most Known For
                  </h2>
                </div>
                <p className="text-sm text-gray-600 font-cairo">
                  {/* Data will be pulled from university.famous_for or similar field */}
                  هذا القسم مخصص لأبرز ما يميز الجامعة أكاديمياً أو جغرافياً.
                </p>
              </div>

              {/* 3. Admission Requirements Sections */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-[#1a3a5c] border-b pb-3">
                  <Award size={20} className="text-[#d4a843]" />
                  <h2 className="font-bold font-cairo text-lg">
                    متطلبات القبول / Admission Requirements
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* IG Requirements */}
                  <div className="p-4 bg-[#faf7f2] rounded-xl border border-gray-50">
                    <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm mb-2 underline decoration-[#d4a843]">
                      IG Requirements
                    </h3>
                    <p className="text-xs text-gray-500 font-cairo">
                      Placeholder for IGCSE/GCE entry scores and subject
                      requirements.
                    </p>
                  </div>

                  {/* American Requirements */}
                  <div className="p-4 bg-[#faf7f2] rounded-xl border border-gray-50">
                    <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm mb-2 underline decoration-[#d4a843]">
                      American Requirements
                    </h3>
                    <p className="text-xs text-gray-500 font-cairo">
                      Placeholder for SAT/ACT/EST scores and GPA requirements.
                    </p>
                  </div>

                  {/* National Requirements */}
                  <div className="p-4 bg-[#faf7f2] rounded-xl border border-gray-50">
                    <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm mb-2 underline decoration-[#d4a843]">
                      National (Thanaweya Amma)
                    </h3>
                    <p className="text-xs text-gray-500 font-cairo">
                      تنسيق الثانوية العامة المصرية والشهادات المعادلة العربية.
                    </p>
                  </div>

                  {/* French Requirements */}
                  <div className="p-4 bg-[#faf7f2] rounded-xl border border-gray-50">
                    <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm mb-2 underline decoration-[#d4a843]">
                      French Requirements
                    </h3>
                    <p className="text-xs text-gray-500 font-cairo">
                      Placeholder for French Baccalaureate requirements.
                    </p>
                  </div>

                  {/* German Requirements */}
                  <div className="p-4 bg-[#faf7f2] rounded-xl border border-gray-50">
                    <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm mb-2 underline decoration-[#d4a843]">
                      German Requirements
                    </h3>
                    <p className="text-xs text-gray-500 font-cairo">
                      Placeholder for Abitur requirements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Majors List */}
              {majors.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h2 className="font-bold text-[#1a3a5c] font-cairo mb-4">
                    التخصصات المتاحة ({majors.length})
                  </h2>
                  <div className="space-y-3">
                    {majors.map((um) => (
                      <div
                        key={um.id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#1a3a5c] font-cairo">
                            {um.major?.name_ar}
                          </p>
                          <p className="text-xs text-gray-400 font-cairo">
                            {um.major?.name_en}
                          </p>
                        </div>
                        <div className="text-right">
                          {um.tuition_per_year && (
                            <p className="text-xs font-bold text-[#d4a843] font-cairo">
                              {um.tuition_per_year.toLocaleString()}{" "}
                              {um.currency ?? "EGP"}/year
                            </p>
                          )}
                          {um.min_score && (
                            <p className="text-xs text-gray-400 font-cairo">
                              أدنى درجة: {um.min_score}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Accreditations */}
              {university.accreditations?.length ? (
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-[#1a3a5c] font-cairo text-sm mb-3">
                    الاعتمادات / Accreditations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {university.accreditations.map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-cairo"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Compare CTA */}
              <div className="bg-[#1a3a5c] rounded-2xl p-5 text-white">
                <h3 className="font-bold font-cairo text-sm mb-2">
                  قارن مع جامعات أخرى
                </h3>
                <p className="text-blue-200 text-xs font-cairo mb-3">
                  Compare with other universities side-by-side
                </p>
                <a
                  href="/compare"
                  className="block text-center bg-[#d4a843] text-white text-sm font-semibold py-2 rounded-xl hover:bg-[#b8922a] transition-colors font-cairo"
                >
                  اذهب للمقارنة →
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
