import { getFacultyById } from "@/lib/faculties";
import { getUniversityBySlug } from "@/lib/universities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { Clock, DollarSign, Globe2, BookOpen, BadgeCheck, GraduationCap, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ slug: string; facultyId: string }>;
}) {
  const { slug, facultyId } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) notFound();

  const faculty = await getFacultyById(facultyId);
  if (!faculty || faculty.university_id !== university.id) notFound();

  // For now, we'll assume a bilingual layout
  const isAr = true; // Fallback for server component if we don't have context yet
  const isRtl = true;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumbs */}
        <nav className={`flex items-center gap-2 text-sm text-text-secondary font-cairo mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Link href="/universities" className="hover:text-amber">الجامعات</Link>
          {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          <Link href={`/universities/${slug}`} className="hover:text-amber">{university.name_ar}</Link>
          {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          <span className="text-blue font-bold">{faculty.name_ar}</span>
        </nav>

        <div className="bg-card-bg rounded-[40px] border border-border shadow-xl overflow-hidden">
          <div className="bg-blue dark:bg-blue-dark p-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
             
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                   <GraduationCap size={32} className="text-amber" />
                </div>
                <h1 className="text-4xl font-black font-cairo mb-2">{faculty.name_ar}</h1>
                <p className="text-xl text-blue-100/60 font-cairo">{faculty.name_en}</p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <MapPin size={16} className="text-amber" />
                      <span className="text-sm font-bold font-cairo">{university.name_ar}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <BadgeCheck size={16} className="text-amber" />
                      <span className="text-sm font-bold font-cairo capitalize">{faculty.category}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-10 grid gap-12 md:grid-cols-[1fr,0.6fr]">
             <div className="space-y-10">
                <section>
                   <h2 className="text-2xl font-black text-blue dark:text-text-primary font-cairo mb-4 flex items-center gap-3">
                      <BookOpen size={24} className="text-amber" />
                      عن الكلية / About the Faculty
                   </h2>
                   <p className="text-text-secondary font-cairo leading-relaxed whitespace-pre-line text-lg">
                      {faculty.description_ar || "لا يوجد وصف متاح حالياً باللغة العربية."}
                   </p>
                </section>

                <section>
                   <h2 className="text-2xl font-black text-blue dark:text-text-primary font-cairo mb-6 flex items-center gap-3">
                      <BadgeCheck size={24} className="text-amber" />
                      متطلبات القبول / Admission
                   </h2>
                   <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-6 rounded-3xl bg-cream dark:bg-blue/10 border border-border">
                         <p className="text-xs font-black text-amber uppercase tracking-wider mb-2">ثانوية عامة / National</p>
                         <p className="text-blue dark:text-text-primary font-bold font-cairo">{faculty.admission_national || "يخضع لتنسيق العام الحالي"}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-cream dark:bg-blue/10 border border-border">
                         <p className="text-xs font-black text-amber uppercase tracking-wider mb-2">شهادات دولية / International</p>
                         <p className="text-blue dark:text-text-primary font-bold font-cairo">{faculty.admission_ig || faculty.admission_american || "تواصل مع الجامعة للتفاصيل"}</p>
                      </div>
                   </div>
                </section>
             </div>

             <div className="space-y-6">
                <div className="p-8 rounded-[32px] bg-blue/5 border border-border shadow-sm">
                   <h3 className="text-lg font-black text-blue dark:text-text-primary font-cairo mb-6">تفاصيل البرنامج / Program Details</h3>
                   <div className="space-y-5">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3 text-text-secondary">
                            <Clock size={18} className="text-amber" />
                            <span className="font-bold font-cairo">مدة الدراسة</span>
                         </div>
                         <span className="font-black text-blue dark:text-text-primary font-cairo">{faculty.duration_years} سنوات</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3 text-text-secondary">
                            <DollarSign size={18} className="text-amber" />
                            <span className="font-bold font-cairo">المصروفات (سنوياً)</span>
                         </div>
                         <span className="font-black text-emerald-600 font-cairo">
                            {faculty.tuition_min ? `${faculty.tuition_min.toLocaleString()} ${faculty.currency || 'ج.م'}` : "تواصل مع الجامعة"}
                         </span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3 text-text-secondary">
                            <Globe2 size={18} className="text-amber" />
                            <span className="font-bold font-cairo">لغة الدراسة</span>
                         </div>
                         <span className="font-black text-blue dark:text-text-primary font-cairo capitalize">{faculty.language || "English / Bilingual"}</span>
                      </div>
                   </div>

                   <Link
                      href={faculty.website || university.website || "#"}
                      target="_blank"
                      className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue dark:bg-amber py-4 text-sm font-black text-white dark:text-blue-dark transition-all hover:bg-blue-light dark:hover:bg-amber-dark"
                   >
                      زيارة موقع الكلية / Visit Website
                      <ChevronRight size={16} />
                   </Link>
                </div>

                <div className="p-8 rounded-[32px] border border-dashed border-border text-center">
                   <p className="text-sm text-text-secondary font-cairo">هل تريد مقارنة هذه الكلية بغيرها؟</p>
                   <Link href={`/compare`} className="mt-4 inline-block text-amber font-black font-cairo hover:underline">انتقل إلى صفحة المقارنة ←</Link>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
