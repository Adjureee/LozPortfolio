"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { animate } from "framer-motion";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent<HTMLElement>) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("portfolio-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = (event?: React.MouseEvent<HTMLElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const x = event?.clientX ?? window.innerWidth - 72;
    const y = event?.clientY ?? 72;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const veil = document.createElement("div");
    veil.className = "theme-reveal";
    veil.style.setProperty("--x", `${x}px`);
    veil.style.setProperty("--y", `${y}px`);
    document.body.appendChild(veil);

    applyTheme(nextTheme);
    setTheme(nextTheme);
    window.localStorage.setItem("portfolio-theme", nextTheme);

    animate(0, radius, {
      type: "spring",
      stiffness: 58,
      damping: 18,
      mass: 0.9,
      onUpdate(value) {
        veil.style.clipPath = `circle(${value}px at ${x}px ${y}px)`;
      },
      onComplete() {
        veil.remove();
      }
    });
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
