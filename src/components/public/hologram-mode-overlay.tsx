"use client";

import { useEffect, useState } from "react";

export function HologramModeOverlay() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleTrigger = () => setIsActive((prev) => !prev);
    window.addEventListener("trigger-hologram-mode", handleTrigger);
    return () => window.removeEventListener("trigger-hologram-mode", handleTrigger);
  }, []);

  useEffect(() => {
    if (!isActive) {
      document.body.classList.remove("hologram-mode-active");
      return;
    }

    document.body.classList.add("hologram-mode-active");

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen, from -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Map to degrees for rotation (e.g., max 15 degrees)
      const rotateX = y * -15; // Up/down moves around X axis
      const rotateY = x * 15;  // Left/right moves around Y axis

      document.documentElement.style.setProperty('--holo-rx', `${rotateX}deg`);
      document.documentElement.style.setProperty('--holo-ry', `${rotateY}deg`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Initial reset
    document.documentElement.style.setProperty('--holo-rx', `15deg`);
    document.documentElement.style.setProperty('--holo-ry', `-15deg`);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove("hologram-mode-active");
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
      <button 
        onClick={() => setIsActive(false)}
        className="px-4 py-2 bg-accent text-paper font-bold text-xs tracking-widest uppercase rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        Exit Hologram Mode
      </button>
    </div>
  );
}
