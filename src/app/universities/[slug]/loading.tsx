import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <div className="bg-blue py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-card-bg/10 animate-pulse flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-5 w-24 bg-card-bg/20 rounded-full animate-pulse" />
              <div className="h-8 w-72 bg-card-bg/20 rounded-xl animate-pulse" />
              <div className="h-4 w-48 bg-card-bg/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card-bg rounded-2xl p-6 border border-border space-y-3">
                  <div className="h-5 w-48 bg-card-bg/50 border border-border rounded animate-pulse" />
                  <div className="h-4 w-full bg-card-bg/30 border border-border rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-card-bg/30 border border-border rounded animate-pulse" />
                  <div className="h-4 w-3/5 bg-card-bg/30 border border-border rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="bg-card-bg rounded-2xl p-5 border border-border h-40 animate-pulse" />
              <div className="bg-blue/10 rounded-2xl p-5 h-32 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
