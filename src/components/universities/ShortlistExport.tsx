"use client";

import { useState } from "react";
import { Download, Share2, Link as LinkIcon, Check } from "lucide-react";
import type { University } from "@/types";
import { useLanguage } from "@/lib/LanguageContext";
import jsPDF from "jspdf";

interface Props {
  universities: University[];
}

export default function ShortlistExport({ universities }: Props) {
  const { t, isRtl, language } = useLanguage();
  const isAr = language === "ar";
  const [copying, setCopying] = useState(false);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = isAr ? "My UniGuide Shortlist" : "My UniGuide Shortlist"; // jsPDF has limited RTL support without extra fonts
    
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    doc.setFontSize(12);
    universities.forEach((uni, index) => {
      const y = 40 + (index * 30);
      const name = uni.name_en; // Use English for PDF export due to font limitations
      const info = `${uni.location_en} | ${uni.type} | ${uni.system}`;
      const tuition = uni.tuition_min ? `Starting from: ${uni.tuition_min.toLocaleString()} EGP` : "Tuition: —";
      
      doc.text(`${index + 1}. ${name}`, 20, y);
      doc.setFontSize(10);
      doc.text(info, 25, y + 7);
      doc.text(tuition, 25, y + 14);
      doc.setFontSize(12);
    });

    doc.save("uniguide-shortlist.pdf");
  };

  const shareShortlist = () => {
    const ids = universities.map(u => u.id).join(",");
    const url = `${window.location.origin}/shared/shortlist?ids=${ids}`;
    
    if (navigator.share) {
      navigator.share({
        title: "My UniGuide Shortlist",
        text: "Check out the universities I'm considering on UniGuide Egypt!",
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  if (universities.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue/5 dark:bg-amber/10 text-blue dark:text-amber text-xs font-bold font-cairo hover:bg-blue/10 dark:hover:bg-amber/20 transition-all border border-blue/10 dark:border-amber/10"
      >
        <Download size={14} />
        {isAr ? "تحميل PDF" : "Download PDF"}
      </button>
      
      <button
        onClick={shareShortlist}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue dark:bg-amber text-white dark:text-blue-dark text-xs font-bold font-cairo hover:bg-blue-light dark:hover:bg-amber-dark transition-all shadow-md shadow-blue/20 dark:shadow-amber/10"
      >
        {copying ? <Check size={14} /> : <Share2 size={14} />}
        {copying ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "مشاركة" : "Share")}
      </button>
    </div>
  );
}
