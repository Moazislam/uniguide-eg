import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
  ChevronLeft,
  Sparkles,
  TrendingUp,
  BookOpen,
  Users
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) return {};

  const title = `${university.name_ar} | ${university.name_en}`;
  const description = university.description_en ?? `تعرف على ${university.name_ar}: المصروفات، الكليات، التنسيق، وطرق التقديم. قارن بينها وبين الجامعات الأخرى على UniGuide.`;

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
      images: university.cover_url ? [{ url: university.cover_url, alt: university.name_en }] : [{ url: "/og-university.png", alt: university.name_en }],
    },
  };
}

const typeLabels: Record<string, { ar: string; en: string; color: string }> = {
  public: { ar: "حكومية", en: "Public", color: "bg-blue/10 dark:bg-blue-dark text-blue dark:text-blue-light border-blue/20" },
  private: { ar: "خاصة", en: "Private", color: "bg-amber/10 text-amber-dark dark:text-amber border-amber/20" },
  international: { ar: "دولية", en: "International", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
};

const systemLabels: Record<string, string> = {
  egyptian: "مصري",
  american: "أمريكي",
  british: "بريطاني",
  french: "فرنسي",
};

function StatPill({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-3 bg-card-bg rounded-[20px] border-2 border-border px-5 py-4 shadow-sm hover:shadow-md hover:border-amber/40 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xl font-black text-text-primary font-cairo leading-tight">{value}</p>
        <p className="text-xs text-text-secondary font-cairo mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function AdmissionCard({ label, content }: { label: React.ReactNode; content: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card-bg p-5 hover:border-amber/40 hover:shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-amber" />
        <h3 className="font-bold text-text-primary font-cairo text-sm">
          {label}
        </h3>
      </div>
      <p className="text-xs text-text-secondary font-cairo leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) notFound();

  let majors: Awaited<ReturnType<typeof getUniversityMajors>> = [];
  let faculties: Awaited<ReturnType<typeof getFacultiesByUniversityId>> = [];
  let dataError = false;

  try {
    [majors, faculties] = await Promise.all([
      getUniversityMajors(university.id),
      getFacultiesByUniversityId(university.id),
    ]);
  } catch {
    dataError = true;
  }

  const typeConfig = typeLabels[university.type] ?? typeLabels.public;

  const admissionEntries = [
    { label: <LocalizedText tKey="details.thanaweya" fallback="الثانوية العامة / Thanaweya" />, content: university.admission_national ?? "يُقبل طلاب الثانوية العامة المصرية وفق تنسيق الوزارة." },
    university.admission_ig ? { label: <LocalizedText tKey="details.ig" fallback="IG / IGCSE Requirements" />, content: university.admission_ig } : null,
    university.admission_american ? { label: <LocalizedText tKey="details.american" fallback="American / SAT Requirements" />, content: university.admission_american } : null,
    university.admission_french ? { label: "French Baccalaureate", content: university.admission_french } : null,
    university.admission_german ? { label: "German Abitur", content: university.admission_german } : null,
  ].filter(Boolean) as { label: React.ReactNode; content: string }[];

  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {dataError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm font-cairo flex items-center gap-3 shadow-sm">
              <span className="text-xl">⚠️</span>
              <p>
                حدث خطأ أثناء تحميل بعض تفاصيل الكليات. قد تكون المعلومات المعروضة أدناه غير مكتملة.
                <br />
                Some faculty details could not be loaded. Information below might be incomplete.
              </p>
            </div>
          </div>
        )}

        {/* Hero section with premium styling */}
        <div className="relative overflow-hidden bg-blue dark:bg-blue-dark">
          {/* Background layers */}
          <div className="absolute inset-0">
            {university.cover_url && (
              <img
                src={university.cover_url}
                alt={`${university.name_en} campus`}
                className="w-full h-full object-cover opacity-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
          {/* Decorative blurs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-light/10 blur-3xl" />
          </div>
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
            <Breadcrumbs 
              items={[
                { label: "الجامعات / Universities", href: "/universities" },
                { label: university.name_ar }
              ]} 
              className="text-white/60 mb-6"
            />

            <div className="flex items-start gap-5">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center flex-shrink-0 border-2 border-white/80 p-2">
                {university.logo_url ? (
                  <img
                    src={university.logo_url}
                    alt={university.name_en}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <GraduationCap size={32} className="text-blue" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Badges row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg font-cairo border shadow-sm ${typeConfig.color}`}>
                    {typeConfig.ar} / {typeConfig.en}
                  </span>
                  {university.system && university.system !== "egyptian" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg font-cairo bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm">
                      نظام {systemLabels[university.system] ?? university.system}
                    </span>
                  )}
                  {university.ranking_egypt && (
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-amber/20 text-amber-light border border-amber/30 font-cairo shadow-sm backdrop-blur-sm">
                      <BadgeCheck size={14} />
                      #{university.ranking_egypt} في مصر
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-3xl sm:text-4xl font-black font-cairo text-white leading-tight">
                  {university.name_ar}
                </h1>
                <p className="text-blue-100/80 text-sm font-cairo mt-1">
                  {university.name_en}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        {(university.faculties_count || university.total_students || university.tuition_min != null) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {university.faculties_count != null && (
                <StatPill
                  icon={<BookOpen size={20} className="text-amber-dark dark:text-amber" />}
                  value={university.faculties_count}
                  label="كلية / Faculties"
                />
              )}
              {university.total_students != null && (
                <StatPill
                  icon={<Users size={20} className="text-amber-dark dark:text-amber" />}
                  value={university.total_students.toLocaleString()}
                  label="طالب / Students"
                />
              )}
              {university.tuition_min != null && (
                <StatPill
                  icon={<TrendingUp size={20} className="text-amber-dark dark:text-amber" />}
                  value={`${university.tuition_min === 0 ? "مجاني" : university.tuition_min.toLocaleString() + " " + (university.tuition_currency ?? "EGP")}`}
                  label="مصروفات تبدأ من / Tuition from"
                />
              )}
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Description */}
              <div className="rounded-[24px] border-2 border-border bg-card-bg p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue/5 dark:bg-amber/10 flex items-center justify-center">
                    <FileText size={22} className="text-blue dark:text-amber" />
                  </div>
                  <LocalizedHeading tKey="details.about" className="font-black text-text-primary font-cairo text-xl" />
                </div>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <p className="text-sm text-text-secondary font-cairo leading-relaxed whitespace-pre-line">
                    {university.description_ar || "سيتم إضافة الوصف قريباً..."}
                  </p>
                  {university.description_en && (
                    <p className="text-xs text-text-secondary/70 font-cairo mt-6 leading-relaxed pt-6 border-t border-border whitespace-pre-line">
                      {university.description_en}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Famous for */}
              {university.famous_for && university.famous_for.length > 0 && (
                <div className="rounded-[24px] border-2 border-amber/20 dark:border-amber/10 bg-gradient-to-br from-amber/5 to-card-bg p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber/20 flex items-center justify-center">
                      <Star size={22} className="text-amber-dark dark:text-amber" />
                    </div>
                    <div>
                      <h2 className="font-black text-text-primary font-cairo text-xl">
                        تشتهر بـ
                      </h2>
                      <p className="text-xs text-text-secondary font-cairo mt-1">Most Known For</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {university.famous_for.map((item) => (
                      <span
                        key={item}
                        className="text-xs bg-card-bg border-2 border-amber/30 text-amber-dark dark:text-amber px-4 py-2 rounded-xl font-cairo font-bold shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Admission Requirements */}
              {admissionEntries.length > 0 && (
                <div className="rounded-[24px] border-2 border-border bg-card-bg p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue/5 dark:bg-amber/10 flex items-center justify-center">
                      <Award size={22} className="text-blue dark:text-amber" />
                    </div>
                    <div>
                      <LocalizedHeading tKey="details.admission" className="font-black text-text-primary font-cairo text-xl" />
                      <p className="text-[11px] text-text-secondary font-cairo mt-1">Admission Requirements</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {admissionEntries.map((entry, idx) => (
                      <AdmissionCard key={idx} label={entry.label} content={entry.content} />
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Faculties */}
              <FacultiesSection faculties={faculties} universityMajors={majors} universitySlug={slug} />

              {/* 5. Majors List (Fallback if needed, though FacultiesSection covers most) */}
              {majors.length > 0 && (
                <div className="rounded-[24px] border-2 border-border bg-card-bg p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue/5 dark:bg-amber/10 flex items-center justify-center">
                      <GraduationCap size={22} className="text-blue dark:text-amber" />
                    </div>
                    <div>
                      <LocalizedHeading tKey="details.departments" className="font-black text-text-primary font-cairo text-xl" />
                      <p className="text-[11px] text-text-secondary font-cairo mt-1">{majors.length} Available Majors</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {majors.map((um) => (
                      <div
                        key={um.id}
                        className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-border/30 transition-colors group border border-transparent hover:border-border"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-amber/40 group-hover:bg-amber transition-colors flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-text-primary font-cairo truncate">
                              {um.major?.name_ar}
                            </p>
                            <p className="text-[11px] text-text-secondary font-cairo mt-0.5">
                              {um.major?.name_en}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          {um.tuition_per_year != null && (
                            <p className="text-xs font-black text-amber font-cairo">
                              {um.tuition_per_year === 0 ? <LocalizedText tKey="details.free" fallback="Free" /> : `${um.tuition_per_year.toLocaleString()} ${um.currency ?? "EGP"}`}
                            </p>
                          )}
                          {um.min_score != null && (
                            <p className="text-[10px] text-text-secondary font-cairo font-semibold">
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
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card-bg rounded-[24px] p-6 border-2 border-border shadow-sm">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue/5 dark:bg-card-bg border border-border flex items-center justify-center text-blue dark:text-amber flex-shrink-0 shadow-sm">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary font-bold uppercase font-cairo tracking-wider mb-0.5">Location</p>
                      <p className="text-sm font-bold text-text-primary font-cairo">
                        {university.location_ar} / {university.location_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber/5 dark:bg-card-bg border border-border flex items-center justify-center text-amber flex-shrink-0 shadow-sm">
                      <Star size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary font-bold uppercase font-cairo tracking-wider mb-0.5">System</p>
                      <p className="text-sm font-bold text-text-primary font-cairo capitalize">
                        {university.system}
                      </p>
                    </div>
                  </div>

                  {university.founded_year && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-card-bg border border-border flex items-center justify-center text-purple-600 flex-shrink-0 shadow-sm">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase font-cairo tracking-wider mb-0.5">Founded</p>
                        <p className="text-sm font-bold text-text-primary font-cairo">
                          {university.founded_year}
                        </p>
                      </div>
                    </div>
                  )}

                  {university.website && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-card-bg border border-border flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm">
                        <Globe size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-text-secondary font-bold uppercase font-cairo tracking-wider mb-0.5">Website</p>
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-blue hover:underline font-cairo block truncate transition-colors"
                        >
                          {university.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-3">
                  <ShortlistButton universityId={university.id} compact />
                  <CompareButton universityId={university.id} compact />
                </div>
              </div>

              {/* Accreditations */}
              {university.accreditations?.length ? (
                <div className="rounded-[24px] border-2 border-border bg-card-bg p-6 shadow-sm">
                  <h3 className="font-bold text-text-primary font-cairo text-base mb-4 flex items-center gap-2">
                    <BadgeCheck size={18} className="text-amber" />
                    <LocalizedHeading tKey="details.accreditations" />
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {university.accreditations.map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-cairo font-bold border border-emerald-500/20 shadow-sm"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* CTA: Personalized match */}
              <div className="rounded-[24px] bg-gradient-to-br from-blue via-blue-light to-blue-dark dark:from-[#0f2438] dark:to-card-bg p-6 text-white shadow-xl overflow-hidden relative border border-blue/20">
                <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-amber/20 blur-2xl" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5 backdrop-blur-sm border border-white/10">
                    <Sparkles size={22} className="text-amber" />
                  </div>
                  <h3 className="font-black font-cairo text-lg mb-2">
                    هل هذه الجامعة مناسبة لك؟
                  </h3>
                  <p className="text-blue-100/80 text-sm font-cairo mb-6 leading-relaxed">
                    أنشئ ملف المطابقة واعرف نسبة توافقك مع هذه الجامعة وغيرها
                  </p>
                  <Link
                    href="/onboarding"
                    className="block text-center bg-amber text-blue-dark text-sm font-black py-3 rounded-xl hover:bg-white transition-colors font-cairo shadow-lg shadow-amber/20"
                  >
                    ابدأ ملف المطابقة
                  </Link>
                </div>
              </div>

              {/* CTA: Compare Promo */}
              <div className="rounded-[24px] border-2 border-border bg-card-bg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/5 dark:bg-amber/10 flex items-center justify-center">
                    <TrendingUp size={18} className="text-blue dark:text-amber" />
                  </div>
                  <LocalizedHeading tKey="details.compareCta" className="font-bold text-text-primary font-cairo text-base" />
                </div>
                <LocalizedParagraph tKey="details.compareDesc" className="text-xs text-text-secondary font-cairo mb-5 leading-relaxed" />
                <Link
                  href="/compare"
                  className="block text-center bg-blue dark:bg-amber text-white dark:text-blue-dark text-sm font-bold py-3 rounded-xl hover:bg-blue-light dark:hover:bg-amber-dark transition-colors font-cairo shadow-sm"
                >
                  <LocalizedText tKey="details.goToCompare" fallback="Go to Compare" /> →
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
