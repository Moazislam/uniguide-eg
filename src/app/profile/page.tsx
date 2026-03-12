"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { University } from "@/types";
import { BookmarkX, GraduationCap, MapPin, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("student_profiles")
          .select("shortlist")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            const ids = data?.shortlist ?? [];
            setShortlistIds(ids);
            if (ids.length) {
              supabase
                .from("universities")
                .select("*")
                .in("id", ids)
                .then(({ data: unis }) => {
                  setUniversities((unis as University[]) ?? []);
                  setLoading(false);
                });
            } else {
              setLoading(false);
            }
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const removeFromShortlist = async (id: string) => {
    const next = shortlistIds.filter((x) => x !== id);
    setShortlistIds(next);
    setUniversities((u) => u.filter((x) => x.id !== id));
    if (user) {
      await supabase.from("student_profiles").upsert({
        user_id: user.id,
        shortlist: next,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1a3a5c] flex items-center justify-center">
              <User size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#1a3a5c] font-cairo">ملفي الشخصي</h1>
              <p className="text-sm text-gray-400 font-cairo">{user?.email ?? "My Profile"}</p>
            </div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors font-cairo">
            <LogOut size={16} />خروج
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-[#1a3a5c] font-cairo mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-[#d4a843]" />
            قائمتي المختصرة ({universities.length})
          </h2>
          {loading && <div className="h-20 bg-gray-50 rounded-xl animate-pulse" />}
          {!loading && universities.length === 0 && (
            <div className="text-center py-10">
              <GraduationCap size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-cairo mb-4">لا توجد جامعات في قائمتك بعد</p>
              <Link href="/universities" className="inline-block bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2 rounded-xl font-cairo">
                استكشف الجامعات
              </Link>
            </div>
          )}
          {!loading && universities.map((uni) => (
            <div key={uni.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 mb-3 last:mb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a3a5c]/5 flex items-center justify-center">
                  <GraduationCap size={18} className="text-[#1a3a5c]" />
                </div>
                <div>
                  <Link href={`/universities/${uni.slug}`} className="font-bold text-[#1a3a5c] font-cairo text-sm hover:text-[#d4a843]">
                    {uni.name_ar}
                  </Link>
                  <p className="text-xs text-gray-400 font-cairo flex items-center gap-1">
                    <MapPin size={10} />{uni.location_ar}
                  </p>
                </div>
              </div>
              <button onClick={() => removeFromShortlist(uni.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                <BookmarkX size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#1a3a5c] rounded-2xl p-6 text-white text-center">
          <p className="font-bold font-cairo mb-1">جرّب الـ AI Matching</p>
          <p className="text-blue-200 text-sm font-cairo mb-4">عشان نلاقيلك الجامعة والتخصص الأنسب</p>
          <Link href="/onboarding" className="inline-block bg-[#d4a843] text-white text-sm font-bold px-6 py-2.5 rounded-xl font-cairo">
            ابدأ المطابقة الذكية ←
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
