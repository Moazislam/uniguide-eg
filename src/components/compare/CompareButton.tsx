"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, GitCompareArrows, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface Props {
  universityId: string;
  compact?: boolean;
}

const STORAGE_KEY = "uniguide_compare";
const MAX_COMPARE = 3;

function readCompareIds() {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCompareIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("compare-updated", { detail: ids }));
}

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(readCompareIds());
    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("compare-updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("compare-updated", sync as EventListener);
    };
  }, []);

  const toggle = (id: string) => {
    setIds((previous) => {
      let next: string[];
      if (previous.includes(id)) {
        next = previous.filter((value) => value !== id);
      } else if (previous.length < MAX_COMPARE) {
        next = [...previous, id];
      } else {
        return previous;
      }

      writeCompareIds(next);
      return next;
    });
  };

  const clear = () => {
    setIds([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("compare-updated", { detail: [] }));
    }
  };

  return { ids, toggle, clear, max: MAX_COMPARE };
}

export default function CompareButton({ universityId, compact = false }: Props) {
  const { ids, toggle, max } = useCompare();
  const { t } = useLanguage();
  const isAdded = ids.includes(universityId);
  const isFull = ids.length >= max && !isAdded;

  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(universityId);
      }}
      disabled={isFull}
      className={`flex items-center justify-center gap-1.5 rounded-xl font-cairo font-semibold transition-all ${
        compact
          ? "px-3 py-2 text-xs"
          : "px-3.5 py-2 text-sm"
      } ${
        isAdded
          ? "bg-amber text-white dark:text-blue-dark shadow-sm"
          : isFull
            ? "bg-card-bg/50 text-text-secondary/40 border border-border cursor-not-allowed"
            : "bg-blue/5 dark:bg-amber/10 text-blue dark:text-amber hover:bg-blue dark:hover:bg-amber hover:text-white dark:hover:text-blue-dark"
      }`}
    >
      {isAdded ? <Check size={14} /> : <GitCompareArrows size={14} />}
      {isAdded ? t("compare.inCompare") : isFull ? t("compare.full") : t("compare.addCompare")}
    </button>
  );
}

export function CompareTray() {
  const { ids, clear } = useCompare();
  const { t, isRtl } = useLanguage();

  if (!ids.length) return null;

  return (
    <div 
      role="complementary"
      aria-label="Compare universities"
      className={`fixed bottom-20 md:bottom-5 left-1/2 z-40 w-[min(94vw,700px)] -translate-x-1/2 rounded-2xl border border-border bg-card-bg/95 dark:bg-card-bg/80 p-3 shadow-2xl backdrop-blur-xl ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}
    >
      <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue dark:bg-amber text-white dark:text-blue-dark">
            <GitCompareArrows size={18} />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <p className="text-sm font-bold text-blue dark:text-text-primary font-cairo">
              {ids.length} {t("compare.trayTitle")}
            </p>
            <p className="text-xs text-text-secondary font-cairo">
              {t("compare.trayDesc")}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <button
            type="button"
            onClick={clear}
            className={`inline-flex items-center gap-1 rounded-xl border border-border bg-card-bg px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-red-200 hover:text-red-500 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <X size={12} />
            {t("compare.emptyTray")}
          </button>
          <Link
            href="/compare"
            className={`inline-flex items-center gap-2 rounded-xl bg-amber text-white dark:text-blue-dark px-4 py-2.5 text-sm font-bold transition-colors hover:bg-amber-dark ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}
          >
            {t("compare.open")}
            <GitCompareArrows size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
