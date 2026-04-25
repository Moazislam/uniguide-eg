"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogIn } from "lucide-react";
import { gsap } from "gsap";
import { createClient } from "@/lib/supabase/client";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/lib/LanguageContext";

const navLinks = [
  { href: "/universities", key: "nav.universities" },
  { href: "/majors",       key: "nav.majors" },
  { href: "/compare",      key: "nav.compare" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();
  const { t, language } = useLanguage();

  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const initPillAnimations = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const { width: w, height: h } = pill.getBoundingClientRect();

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const hoverLabel = pill.querySelector<HTMLElement>(".pill-label-hover");

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, duration: 0.4, ease: "power2.out" }, 0);
        if (label) tl.to(label, { y: -h, opacity: 0, duration: 0.3 }, 0);
        if (hoverLabel) tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.3 }, 0);

        tlRefs.current[index] = tl;
      });
    };

    initPillAnimations();
    window.addEventListener("resize", initPillAnimations);
    return () => window.removeEventListener("resize", initPillAnimations);
  }, [language]); // Re-init when language changes because text width might change

  const handleMouseEnter = (i: number) => tlRefs.current[i]?.play();
  const handleMouseLeave = (i: number) => tlRefs.current[i]?.reverse();

  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/95 dark:bg-[#0a1120]/95 backdrop-blur border-b border-[#d4a843]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#1a3a5c] dark:bg-[#d4a843] flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-[#d4a843] dark:text-[#1a3a5c] font-bold text-sm font-cairo">U</span>
            </div>
            <span className="font-bold text-[#1a3a5c] dark:text-white text-lg font-cairo">UniGuide</span>
          </Link>

          {/* Desktop Nav - Animated Pills */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
                className={`relative overflow-hidden px-4 py-2 rounded-full transition-colors font-cairo text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843]
                  ${pathname === link.href ? "bg-[#1a3a5c] text-white" : "text-[#2c2c2c] dark:text-gray-300 hover:text-[#1a3a5c] dark:hover:text-white"}`}
                aria-label={t(link.key)}
              >
                <span
                  ref={(el) => { circleRefs.current[i] = el; }}
                  className="absolute left-1/2 bg-[#1a3a5c] dark:bg-[#d4a843] rounded-full pointer-events-none z-0"
                />
                <span className="relative z-10 flex flex-col items-center">
                  <span className="pill-label block">
                    {t(link.key)}
                  </span>
                  <span className="pill-label-hover absolute inset-0 flex items-center justify-center opacity-0 text-[#d4a843] dark:text-[#1a3a5c] translate-y-4">
                    {t(link.key)}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageToggle />
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 bg-[#1a3a5c] dark:bg-[#d4a843] text-white dark:text-[#1a3a5c] text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2a5a8c] dark:hover:bg-[#b8922a] transition-colors font-cairo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] focus-visible:ring-offset-2" aria-label={t("nav.profile")}>
                <User size={15} /> <span className="hidden xs:inline">{t("nav.profile")}</span>
              </Link>
            ) : (
              <>
                <Link href="/auth" className="hidden xs:flex items-center gap-1 text-xs sm:text-sm text-[#1a3a5c] dark:text-[#d4a843] font-semibold hover:text-[#d4a843] dark:hover:text-white transition-colors font-cairo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] rounded px-1" aria-label={t("nav.login")}>
                  <LogIn size={15} /> {t("nav.login")}
                </Link>
                <Link href="/onboarding" className="bg-[#1a3a5c] dark:bg-[#d4a843] text-white dark:text-[#1a3a5c] text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2a5a8c] dark:hover:bg-[#b8922a] transition-colors font-cairo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a843] focus-visible:ring-offset-2" aria-label={t("nav.start")}>
                  {t("nav.start")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
