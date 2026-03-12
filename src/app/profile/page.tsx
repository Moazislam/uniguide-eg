"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import type { University } from "@/types";
import { BookmarkX, GraduationCap, User, MapPin } from "lucide-react";
import Link from "next/link";

const COMPARE_KEY = "uniguide_compare";

export default function ProfilePage() {
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COMPARE_KEY);
    if (stored) {
      const ids = JSON.parse(stored);
      setShortlistIds(ids);
      if (ids.length) {
        setLoading(true);
        createClient()
          .from("universities")
          .select("*")
          .in("id", ids)
          .then(({ data }) => {
            setUniversities((data as University[]) ?? []);
            setLoading(false);
          });
      }
    }
  }, []);

  const remove = (id: string) => {
    const next = shortlistIds.filter((x) => x !== id);
    setShortlistIds(next);
    setUniversities((u) => u.filter((x) => x.id !== id));
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#1a3a5c] flex items-center justify-center">
            <User size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1a3a5c] font-cairo">ملفي الشخصي</h1>
            <p className="text-sm text-gray-400 font-cairo">My Profile & Shortlist</p>
          </div>
        </div>

        {/* Shortlist */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1a3a5c] font-cairo mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-[#d4a843]" />
            قائمتي المختصرة ({universities.length})
            <span className="text-xs text-gray-400 font-normal">My Shortlist</span>
          </h2>

          {loading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && universities.length === 0 && (
            <div className="text-center py-10">
              <GraduationCap size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-cairo mb-4">لا توجد جامعات في قائمتك بعد</p>
              <Link
                href="/universities"
                className="inline-block bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#2a5a8c] transition-colors font-cairo"
              >
                استكشف الجامعات
              </Link>
            </div>
          )}

          {!loading && universities.map((uni) => (
            <div
              key={uni.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#d4a843]/30 transition-colors mb-3 last:mb-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a3a5c]/5 flex items-center justify-center flex-shrink-0">
                  {uni.logo_url ? (
                    <img src={uni.logo_url} alt={uni.name_en} className="w-8 h-8 object-contain" />
                  ) : (
                    <GraduationCap size={18} className="text-[#1a3a5c]" />
                  )}
                </div>
                <div>
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="font-bold text-[#1a3a5c] font-cairo text-sm hover:text-[#d4a843] transition-colors"
                  >
                    {uni.name_ar}
                  </Link>
                  <p className="text-xs text-gray-400 font-cairo flex items-center gap-1">
                    <MapPin size={10} />{uni.location_ar} · {uni.name_en}
                  </p>
                </div>
              </div>
              <button
                onClick={() => remove(uni.id)}
                className="text-gray-300 hover:text-red-400 transition-colors p-1"
              >
                <BookmarkX size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 bg-[#1a3a5c] rounded-2xl p-6 text-white text-center">
          <p className="font-bold font-cairo mb-1">مش لاقي جامعتك؟</p>
          <p className="text-blue-200 text-sm font-cairo mb-4">Not finding the right university? Let us match you.</p>
          <Link
            href="/onboarding"
            className="inline-block bg-[#d4a843] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#b8922a] transition-colors font-cairo"
          >
            جرّب المطابقة الذكية ←
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
