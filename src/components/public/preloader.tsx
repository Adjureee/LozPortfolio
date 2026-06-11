"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const BOOT_SEQUENCE = [
  { text: "Adjureee_OS [Version 2.0.4]", delay: 100 },
  { text: "(c) 2026 Loz. All rights reserved.", delay: 200 },
  { text: "", delay: 400 },
  { text: "root@adjureee:~# ./boot_portfolio.sh", delay: 800 },
  { text: "Initializing kernel architecture... [OK]", delay: 1200 },
  { text: "Mounting secure components...       [OK]", delay: 1600 },
  { text: "Bypassing firewall constraints...   [OK]", delay: 2000 },
  { text: "Decrypting core assets...           [OK]", delay: 2400 },
  { text: "", delay: 2600 },
  { text: "Loading payload into memory:", delay: 2800 }
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Simulate typing the boot sequence
    let currentLine = 0;
    const timeouts: NodeJS.Timeout[] = [];

    BOOT_SEQUENCE.forEach((item, index) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, item.text]);
        if (index === BOOT_SEQUENCE.length - 1) {
          setShowProgress(true);
        }
      }, item.delay);
      timeouts.push(t);
    });

    // Start progress simulation only after sequence completes
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (!showProgress) return 0;
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Wait briefly, then add Access Granted, then complete
          setTimeout(() => {
            setLines((l) => [...l, "", "SYSTEM ACCESS GRANTED.", "Initiating hand-off..."]);
            setTimeout(() => onComplete(), 800);
          }, 300);
          return 100;
        }
        return Math.min(prev + Math.random() * 5 + 2, 100);
      });
    }, 50);

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
    const totalBars = 30;
    const filledBars = Math.floor((percent / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    return `[${"=".repeat(filledBars)}${" ".repeat(emptyBars)}] ${Math.floor(percent)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] bg-[#050505] text-accent p-4 md:p-8 font-mono text-[10px] md:text-xs overflow-hidden"
    >
      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
           style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, var(--accent) 2px, var(--accent) 4px)` }}
      />
      
      {/* Terminal Output Area */}
      <div 
        ref={scrollRef}
        className="w-full h-full max-w-4xl mx-auto flex flex-col items-start justify-start overflow-y-auto pb-20 relative z-10 drop-shadow-[0_0_8px_rgba(0,255,0,0.4)]"
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed min-h-[1.5em]">
            {line}
          </div>
        ))}
        
        {/* Progress Bar Rendering */}
        {showProgress && progress <= 100 && (
          <div className="whitespace-pre-wrap leading-relaxed mt-2">
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




