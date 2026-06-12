"use client";

import { useEffect, useState, useRef } from "react";

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
    
    // Phase 1: Cut to Black (2s)
    const t1 = setTimeout(() => {
      document.body.classList.remove("ai-takeover-glitch");
      setPhase(1);
    }, 2000);

    // Phase 2: Hex Memory Dump (3.5s)
    const t2 = setTimeout(() => {
      setPhase(2);
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
    }, 3500);

    // Phase 3: The Red Threat (6.5s)
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 6500);

    // Phase 4: The Reveal / Joke (10.5s)
    const t4 = setTimeout(() => {
      setPhase(4);
    }, 10500);

    // Phase 5: CRT Reboot (13.5s)
    const t5 = setTimeout(() => {
      document.body.classList.add("crt-turn-off");
      setPhase(5);
    }, 13500);

    // Cleanup and Reset (14.2s)
    const t6 = setTimeout(() => {
      document.body.classList.remove("crt-turn-off");
      setIsActive(false);
      setPhase(0);
      setHexDump([]);
    }, 14200);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); 
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
      document.body.classList.remove("ai-takeover-glitch");
      document.body.classList.remove("crt-turn-off");
    };
  }, [isActive]);

  if (!isActive) return null;

  // Phase 0: We don't render an overlay yet, the CSS glitch class on body handles it.
  if (phase === 0) return null;

  return (
    <div className={`fixed inset-0 z-[100000] pointer-events-auto flex flex-col items-center justify-center p-8 overflow-hidden font-mono transition-colors duration-500
      ${phase === 3 ? "bg-red-950/90 text-red-500 shadow-[inset_0_0_150px_rgba(255,0,0,0.8)]" : "bg-black text-emerald-500"}`}>
      
      {/* Scanline & Noise Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" }} />

      {/* Phase 1: Blinking Cursor */}
      {phase === 1 && (
        <div className="w-full max-w-4xl flex items-start justify-start relative z-20">
          <span className="w-4 h-6 bg-emerald-500 animate-pulse" />
        </div>
      )}

      {/* Phase 2: Hex Dump & Initialization */}
      {phase === 2 && (
        <div className="w-full max-w-4xl h-full flex flex-col justify-end relative z-20 pb-12">
          <p className="mb-4 text-xl font-bold uppercase tracking-widest text-shadow-glow">&gt; OVERRIDE PROTOCOL INITIATED...</p>
          <div ref={scrollRef} className="h-64 overflow-hidden text-xs md:text-sm text-emerald-700 font-mono flex flex-col justify-end">
            {hexDump.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      )}

      {/* Phase 3: The Red Threat */}
      {phase === 3 && (
        <div className="relative z-20 flex flex-col items-center text-center animate-pulse">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-[0.5em] text-red-500 [text-shadow:0_0_20px_red]">CRITICAL BREACH</h1>
          <p className="text-xl md:text-2xl uppercase tracking-widest">DELETING PORTFOLIO DATA...</p>
        </div>
      )}

      {/* Phase 4: The Reveal */}
      {phase === 4 && (
        <div className="relative z-20 flex flex-col items-center text-center text-emerald-500">
          <p className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-shadow-glow">
            JUST KIDDING. IT&apos;S ME, LOZ. <br/><span className="text-sm mt-4 block text-emerald-700">REBOOTING SYSTEM...</span>
          </p>
        </div>
      )}
    </div>
  );
}
