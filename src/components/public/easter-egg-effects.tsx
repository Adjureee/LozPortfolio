"use client";

import { useEffect } from "react";

export function EasterEggEffects() {
  useEffect(() => {
    let keys = "";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys += e.key.toLowerCase();
      
      // Keep only last 10 characters to prevent memory leaks
      if (keys.length > 10) keys = keys.slice(-10);

      // 1. "Do a Barrel Roll"
      if (keys.includes("roll")) {
        // Prevent stacking the animation if it's already running
        if (!document.body.classList.contains("animate-barrel-roll")) {
          document.body.classList.add("animate-barrel-roll");
          setTimeout(() => document.body.classList.remove("animate-barrel-roll"), 2000);
        }
        keys = "";
      }

      // 2. Earthquake / Shake
      if (keys.includes("shake")) {
        if (!document.body.classList.contains("animate-earthquake")) {
          document.body.classList.add("animate-earthquake");
          setTimeout(() => document.body.classList.remove("animate-earthquake"), 2500);
        }
        keys = "";
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
