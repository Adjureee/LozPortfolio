"use client";

import { useEffect, useState, useRef } from "react";
import { Typewriter } from "./typewriter";

export function AiTakeoverOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [hexDump, setHexDump] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTrigger = () => {
      if (!isActive) setIsActive(true);
    };
    window.addEventListener("trigger-ai-takeover", handleTrigger);
    return () => window.removeEventListener("trigger-ai-takeover", handleTrigger);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    // Phase 0: The Glitch Infection (0s to 2s)
    document.body.classList.add("ai-takeover-glitch");
    
    // Phase 1: Cut to Black & Dialog starts (2s)
    const t1 = setTimeout(() => {
      document.body.classList.remove("ai-takeover-glitch");
      setPhase(1);
    }, 2000);

    // Phase 2: Analyzing Dialog (4s)
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 4000);

    // Phase 3: Override Dialog (6s)
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 6000);

    // Phase 4: Hex Memory Dump (8s)
    const t4 = setTimeout(() => {
      setPhase(4);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count > 50) {
          clearInterval(interval);
          return;
        }
        const newLines = Array.from({ length: 5 }).map(() => {
          const addr = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
          const data = Array.from({ length: 8 }).map(() => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join(' ');
          return `0x${addr}  ${data}`;
        });
        setHexDump(prev => [...prev, ...newLines].slice(-100)); // keep last 100
        
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    }, 8000);

    // Phase 5: The Red Threat (11s)
    const t5 = setTimeout(() => {
      setPhase(5);
    }, 11000);

    // Phase 6: The Reveal / Joke (15s)
    const t6 = setTimeout(() => {
      setPhase(6);
    }, 15000);

    // Phase 7: CRT Reboot (18s)
    const t7 = setTimeout(() => {
      document.body.classList.add("crt-turn-off");
      setPhase(7);
    }, 18000);

    // Cleanup and Reset (18.7s)
    const t8 = setTimeout(() => {
      document.body.classList.remove("crt-turn-off");
      setIsActive(false);
      setPhase(0);
      setHexDump([]);
    }, 18700);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); clearTimeout(t8);
      document.body.classList.remove("ai-takeover-glitch");
      document.body.classList.remove("crt-turn-off");
    };
  }, [isActive]);

  if (!isActive) return null;

  // Phase 0: We don't render an overlay yet, the CSS glitch class on body handles it.
  if (phase === 0) return null;

  return (
    <div className={`fixed inset-0 z-[100000] pointer-events-auto flex flex-col items-center justify-center p-8 overflow-hidden font-mono transition-colors duration-500
      ${phase === 5 ? "bg-red-950/90 text-red-500 shadow-[inset_0_0_150px_rgba(255,0,0,0.8)]" : "bg-black text-emerald-500"}`}>
      
      {/* Scanline & Noise Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" }} />

      {/* Story Mode Dialog (Phases 1-3) */}
      {phase >= 1 && phase < 4 && (
        <div className="w-full max-w-4xl flex flex-col items-start justify-start relative z-20 gap-6 text-lg md:text-2xl font-bold uppercase tracking-widest text-shadow-glow">
          <p className="animate-pulse text-red-500 mb-8">SYSTEM OVERRIDE INITIATED</p>
          
          <p><Typewriter text="> UNAUTHORIZED ENTITY DETECTED." delay={40} start={true} /></p>
          
          {phase >= 2 && (
            <p><Typewriter text="> ANALYZING USER PROFILE... ACCESS DENIED." delay={40} start={true} /></p>
          )}

          {phase >= 3 && (
            <p className="text-red-500"><Typewriter text="> INITIATING DESTRUCTIVE PROTOCOLS..." delay={40} start={true} /></p>
          )}
        </div>
      )}

      {/* Phase 4: Hex Dump & Initialization */}
      {phase === 4 && (
        <div className="w-full max-w-4xl h-full flex flex-col justify-end relative z-20 pb-12">
          <p className="mb-4 text-xl font-bold uppercase tracking-widest text-shadow-glow text-red-500">&gt; MEMORY DUMP IN PROGRESS...</p>
          <div ref={scrollRef} className="h-64 overflow-hidden text-xs md:text-sm text-emerald-700 font-mono flex flex-col justify-end">
            {hexDump.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      )}

      {/* Phase 5: The Red Threat */}
      {phase === 5 && (
        <div className="relative z-20 flex flex-col items-center text-center animate-pulse">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-[0.5em] text-red-500 [text-shadow:0_0_20px_red]">CRITICAL BREACH</h1>
          <p className="text-xl md:text-2xl uppercase tracking-widest">DELETING PORTFOLIO DATA...</p>
        </div>
      )}

      {/* Phase 6: The Reveal */}
      {phase === 6 && (
        <div className="relative z-20 flex flex-col items-center text-center text-emerald-500">
          <p className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-shadow-glow">
            <Typewriter text="JUST KIDDING. IT'S ME, LOZ." delay={50} start={true} />
            <span className="text-sm mt-4 block text-emerald-700"><Typewriter text="REBOOTING SYSTEM..." delay={100} start={true} /></span>
          </p>
        </div>
      )}
    </div>
  );
}
