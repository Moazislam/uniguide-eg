"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, GitCompareArrows, X } from "lucide-react";

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
          ? "bg-[#d4a843] text-white shadow-sm"
          : isFull
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-[#1a3a5c]/6 text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white"
      }`}
    >
      {isAdded ? <Check size={14} /> : <GitCompareArrows size={14} />}
      {isAdded ? "في المقارنة" : isFull ? "القائمة ممتلئة" : "أضف للمقارنة"}
    </button>
  );
}

export function CompareTray() {
  const { ids, clear } = useCompare();

  if (!ids.length) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-40 w-[min(94vw,700px)] -translate-x-1/2 rounded-2xl border border-[#1a3a5c]/10 bg-white/95 p-3 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a3a5c] text-white">
            <GitCompareArrows size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a3a5c] font-cairo">
              {ids.length} جامعة جاهزة للمقارنة
            </p>
            <p className="text-xs text-gray-500 font-cairo">
              اختر حتى 3 جامعات ثم افتح المقارنة الجانبية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:border-red-200 hover:text-red-500"
          >
            <X size={12} />
            تفريغ
          </button>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-xl bg-[#d4a843] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b8922a]"
          >
            افتح المقارنة
            <GitCompareArrows size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
