import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GraduationCap, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-[#1a3a5c] flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={36} className="text-[#d4a843]" />
          </div>
          <h1 className="text-5xl font-black text-[#1a3a5c] font-cairo mb-2">404</h1>
          <p className="text-xl font-bold text-[#1a3a5c] font-cairo mb-3">الصفحة غير موجودة</p>
          <p className="text-sm text-gray-500 font-cairo mb-8">
            Page not found — the link might be wrong or the content was removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/universities"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1a3a5c] px-6 py-3 text-sm font-bold text-white hover:bg-[#2a5a8c] transition-colors font-cairo"
            >
              <Search size={16} />
              استكشف الجامعات
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-[#1a3a5c]/15 bg-white px-6 py-3 text-sm font-bold text-[#1a3a5c] hover:border-[#d4a843]/40 transition-colors font-cairo"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
