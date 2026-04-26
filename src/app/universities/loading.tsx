import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <div className="h-7 w-48 bg-card-bg/50 border border-border rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-72 bg-card-bg/30 border border-border rounded-lg animate-pulse" />
        </div>

        <div className="h-12 bg-card-bg/50 border border-border rounded-2xl animate-pulse mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card-bg rounded-2xl border border-border overflow-hidden">
              <div className="h-28 bg-blue/10 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 bg-card-bg/50 border border-border rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-card-bg/30 border border-border rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-card-bg/30 border border-border rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
