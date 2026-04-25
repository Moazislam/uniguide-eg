"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-gray-200 bg-white" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-[#d4a843] dark:hover:border-[#d4a843] transition-all shadow-sm active:scale-95"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-[#d4a843]" />
      ) : (
        <Moon size={18} className="text-[#1a3a5c]" />
      )}
    </button>
  );
}
