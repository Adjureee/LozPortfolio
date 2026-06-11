"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "Initializing system architecture...",
  "Mounting secure components...",
  "Loading graphical assets...",
  "Establishing secure connection...",
  "System ready."
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logIdx, setLogIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Smooth, realistic loading simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 600); // Small pause at 100% before firing
          return 100;
        }
        // Load slower at the beginning, faster near the end
        const increment = prev < 40 ? Math.random() * 2 : Math.random() * 6 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  // Sync the boot logs to the progress percentage
  useEffect(() => {
    if (progress < 20) setLogIdx(0);
    else if (progress < 40) setLogIdx(1);
    else if (progress < 60) setLogIdx(2);
    else if (progress < 90) setLogIdx(3);
    else setLogIdx(4);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink text-paper"
    >
      <div className="w-[85%] max-w-[400px] flex flex-col gap-6 font-mono">
        <div className="flex justify-between items-end text-[10px] md:text-xs text-muted uppercase tracking-widest">
          <span>PORTFOLIO_OS // v2.0.4</span>
          <span className="text-accent">{Math.floor(progress)}%</span>
        </div>
        
        {/* Minimal Progress Line */}
        <div className="w-full h-[1px] bg-line/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-accent"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        
        {/* Clean fading logs */}
        <div className="h-4 flex items-center text-[10px] md:text-xs text-muted/70">
          <AnimatePresence mode="wait">
            <motion.span
              key={logIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={logIdx === 4 ? "text-accent font-bold" : ""}
            >
              {BOOT_LOGS[logIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

