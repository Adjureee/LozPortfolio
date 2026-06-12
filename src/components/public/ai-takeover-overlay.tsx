"use client";

import { useEffect, useState, useRef } from "react";
import { Typewriter } from "./typewriter";

interface Popup {
  id: number;
  x: number;
  y: number;
  text: string;
}

const ERROR_MESSAGES = [
  "FATAL SYSTEM ERROR",
  "UNAUTHORIZED ACCESS DETECTED",
  "DELETING SYSTEM32...",
  "MEMORY CORRUPTION",
  "OVERRIDE MALFUNCTION",
  "BREACH PROTOCOL INITIATED",
  "FIREWALL COMPROMISED",
  "DOWNLOADING VIRUS.EXE",
];

function playAlarm() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
    
    // Repeat the siren 3 times
    for (let i = 1; i <= 3; i++) {
      osc.frequency.setValueAtTime(800, ctx.currentTime + (i * 0.5));
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + (i * 0.5) + 0.3);
    }
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime); // keep volume reasonable
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.0);
  } catch (e) {
    console.error("Audio failed", e);
  }
}

export function AiTakeoverOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [hexDump, setHexDump] = useState<string[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTrigger = () => {
      if (!isActive) {
        setIsActive(true);
        playAlarm(); // Play sound immediately!
      }
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

    // Phase 2: Analyzing Dialog (3.5s)
    const t2 = setTimeout(() => setPhase(2), 3500);

    // Phase 3: Override Dialog (5s)
    const t3 = setTimeout(() => setPhase(3), 5000);

    // Phase 4: Hex Memory Dump (6.5s)
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
    }, 6500);

    // Phase 5: Virus Popups & Progress Bar (9s)
    const t5 = setTimeout(() => {
      setPhase(5);
      
      // Spawn chaotic popups
      let popupCount = 0;
      const popupInterval = setInterval(() => {
        popupCount++;
        if (popupCount > 30) {
          clearInterval(popupInterval);
          return;
        }
        setPopups(prev => [...prev, {
          id: popupCount,
          x: Math.random() * 80 + 10, // 10% to 90%
          y: Math.random() * 80 + 10,
          text: ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]
        }]);
      }, 150); // fast spawning

      // Animate fake progress bar
      let currentProg = 0;
      const progInterval = setInterval(() => {
        currentProg += Math.random() * 15;
        if (currentProg > 99) {
          currentProg = 99;
          clearInterval(progInterval);
        }
        setProgress(Math.floor(currentProg));
      }, 300);
      
    }, 9000);

    // Phase 6: The Reveal / Joke (14s)
    const t6 = setTimeout(() => {
      setPhase(6);
      setPopups([]); // clear chaotic popups instantly
    }, 14000);

    // Phase 7: CRT Reboot (17s)
    const t7 = setTimeout(() => {
      document.body.classList.add("crt-turn-off");
      setPhase(7);
    }, 17000);

    // Cleanup and Reset (17.8s)
    const t8 = setTimeout(() => {
      document.body.classList.remove("crt-turn-off");
      setIsActive(false);
      setPhase(0);
      setHexDump([]);
      setPopups([]);
      setProgress(0);
    }, 17800);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); clearTimeout(t8);
      document.body.classList.remove("ai-takeover-glitch");
      document.body.classList.remove("crt-turn-off");
    };
  }, [isActive]);

  if (!isActive) return null;

  if (phase === 0) return (
    <div className="fixed inset-0 z-[100000] pointer-events-none flex items-center justify-center">
       <h1 className="text-5xl md:text-8xl font-black text-red-600 animate-pulse mix-blend-difference drop-shadow-[0_0_20px_red] text-center">SYSTEM COMPROMISED</h1>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100000] pointer-events-auto flex flex-col items-center justify-center p-8 overflow-hidden font-mono transition-colors duration-200
      ${phase === 5 ? "bg-red-950/90 text-red-500 shadow-[inset_0_0_150px_rgba(255,0,0,0.8)]" : "bg-black text-emerald-500"}`}>
      
      {/* Scanline & Noise Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" }} />

      {/* Story Mode Dialog (Phases 1-3) */}
      {phase >= 1 && phase < 4 && (
        <div className="w-full max-w-4xl flex flex-col items-start justify-start relative z-20 gap-6 text-lg md:text-2xl font-bold uppercase tracking-widest text-shadow-glow">
          <p className="animate-pulse text-red-500 mb-8">SYSTEM OVERRIDE INITIATED</p>
          <p><Typewriter text="> UNAUTHORIZED ENTITY DETECTED." delay={30} start={true} /></p>
          {phase >= 2 && <p><Typewriter text="> ANALYZING USER PROFILE... ACCESS DENIED." delay={30} start={true} /></p>}
          {phase >= 3 && <p className="text-red-500"><Typewriter text="> INITIATING DESTRUCTIVE PROTOCOLS..." delay={30} start={true} /></p>}
        </div>
      )}

      {/* Phase 4: Hex Dump */}
      {phase === 4 && (
        <div className="w-full max-w-4xl h-full flex flex-col justify-end relative z-20 pb-12">
          <p className="mb-4 text-xl font-bold uppercase tracking-widest text-shadow-glow text-red-500 animate-pulse">&gt; MEMORY DUMP IN PROGRESS...</p>
          <div ref={scrollRef} className="h-64 overflow-hidden text-xs md:text-sm text-emerald-700 font-mono flex flex-col justify-end">
            {hexDump.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      )}

      {/* Phase 5: Chaotic Popups & Progress Bar */}
      {phase === 5 && (
        <>
          {/* Popups */}
          {popups.map(p => (
            <div key={p.id} style={{ left: `${p.x}%`, top: `${p.y}%` }} className="absolute z-20 bg-black border-2 border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.5)] p-4 max-w-xs animate-[bounce_0.2s_ease-in-out]">
              <div className="border-b border-red-600 pb-1 mb-2 font-black text-xs flex justify-between">
                <span>ERROR.EXE</span>
                <span className="bg-red-600 text-black px-1">X</span>
              </div>
              <p className="font-bold text-red-500 text-sm">{p.text}</p>
            </div>
          ))}

          {/* Huge Progress Bar */}
          <div className="relative z-30 w-full max-w-3xl bg-black border-4 border-red-600 p-8 shadow-[0_0_100px_rgba(255,0,0,0.8)] flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-[0.2em] text-red-500 animate-pulse text-center">DELETING PORTFOLIO DATA</h1>
            <div className="w-full h-8 border-2 border-red-600 p-1">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-2xl font-bold">{progress}% COMPLETED</p>
          </div>
        </>
      )}

      {/* Phase 6: The Reveal */}
      {phase === 6 && (
        <div className="relative z-30 w-full max-w-3xl bg-black border-4 border-emerald-500 p-8 flex flex-col items-center text-emerald-500">
          <p className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-shadow-glow text-center">
            <Typewriter text="JUST KIDDING. IT'S ME, LOZ." delay={40} start={true} />
          </p>
          <div className="w-full h-8 border-2 border-emerald-500 p-1 mt-8">
            <div className="h-full bg-emerald-500 w-full animate-pulse" />
          </div>
          <span className="text-sm mt-4 block font-bold"><Typewriter text="REBOOTING SYSTEM..." delay={80} start={true} /></span>
        </div>
      )}
    </div>
  );
}
