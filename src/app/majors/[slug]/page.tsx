import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GraduationCap, BookOpen, Briefcase, Lightbulb, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";

export default async function MajorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const majorName = slug.replace("-", " ");

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/majors" className="flex items-center gap-2 text-[#d4a843] font-cairo text-sm mb-6 hover:underline">
          <ChevronRight size={16} /> العودة إلى التخصصات / Back
        </Link>

        <header className="mb-12 border-b border-gray-200 pb-8">
          <div className="bg-[#1a3a5c] inline-block p-3 rounded-2xl mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#1a3a5c] font-cairo mb-2 capitalize">{majorName}</h1>
          <p className="text-gray-500 font-cairo text-lg">Detailed information about the major</p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          <section id="definition" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-[#1a3a5c]">
              <BookOpen size={24} />
              <h2 className="text-2xl font-bold font-cairo">تعريف التخصص / Definition</h2>
            </div>
            <div className="prose prose-slate max-w-none text-gray-600 font-cairo leading-relaxed">
              <p>هذا القسم سيحتوي على شرح مفصل عن التخصص وأهدافه الدراسية. This section will contain a detailed description of the major and its educational goals.</p>
            </div>
          </section>

          <section id="jobs" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-[#1a3a5c]">
              <Briefcase size={24} />
              <h2 className="text-2xl font-bold font-cairo">فرص العمل / Job Opportunities</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center gap-2 p-4 bg-[#faf7f2] rounded-xl text-gray-700 font-cairo border border-gray-50">• مسمى وظيفي مستقبلي / Future Job Title</li>
              <li className="flex items-center gap-2 p-4 bg-[#faf7f2] rounded-xl text-gray-700 font-cairo border border-gray-50">• مسمى وظيفي مستقبلي / Future Job Title</li>
            </ul>
          </section>

          <section id="universities" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-[#1a3a5c]">
              <MapPin size={24} />
              <h2 className="text-2xl font-bold font-cairo">أبرز الجامعات في مصر / Universities in Egypt</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 py-3">
                <span className="font-cairo font-semibold text-[#1a3a5c]">اسم الجامعة الحكومية أو الخاصة</span>
                <span className="text-sm text-gray-400">University Name</span>
              </div>
            </div>
          </section>

          <section id="courses" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-[#1a3a5c]">
              <Lightbulb size={24} />
              <h2 className="text-2xl font-bold font-cairo">كورسات مساعدة / Helpful Courses</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-dashed border-[#d4a843]/30 rounded-2xl bg-white hover:bg-[#d4a843]/5 transition-colors">
                <h4 className="font-bold text-[#1a3a5c] font-cairo">اسم الكورس الموصى به</h4>
                <p className="text-xs text-gray-500 font-cairo mt-1">Course Name & Platform (Coursera, EdX, etc.)</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}