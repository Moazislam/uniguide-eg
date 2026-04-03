"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogIn } from "lucide-react";
import { gsap } from "gsap";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/universities", label_ar: "الجامعات", label_en: "Universities" },
  { href: "/majors",       label_ar: "التخصصات", label_en: "Majors" },
  { href: "/compare",      label_ar: "مقارنة",   label_en: "Compare" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

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
  }, []);

  const handleMouseEnter = (i: number) => tlRefs.current[i]?.play();
  const handleMouseLeave = (i: number) => tlRefs.current[i]?.reverse();

  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur border-b border-[#d4a843]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#1a3a5c] flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-[#d4a843] font-bold text-sm font-cairo">U</span>
            </div>
            <span className="font-bold text-[#1a3a5c] text-lg font-cairo">UniGuide</span>
          </Link>

          {/* Desktop Nav - Animated Pills */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
                className={`relative overflow-hidden px-4 py-2 rounded-full transition-colors font-cairo text-sm font-medium
                  ${pathname === link.href ? "bg-[#1a3a5c] text-white" : "text-[#2c2c2c]"}`}
              >
                <span
                  ref={(el) => { circleRefs.current[i] = el; }}
                  className="absolute left-1/2 bg-[#1a3a5c] rounded-full pointer-events-none z-0"
                />
                <span className="relative z-10 flex flex-col items-center">
                  <span className="pill-label block">
                    {link.label_ar} <span className="text-[10px] opacity-60">/ {link.label_en}</span>
                  </span>
                  <span className="pill-label-hover absolute inset-0 flex items-center justify-center opacity-0 text-[#d4a843] translate-y-4">
                    {link.label_ar}
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2a5a8c] transition-colors font-cairo">
                <User size={15} /> ملفي
              </Link>
            ) : (
              <>
                <Link href="/auth" className="flex items-center gap-1 text-sm text-[#1a3a5c] font-semibold hover:text-[#d4a843] transition-colors font-cairo">
                  <LogIn size={15} /> دخول
                </Link>
                <Link href="/onboarding" className="bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2a5a8c] transition-colors font-cairo">
                  ابدأ الآن
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-[#1a3a5c]" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#faf7f2] border-t border-[#d4a843]/20 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="block text-sm font-medium text-[#2c2c2c] hover:text-[#d4a843] py-2 font-cairo"
              onClick={() => setOpen(false)}>
              {link.label_ar} / {link.label_en}
            </Link>
          ))}
          {user ? (
            <Link href="/profile"
              className="block bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center font-cairo"
              onClick={() => setOpen(false)}>
              ملفي الشخصي
            </Link>
          ) : (
            <Link href="/auth"
              className="block bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center font-cairo"
              onClick={() => setOpen(false)}>
              سجّل دخولك / Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}