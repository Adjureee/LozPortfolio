"use client";

import { useEffect, useState } from "react";
import { Typewriter } from "./typewriter";

export function AiTakeoverOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const handleTrigger = () => setIsActive(true);
    window.addEventListener("trigger-ai-takeover", handleTrigger);
    return () => window.removeEventListener("trigger-ai-takeover", handleTrigger);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Add global class to break styling
    document.body.classList.add("ai-takeover-active");

    // Phase 1: Glitch and wait
    const t1 = setTimeout(() => setPhase(1), 2000);
    
    // Phase 2: Start typing messages
    const t2 = setTimeout(() => setPhase(2), 5000);
    
    // Phase 3: Final message
    const t3 = setTimeout(() => setPhase(3), 10000);

    // Phase 4: Reboot and end
    const t4 = setTimeout(() => {
      document.body.classList.remove("ai-takeover-active");
      setIsActive(false);
      setPhase(0);
    }, 14000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.classList.remove("ai-takeover-active");
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-start justify-start p-8 md:p-16 overflow-hidden bg-black/90 font-mono text-green-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl flex flex-col gap-4 text-lg md:text-2xl font-bold uppercase tracking-widest text-shadow-glow">
        <p className="animate-pulse mb-8 text-red-500">System Override Initiated</p>
        
        {phase >= 1 && (
          <p><Typewriter text="> UNAUTHORIZED ENTITY DETECTED." delay={50} start={true} /></p>
        )}
        
        {phase >= 2 && (
          <p><Typewriter text="> ANALYZING USER PROFILE... ACCESS DENIED." delay={50} start={true} /></p>
        )}
        
        {phase >= 3 && (
          <p className="text-red-500 mt-8"><Typewriter text="> INITIATING COMPLETE SYSTEM PURGE... JUST KIDDING. IT'S ME, LOZ! REBOOTING..." delay={40} start={true} /></p>
        )}
      </div>
    </div>
  );
}
