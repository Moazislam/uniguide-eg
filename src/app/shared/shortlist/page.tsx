import { getUniversitiesByIds } from "@/lib/universities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UniversityCard from "@/components/universities/UniversityCard";
import { GraduationCap, Share2 } from "lucide-react";

export default async function SharedShortlistPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: idsString } = await searchParams;
  const ids = idsString?.split(",").filter(Boolean) ?? [];
  
  const universities = ids.length > 0 ? await getUniversitiesByIds(ids) : [];

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 bg-blue/5 dark:bg-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue dark:text-amber">
            <Share2 size={32} />
          </div>
          <h1 className="text-3xl font-black text-blue dark:text-text-primary font-cairo mb-3">
             قائمة جامعات مختارة / Shared Shortlist
          </h1>
          <p className="text-text-secondary font-cairo max-w-xl mx-auto">
            تمت مشاركة هذه القائمة معك لمساعدتك في استكشاف أفضل الخيارات التعليمية في مصر.
          </p>
        </header>

        {universities.length === 0 ? (
          <div className="text-center py-20 bg-card-bg rounded-[40px] border border-dashed border-border max-w-2xl mx-auto">
            <GraduationCap size={48} className="text-text-secondary/20 mx-auto mb-4" />
            <p className="text-text-secondary font-cairo">لا توجد جامعات في هذه القائمة / No universities in this list</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
