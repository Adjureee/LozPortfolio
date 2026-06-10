"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={`group relative grid h-12 w-20 shrink-0 place-items-center rounded-full border border-line bg-paper/70 backdrop-blur-xl ${className}`}
    >
      <span className="absolute left-3 text-muted transition group-hover:text-ink">
        <Sun size={15} />
      </span>
      <span className="absolute right-3 text-muted transition group-hover:text-ink">
        <Moon size={15} />
      </span>
      <motion.span
        className="absolute left-1 top-1 grid size-10 place-items-center rounded-full bg-ink text-paper"
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {isDark ? <Moon size={15} /> : <Sun size={15} />}
      </motion.span>
    </button>
  );
}
