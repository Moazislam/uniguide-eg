"use client";
import { useState, useEffect } from "react";
import { GitCompareArrows, Check } from "lucide-react";

interface Props {
  universityId: string;
}

const STORAGE_KEY = "uniguide_compare";
const MAX_COMPARE = 3;

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setIds(JSON.parse(stored));
  }, []);

  const toggle = (id: string) => {
    setIds((prev) => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter((x) => x !== id);
      } else if (prev.length < MAX_COMPARE) {
        next = [...prev, id];
      } else {
        return prev;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    setIds([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { ids, toggle, clear };
}

export default function CompareButton({ universityId }: Props) {
  const { ids, toggle } = useCompare();
  const isAdded = ids.includes(universityId);
  const isFull = ids.length >= MAX_COMPARE && !isAdded;

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(universityId); }}
      disabled={isFull}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors font-cairo ${
        isAdded
          ? "bg-[#d4a843] text-white"
          : isFull
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white"
      }`}
    >
      {isAdded ? <Check size={12} /> : <GitCompareArrows size={12} />}
      {isAdded ? "تمت الإضافة" : "قارن"}
    </button>
  );
}
