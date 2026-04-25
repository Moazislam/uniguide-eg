"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import React from "react";

import { useLanguage } from "@/lib/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  const { t, isRtl } = useLanguage();

  return (
    <nav className="flex items-center gap-2 text-xs font-cairo mb-6 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar" aria-label="Breadcrumb">
      <Link
        href="/"
        className="text-gray-400 hover:text-[#d4a843] transition-colors flex items-center gap-1"
        aria-label={t("nav.home")}
      >
        <Home size={14} />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          {isRtl ? <ChevronLeft size={12} className="text-gray-300 shrink-0" /> : <ChevronRight size={12} className="text-gray-300 shrink-0" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-400 hover:text-[#d4a843] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1a3a5c] font-bold" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
