"use client";

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { BookOpen, ChevronLeft, ChevronRight, GitCompareArrows, Search, Sparkles, Target, Wallet } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const { t, isRtl } = useLanguage();

  const features = [
    {
      icon: <Search size={20} className="text-[#d4a843]" />,
      key: "features.browse",
      href: "/universities",
    },
    {
      icon: <Sparkles size={20} className="text-[#d4a843]" />,
      key: "features.match",
      href: "/onboarding",
    },
    {
      icon: <GitCompareArrows size={20} className="text-[#d4a843]" />,
      key: "features.compare",
      href: "/compare",
    },
    {
      icon: <BookOpen size={20} className="text-[#d4a843]" />,
      key: "features.majors",
      href: "/majors",
    },
  ];

  const pillars = [
    {
      icon: <Target size={18} className="text-[#d4a843]" />,
      key: "pillar.clear",
    },
    {
      icon: <Wallet size={18} className="text-[#d4a843]" />,
      key: "pillar.budget",
    },
    {
      icon: <GitCompareArrows size={18} className="text-[#d4a843]" />,
      key: "pillar.compare",
    },
  ];

  const steps = [
    t("preview.step1"),
    t("preview.step2"),
    t("preview.step3"),
  ];

  const factors = ["Score", "Budget", "Location", "Interests", "Language"];
  const localizedFactors = isRtl 
    ? ["المجموع", "الميزانية", "الموقع", "الاهتمامات", "اللغة"]
    : factors;

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(212,168,67,0.14),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(212,168,67,0.1),transparent_45%)]" />
            <div className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-amber/10 dark:bg-amber/5 blur-3xl" />
            <div className="absolute right-[-120px] top-10 h-96 w-96 rounded-full bg-blue/8 dark:bg-blue/5 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:grid-cols-[1.05fr,0.95fr] lg:py-24">
            <div className={`flex flex-col justify-center ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue/10 bg-white/70 dark:bg-card-bg/50 px-4 py-2 text-xs font-semibold text-blue dark:text-amber backdrop-blur border-border">
                <span className="h-2 w-2 rounded-full bg-amber animate-pulse" />
                {t("hero.badge")}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight text-blue dark:text-text-primary font-cairo sm:text-5xl lg:text-6xl">
                {t("hero.title")}
                <span className="block text-amber font-playfair italic">{t("hero.titleHighlight")}</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-text-primary/80 dark:text-text-secondary font-cairo sm:text-lg">
                {t("hero.description")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue px-8 py-4 text-base font-bold text-white transition-colors hover:bg-blue-light dark:bg-amber dark:hover:bg-amber-dark dark:text-blue-dark"
                >
                  {t("hero.ctaMatch")}
                  {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </Link>
                <Link
                  href="/universities"
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-blue/15 dark:border-border bg-white dark:bg-card-bg/40 px-8 py-4 text-base font-bold text-blue dark:text-text-primary transition-colors hover:border-amber/40 hover:bg-white dark:hover:bg-card-bg"
                >
                  {t("hero.ctaBrowse")}
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {pillars.map((pillar) => (
                  <div key={pillar.key} className="rounded-3xl border border-border bg-card-bg/40 p-4 shadow-sm backdrop-blur">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue/5 dark:bg-amber/10">
                      {pillar.icon}
                    </div>
                    <h2 className="text-sm font-bold text-blue dark:text-text-primary font-cairo">{t(`${pillar.key}.title`)}</h2>
                    <p className="mt-2 text-xs leading-6 text-text-secondary font-cairo">{t(`${pillar.key}.text`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[32px] border border-border bg-card-bg/80 p-5 shadow-[0_30px_80px_rgba(15,36,60,0.12)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur">
                <div className={`rounded-[28px] bg-blue dark:bg-blue-dark p-6 text-white ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Matching Preview</p>
                      <p className="mt-2 text-2xl font-black font-cairo">{t("preview.title")}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
                      <p className="text-[11px] text-white/60">{t("preview.fit")}</p>
                      <p className="text-xl font-black text-amber">88%</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber text-sm font-black text-white">
                          {index + 1}
                        </div>
                        <p className={`pt-1 text-sm text-white/80 font-cairo ${isRtl ? 'text-right' : 'text-left'}`}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-3xl border border-border bg-cream/50 dark:bg-blue-dark/30 p-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs uppercase tracking-wide text-text-secondary/70">{t("preview.factors")}</p>
                    <div className={`mt-3 flex flex-wrap gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                      {localizedFactors.map((item) => (
                        <span key={item} className="rounded-full bg-card-bg px-3 py-1.5 text-xs font-semibold text-blue dark:text-text-primary shadow-sm border border-border">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`rounded-3xl border border-border bg-amber/5 p-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs uppercase tracking-wide text-text-secondary/70">{isRtl ? "وضع المقارنة" : "Compare mode"}</p>
                    <p className="mt-3 text-sm leading-7 text-blue dark:text-text-primary font-cairo">
                      {t("preview.compare")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-[32px] bg-blue dark:bg-blue-dark px-6 py-8 text-center text-white shadow-xl shadow-blue/10 dark:shadow-none md:grid-cols-4">
            {[
              { value: "40+", key: "stats.universities" },
              { value: "3", key: "stats.compare" },
              { value: "1", key: "stats.profile" },
              { value: "100%", key: "stats.results" },
            ].map((item) => (
              <div key={item.key}>
                <p className="text-3xl font-black text-amber">{item.value}</p>
                <p className="mt-2 text-sm text-blue-100/70 font-cairo">{t(item.key)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className={`mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
            <div>
              <h2 className="text-3xl font-black text-blue dark:text-text-primary font-cairo">{t("features.title")}</h2>
              <p className="mt-2 text-sm text-text-secondary font-cairo">
                {t("features.subtitle")}
              </p>
            </div>
            <Link href="/onboarding" className="text-sm font-semibold text-blue dark:text-amber hover:text-amber dark:hover:text-amber-light">
              {t("features.cta")}
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className={`group rounded-[28px] border border-border bg-card-bg/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber/30 hover:shadow-lg ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-cream dark:bg-blue/20 transition-colors group-hover:bg-amber/10 dark:group-hover:bg-amber/10 ${isRtl ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-blue dark:text-text-primary font-cairo">{t(`${feature.key}.title`)}</h3>
                <p className="mt-4 text-sm leading-7 text-text-secondary font-cairo">{t(`${feature.key}.desc`)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-amber/5 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-amber font-bold">{t("cta.ready")}</p>
            <h2 className="mt-4 text-3xl font-black text-blue dark:text-text-primary font-cairo">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary font-cairo">
              {t("cta.desc")}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="rounded-2xl bg-amber px-8 py-3.5 text-base font-bold text-white dark:text-blue-dark transition-colors hover:bg-amber-dark"
              >
                {t("nav.start")}
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl border border-border bg-card-bg px-8 py-3.5 text-base font-bold text-blue dark:text-text-primary transition-colors hover:border-amber/40"
              >
                {t("cta.openCompare")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
