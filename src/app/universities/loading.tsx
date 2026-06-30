import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {/* Hero skeleton */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
            <div className="mb-6">
              <div className="h-6 w-48 bg-card-bg/60 border border-border rounded-full animate-pulse mb-4" />
              <div className="h-9 w-64 bg-card-bg border border-border rounded-xl animate-pulse mb-2" />
              <div className="h-4 w-80 bg-card-bg/50 border border-border rounded-lg animate-pulse" />
            </div>
            {/* Search bar skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 h-[52px] bg-card-bg rounded-2xl border-2 border-border animate-pulse" />
              <div className="h-[52px] w-80 bg-card-bg rounded-2xl border-2 border-border animate-pulse" />
            </div>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="h-4 w-24 bg-card-bg/50 border border-border rounded animate-pulse mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card-bg rounded-[20px] border-2 border-border overflow-hidden">
                <div className="h-32 bg-blue/10 dark:bg-amber/10 animate-pulse" />
                <div className="p-5 pt-9 space-y-3">
                  <div className="h-4 w-3/4 bg-card-bg border border-border rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-card-bg/80 border border-border rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-card-bg/60 border border-border rounded animate-pulse" />
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <div className="h-7 w-16 bg-card-bg border border-border rounded-lg animate-pulse" />
                    <div className="h-7 w-16 bg-card-bg border border-border rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
