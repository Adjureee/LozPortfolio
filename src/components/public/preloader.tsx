"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "Initializing core architecture...",
  "Mounting graphical interfaces...",
  "Bypassing firewall constraints...",
  "Decrypting encrypted payload...",
  "System access granted."
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
          setTimeout(() => onComplete(), 800); // Wait slightly longer at 100%
          return 100;
        }
        // Smooth logarithmic easing
        const increment = prev < 50 ? Math.random() * 2 : Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  useEffect(() => {
    if (progress < 20) setLogIdx(0);
    else if (progress < 50) setLogIdx(1);
    else if (progress < 75) setLogIdx(2);
    else if (progress < 95) setLogIdx(3);
    else setLogIdx(4);
  }, [progress]);

  // Format progress as 3 digits
  const formattedProgress = Math.floor(progress).toString().padStart(3, "0");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-ink text-paper flex items-center justify-center font-mono overflow-hidden"
    >
      {/* 1px Edge-Tracing Frame Progress Bar */}
      <div className="absolute inset-4 border border-line/10 pointer-events-none" />
      <motion.div 
        className="absolute top-4 left-4 h-[1px] bg-accent z-10"
        style={{ width: `calc(${progress}% - 2rem)` }}
      />
      <motion.div 
        className="absolute bottom-4 right-4 h-[1px] bg-accent z-10"
        style={{ width: `calc(${progress}% - 2rem)` }}
      />

      {/* Center Percentage Display */}
      <div className="flex flex-col items-center gap-2 relative z-20">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
          Sys_Boot Sequence
        </div>
        
        <div className="text-6xl md:text-8xl font-light tracking-tighter flex items-end overflow-hidden h-24 md:h-32">
          <AnimatePresence mode="popLayout">
            {formattedProgress.split('').map((digit, i) => (
              <motion.span
                key={`${i}-${digit}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={progress === 100 ? "text-accent" : "text-paper"}
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
          <span className="text-xl md:text-2xl text-accent ml-1 mb-2 md:mb-4">%</span>
        </div>
      </div>

      {/* Bottom Layout - Minimal HUD */}
      <div className="absolute bottom-10 left-10 text-[10px] md:text-xs text-muted uppercase tracking-widest flex flex-col gap-1">
        <span className="opacity-50">STATUS</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={logIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-paper"
          >
            <span className="text-accent">{">"}</span> 
            {BOOT_LOGS[logIdx]}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-3 bg-accent ml-1 inline-block"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 right-10 text-[10px] md:text-xs text-muted uppercase tracking-widest text-right flex flex-col gap-1">
        <span className="opacity-50">ENCRYPTION</span>
        <span className="text-paper">AES-256-GCM</span>
      </div>
    </motion.div>
  );
}

