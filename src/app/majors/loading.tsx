import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <div className="h-7 w-36 bg-card-bg/50 border border-border rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-64 bg-card-bg/30 border border-border rounded-lg animate-pulse" />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-card-bg/50 border border-border rounded-full animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-card-bg rounded-2xl p-5 border border-border space-y-3">
              <div className="h-8 w-8 bg-card-bg/50 border border-border rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-card-bg/50 border border-border rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-card-bg/30 border border-border rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-card-bg/30 border border-border rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
