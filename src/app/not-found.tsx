import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GraduationCap, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-blue dark:bg-amber flex items-center justify-center mx-auto mb-6 shadow-xl">
            <GraduationCap size={36} className="text-amber dark:text-blue-dark" />
          </div>
          <h1 className="text-5xl font-black text-blue dark:text-text-primary font-cairo mb-2">404</h1>
          <p className="text-xl font-bold text-blue dark:text-text-primary font-cairo mb-3">الصفحة غير موجودة</p>
          <p className="text-sm text-text-secondary font-cairo mb-8">
            Page not found — the link might be wrong or the content was removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/universities"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue dark:bg-amber px-6 py-3 text-sm font-bold text-white dark:text-blue-dark hover:bg-blue-light dark:hover:bg-amber-dark transition-colors font-cairo"
            >
              <Search size={16} />
              استكشف الجامعات
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-card-bg px-6 py-3 text-sm font-bold text-blue dark:text-text-primary hover:border-amber/40 transition-colors font-cairo"
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
