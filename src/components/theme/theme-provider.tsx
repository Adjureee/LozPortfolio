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
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("portfolio-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark"; // Default to dark mode explicitly
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = (event?: React.MouseEvent<HTMLElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    
    if (!document.startViewTransition) {
      applyTheme(nextTheme);
      setTheme(nextTheme);
      window.localStorage.setItem("portfolio-theme", nextTheme);
      return;
    }

    // Set custom properties for the origin of the click so CSS can animate from there
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    document.documentElement.style.setProperty("--theme-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-r", `${radius}px`);

    document.startViewTransition(() => {
      applyTheme(nextTheme);
      setTheme(nextTheme);
      window.localStorage.setItem("portfolio-theme", nextTheme);
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
