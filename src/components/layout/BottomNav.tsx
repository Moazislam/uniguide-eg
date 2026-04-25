"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, GitCompareArrows, User } from "lucide-react";

const items = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/universities", label: "الجامعات", icon: Search },
  { href: "/compare", label: "مقارنة", icon: GitCompareArrows },
  { href: "/profile", label: "ملفي", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-[#d4a843]/20 pb-safe">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive ? "text-[#1a3a5c]" : "text-gray-400"
              }`}
              aria-label={item.label}
            >
              <Icon size={20} className={isActive ? "text-[#d4a843]" : ""} />
              <span className="text-[10px] font-bold font-cairo">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#d4a843]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
