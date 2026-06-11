"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const ASCII_ART = `
    __    ____  ____ 
   / /   / __ \\/__  /
  / /   / / / /  / / 
 / /___/ /_/ /  / /__
/_____/\\____/  /____/
`;

const CORE_SEQUENCE = [
  { text: "Adjureee_OS [Version 2.0.4] kernel initialized.", delay: 100, color: "text-accent" },
  { text: "Copyright (c) 2026 Loz Corporation. All rights reserved.", delay: 200, color: "text-muted" },
  { text: "", delay: 400, color: "" },
  { text: "root@adjureee:~# ./boot_portfolio.sh --force --bypass", delay: 800, color: "text-paper font-bold" },
  { text: "[ OK ] Mounting root filesystem...", delay: 1200, color: "text-accent" },
  { text: "[ OK ] Initializing network interfaces...", delay: 1300, color: "text-accent" },
  { text: "[WARN] Firewall anomaly detected. Attempting bypass...", delay: 1600, color: "text-yellow-500" },
  { text: "[ OK ] Firewall bypassed successfully.", delay: 2200, color: "text-accent" },
  { text: "[ OK ] Establishing encrypted satellite uplink...", delay: 2400, color: "text-accent" },
];

function generateHexLog() {
  const addr = "0x" + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0').toUpperCase();
  const val1 = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase();
  const val2 = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase();
  const val3 = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase();
  const val4 = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase();
  return `ALLOC MEM: ${addr}  ${val1} ${val2} ${val3} ${val4}`;
}

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<{ text: string, color: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    const timeouts: NodeJS.Timeout[] = [];

    // 1. Initial Core Sequence
    CORE_SEQUENCE.forEach((item) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, { text: item.text, color: item.color }]);
      }, item.delay);
      timeouts.push(t);
    });

    // 2. Fast Scrolling Memory Dump Simulation (Starts after core sequence)
    const fastScrollDelay = 2600;
    const fastScrollDuration = 1000;
    const tFast = setTimeout(() => {
      const scrollInterval = setInterval(() => {
        setLines((prev) => [...prev.slice(-40), { text: generateHexLog(), color: "text-muted opacity-50" }]);
      }, 30);
      
      setTimeout(() => {
        clearInterval(scrollInterval);
        setLines((prev) => [
          ...prev, 
          { text: "", color: "" },
          { text: "[ OK ] Memory payload decrypted.", color: "text-accent" },
          { text: "Extracting core assets into VRAM:", color: "text-paper" }
        ]);
        setShowProgress(true);
      }, fastScrollDuration);
      
      timeouts.push(scrollInterval as unknown as NodeJS.Timeout);
    }, fastScrollDelay);
    timeouts.push(tFast);

    // 3. Progress Simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (!showProgress) return 0;
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setLines((l) => [
              ...l, 
              { text: "", color: "" },
              { text: ">>> SYSTEM ACCESS GRANTED <<<", color: "text-accent font-bold text-sm bg-accent/20 px-2 inline-block" },
              { text: "Initiating visual hand-off...", color: "text-muted" }
            ]);
            setTimeout(() => onComplete(), 900);
          }, 300);
          return 100;
        }
        return Math.min(prev + Math.random() * 8 + 1, 100);
      });
    }, 40);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(progressInterval);
      document.body.style.overflow = "";
    };
  }, [showProgress, onComplete]);

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, progress]);

  // Generate ASCII progress bar
  const generateProgressBar = (percent: number) => {
    const totalBars = 40;
    const filledBars = Math.floor((percent / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    return `[${"#".repeat(filledBars)}${".".repeat(emptyBars)}] ${Math.floor(percent)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-[#020202] text-accent p-4 md:p-8 font-mono text-[10px] md:text-xs overflow-hidden selection:bg-accent selection:text-ink"
    >
      {/* Heavy CRT Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-20"
           style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,0,0.1) 1px, rgba(0,255,0,0.1) 2px)` }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20"
           style={{ background: 'radial-gradient(circle, transparent 50%, #000 120%)' }}
      />
      
      {/* Terminal Output Area */}
      <div 
        ref={scrollRef}
        className="w-full h-full max-w-4xl mx-auto flex flex-col items-start justify-start overflow-y-auto pb-20 relative z-10 drop-shadow-[0_0_6px_rgba(0,255,0,0.3)] pr-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for immersion
      >
        <pre className="text-accent font-bold mb-4 leading-tight opacity-90 drop-shadow-[0_0_10px_var(--accent)]">
          {ASCII_ART}
        </pre>

        {lines.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap leading-relaxed min-h-[1.2em] ${line.color}`}>
            {line.text}
          </div>
        ))}
        
        {/* Progress Bar Rendering */}
        {showProgress && progress <= 100 && (
          <div className="whitespace-pre-wrap leading-relaxed mt-2 text-accent font-bold drop-shadow-[0_0_8px_var(--accent)]">
            {generateProgressBar(progress)}
          </div>
        )}

        {/* Blinking Cursor */}
        <motion.div 
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-2 h-4 bg-accent mt-1 inline-block"
        />
      </div>
    </motion.div>
  );
}





