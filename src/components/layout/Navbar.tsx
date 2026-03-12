"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, User, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/universities", label_ar: "الجامعات",  label_en: "Universities" },
  { href: "/majors",       label_ar: "التخصصات",   label_en: "Majors" },
  { href: "/compare",      label_ar: "مقارنة",     label_en: "Compare" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur border-b border-[#d4a843]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a3a5c] flex items-center justify-center">
              <span className="text-[#d4a843] font-bold text-sm font-cairo">U</span>
            </div>
            <span className="font-bold text-[#1a3a5c] text-lg font-cairo">UniGuide</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-[#2c2c2c] hover:text-[#d4a843] transition-colors font-cairo">
                {link.label_ar}
                <span className="text-xs text-gray-400 mr-1">/ {link.label_en}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/profile"
                className="flex items-center gap-2 bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2a5a8c] transition-colors font-cairo">
                <User size={15} />
                ملفي
              </Link>
            ) : (
              <>
                <Link href="/auth"
                  className="flex items-center gap-1 text-sm text-[#1a3a5c] font-semibold hover:text-[#d4a843] transition-colors font-cairo">
                  <LogIn size={15} />
                  دخول
                </Link>
                <Link href="/onboarding"
                  className="bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2a5a8c] transition-colors font-cairo">
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
