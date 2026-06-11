"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "INITIALIZING KERNEL...",
  "MOUNTING /DEV/SDA1 [OK]",
  "LOADING CORE MODULES...",
  "ESTABLISHING SECURE CONNECTION...",
  "BYPASSING FIREWALL...",
  "DECRYPTING PORTFOLIO_DATA.BIN",
  "LOADING ASSETS...",
  "COMPILING SHADERS...",
  "SYSTEM BOOT SEQUENCE INITIATED"
];

function generateHex() {
  return Array.from({ length: 8 })
    .map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase())
    .join("");
}

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hex, setHex] = useState("00000000");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    let currentLogIdx = 0;
    
    const logInterval = setInterval(() => {
      if (currentLogIdx < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLogIdx]]);
        currentLogIdx++;
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }
    }, 150);

    const hexInterval = setInterval(() => {
      setHex(generateHex());
    }, 40);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          clearInterval(hexInterval);
          clearInterval(logInterval);
          setHex("00000000"); 
          setLogs(prev => [...prev, "ACCESS GRANTED."]);
          setTimeout(() => onComplete(), 700); 
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 8) + 1, 100);
      });
    }, 45);

    return () => {
      clearInterval(interval);
      clearInterval(hexInterval);
      clearInterval(logInterval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink text-paper overflow-hidden"
    >
      {/* Background ambient grid/scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
           style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #00FF00 2px, #00FF00 4px)` }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-5"
           style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px)`, backgroundSize: `20px 20px` }}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        exit={{ scale: 1.05, opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="relative z-10 flex flex-col w-[90%] max-w-[500px] bg-ink border border-accent/20 rounded-lg shadow-[0_0_40px_rgba(0,255,0,0.05)] overflow-hidden"
      >
        {/* Terminal Header Bar */}
        <div className="w-full flex justify-between items-center bg-accent/5 border-b border-accent/20 px-4 py-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="font-mono text-[10px] text-accent/50 tracking-[0.2em] uppercase">
            TERMINAL // ROOT
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex flex-col p-6 md:p-8 gap-8">
          {/* Branding & Hex */}
          <div className="flex w-full justify-between items-end border-b border-paper/10 pb-4">
            <div className="font-display text-4xl font-bold tracking-[0.2em] flex items-center gap-2 relative">
              <motion.span 
                className="absolute left-0 top-0 text-accent opacity-50 blur-[2px]"
                animate={{ x: [-2, 2, -1, 0], y: [1, -1, 0, 0] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
              >
                LOZ
              </motion.span>
              <span className="relative z-10 shadow-accent drop-shadow-md">LOZ</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
                className="text-accent relative z-10 drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]"
              >
                _
              </motion.span>
            </div>
            <div className="font-mono text-xs text-accent tracking-widest pb-1 drop-shadow-[0_0_5px_rgba(0,255,0,0.4)]">
              0x{hex}
            </div>
          </div>

          {/* Boot Logs Window */}
          <div 
            ref={scrollRef}
            className="w-full h-[140px] overflow-hidden font-mono text-[11px] md:text-xs text-muted/80 leading-relaxed flex flex-col justify-end"
          >
            <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={log?.includes("GRANTED") ? "text-accent font-bold mt-2 drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]" : ""}
                >
                  <span className="opacity-50 mr-2">{">"}</span> {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Progress Section */}
          <div className="w-full flex flex-col gap-3">
            <div className="font-mono text-[10px] text-accent/80 uppercase tracking-widest flex justify-between w-full">
              <span>SYS_PROGRESS</span>
              <span className="text-accent font-bold drop-shadow-[0_0_5px_rgba(0,255,0,0.4)]">{progress}%</span>
            </div>
            
            {/* Segmented Progress Bar */}
            <div className="w-full h-2 flex gap-[2px]">
              {Array.from({ length: 40 }).map((_, i) => {
                const isActive = (i / 40) * 100 < progress;
                return (
                  <div 
                    key={i} 
                    className={`flex-1 h-full rounded-sm transition-colors duration-100 ${
                      isActive ? "bg-accent drop-shadow-[0_0_4px_rgba(0,255,0,0.8)]" : "bg-paper/10"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
