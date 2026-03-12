"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/universities", label_ar: "الجامعات", label_en: "Universities" },
  { href: "/majors",       label_ar: "التخصصات",  label_en: "Majors" },
  { href: "/compare",      label_ar: "مقارنة",    label_en: "Compare" },
  { href: "/profile",      label_ar: "ملفي",      label_en: "My Profile" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#2c2c2c] hover:text-[#d4a843] transition-colors font-cairo"
              >
                {link.label_ar}
                <span className="text-xs text-gray-400 mr-1">/ {link.label_en}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/universities"
              className="flex items-center gap-1 text-sm text-[#2c2c2c] hover:text-[#d4a843] transition-colors"
            >
              <Search size={16} />
            </Link>
            <Link
              href="/onboarding"
              className="bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2a5a8c] transition-colors font-cairo"
            >
              ابدأ الآن
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#1a3a5c]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#faf7f2] border-t border-[#d4a843]/20 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-[#2c2c2c] hover:text-[#d4a843] py-2 font-cairo"
              onClick={() => setOpen(false)}
            >
              {link.label_ar} / {link.label_en}
            </Link>
          ))}
          <Link
            href="/onboarding"
            className="block bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center mt-2 font-cairo"
            onClick={() => setOpen(false)}
          >
            ابدأ الآن — Start Now
          </Link>
        </div>
      )}
    </header>
  );
}
