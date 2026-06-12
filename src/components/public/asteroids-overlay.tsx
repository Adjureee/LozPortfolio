"use client";

import { useEffect, useState } from "react";

export function AsteroidsOverlay() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      if (!isActive) {
        setIsActive(true);
        // Inject the Kick Ass script
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://hi.kickassapp.com/kickass.js";
        document.body.appendChild(s);
      }
    };
    
    window.addEventListener("trigger-asteroids-mode", handleTrigger);
    return () => window.removeEventListener("trigger-asteroids-mode", handleTrigger);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
      <div className="px-4 py-2 bg-red-600/90 text-white font-bold text-xs tracking-widest uppercase rounded-full shadow-[0_0_15px_red] animate-pulse">
        Asteroids Deployed. Press Space to Shoot.
      </div>
    </div>
  );
}
