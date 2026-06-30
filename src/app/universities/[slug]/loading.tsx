import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {/* Hero skeleton */}
        <div className="relative bg-gradient-to-br from-blue via-blue-light to-[#2a5a8c] dark:from-[#0f2438] dark:to-card-bg py-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/15 animate-pulse flex-shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-6 w-20 bg-white/10 rounded-lg animate-pulse" />
                </div>
                <div className="h-9 w-72 bg-white/15 rounded-xl animate-pulse" />
                <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
                <div className="h-5 w-36 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card-bg rounded-2xl border-2 border-border px-5 py-4 h-20 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card-bg rounded-[20px] p-6 border-2 border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-card-bg/60 border border-border animate-pulse" />
                    <div className="h-5 w-32 bg-card-bg border border-border rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-card-bg border border-border rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-card-bg border border-border rounded animate-pulse" />
                  <div className="h-4 w-3/5 bg-card-bg border border-border rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="space-y-5">
              <div className="bg-card-bg rounded-[20px] p-5 border-2 border-border h-36 animate-pulse" />
              <div className="bg-blue/10 dark:bg-amber/10 rounded-[20px] p-5 h-44 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
