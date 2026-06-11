"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "INITIALIZING KERNEL ARCHITECTURE",
  "ESTABLISHING SATELLITE UPLINK",
  "BYPASSING SECURITY PROTOCOLS",
  "DECRYPTING CORE ASSETS",
  "SYSTEM ACCESS GRANTED"
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logIdx, setLogIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 800); 
          return 100;
        }
        const increment = prev < 60 ? Math.random() * 2 : Math.random() * 4 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  useEffect(() => {
    if (progress < 25) setLogIdx(0);
    else if (progress < 50) setLogIdx(1);
    else if (progress < 75) setLogIdx(2);
    else if (progress < 95) setLogIdx(3);
    else setLogIdx(4);
  }, [progress]);

  const formattedProgress = Math.floor(progress).toString().padStart(3, "0");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-[#050505] text-paper flex items-center justify-center font-mono overflow-hidden"
    >
      {/* Architectural CAD Grid Lines */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <div className="w-full h-[1px] bg-white/[0.04] absolute top-1/2 -translate-y-1/2" />
        <div className="h-full w-[1px] bg-white/[0.04] absolute left-1/2 -translate-x-1/2" />
        
        {/* Center Target - Scales dynamically */}
        <div className="w-[20vw] h-[20vw] md:w-[12vw] md:h-[12vw] max-w-[150px] max-h-[150px] border border-white/[0.03] rounded-full flex items-center justify-center">
          <div className="w-[1px] h-[10px] bg-accent/50 absolute top-0" />
          <div className="w-[1px] h-[10px] bg-accent/50 absolute bottom-0" />
          <div className="w-[10px] h-[1px] bg-accent/50 absolute left-0" />
          <div className="w-[10px] h-[1px] bg-accent/50 absolute right-0" />
        </div>
      </div>

      {/* Top Left Branding */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 flex flex-col gap-1 text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-muted z-10">
        <span className="text-paper">Adjureee_OS</span>
        <span>SYS.BUILD.2026</span>
      </div>

      {/* Top Right Coordinates (Hidden on mobile to prevent overlap) */}
      <div className="hidden md:flex absolute top-10 right-10 flex-col items-end gap-1 text-[10px] uppercase tracking-[0.3em] text-muted z-10">
        <span className="text-accent drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
          P_ID: {Math.floor(progress * 8.432).toString().padStart(4, "0")}
        </span>
        <span>LAT: 14.5995 N, 120.9842 E</span>
      </div>

      {/* Center Bisection Progress Line (Behind Text) */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-10">
        <motion.div 
          className="h-full bg-accent drop-shadow-[0_0_12px_rgba(0,255,0,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Massive Typography Counter */}
      <div className="relative z-20 flex items-end mix-blend-difference pointer-events-none">
        <div className="text-[35vw] md:text-[25vw] leading-[0.8] font-bold tracking-tighter text-paper">
          <AnimatePresence mode="popLayout">
            {formattedProgress.split('').map((digit, i) => (
              <motion.span
                key={`${i}-${digit}`}
                initial={{ y: "50%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-50%", opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-[6vw] md:text-[4vw] text-accent mb-[3vw] md:mb-[2vw] ml-2 font-light tracking-widest">%</div>
      </div>

      {/* Bottom HUD Logs */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-[8px] md:text-[10px] text-muted uppercase tracking-widest flex flex-col gap-2 z-10 w-[80%] md:w-full max-w-[300px]">
        <div className="w-16 md:w-full h-[1px] bg-white/[0.1]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={logIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2 text-paper"
          >
            <span className="text-accent mt-[2px]">{">"}</span> 
            <span className="leading-tight">{BOOT_LOGS[logIdx]}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="w-2 h-3 bg-accent inline-block mt-[1px] shrink-0"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Right Data stream indicator (Hidden on mobile) */}
      <div className="hidden md:flex absolute bottom-10 right-10 flex-col items-end gap-2 text-[10px] text-muted uppercase tracking-widest z-10">
        <div className="w-16 h-[1px] bg-white/[0.1]" />
        <div className="flex items-center gap-3 text-paper">
          <span>{progress === 100 ? "UNLOCKED" : "DECRYPTING"}</span>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border border-accent border-t-transparent rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}



