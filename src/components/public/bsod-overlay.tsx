"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIdle } from "@/hooks/use-idle";
import { QrCode } from "lucide-react";

export function BsodOverlay() {
  // 30 seconds idle trigger (30000 ms)
  const isIdleHook = useIdle(30000);
  const [forceIdle, setForceIdle] = useState(false);
  const [progress, setProgress] = useState(0);

  const isIdle = isIdleHook || forceIdle;

  // Secret keyboard trigger: typing "crash"
  useEffect(() => {
    let keys = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      keys += e.key.toLowerCase();
      if (keys.includes("crash")) {
        setForceIdle(true);
        keys = "";
      }
      // Keep only last 5 chars to prevent memory leak
      if (keys.length > 5) keys = keys.slice(-5);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Allow dismissing the forced BSOD with mouse movement or keypress
  useEffect(() => {
    if (!forceIdle) return;
    const handleReset = () => setForceIdle(false);
    // Small delay so the final keypress of "crash" doesn't immediately dismiss it
    const timer = setTimeout(() => {
      window.addEventListener("mousemove", handleReset, { once: true });
      window.addEventListener("keydown", handleReset, { once: true });
      window.addEventListener("click", handleReset, { once: true });
    }, 500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleReset);
      window.removeEventListener("keydown", handleReset);
      window.removeEventListener("click", handleReset);
    };
  }, [forceIdle]);

  // Fake progress counter effect when idle
  useEffect(() => {
    if (!isIdle) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Randomly increment by 1 to 15 percent, making it feel real
        const jump = Math.floor(Math.random() * 15) + 1;
        return Math.min(prev + jump, 100);
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isIdle]);

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="fixed inset-0 z-[9999] bg-[#0078D7] text-white flex flex-col justify-center px-12 md:px-32 lg:px-48 cursor-none select-none overflow-hidden font-segoe"
          style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
        >
          {/* Glitch Overlay Effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            style={{ 
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)" 
            }}
          />

          <div className="relative z-10 max-w-5xl">
            <h1 className="text-[8rem] md:text-[10rem] leading-none mb-12 font-light">:(</h1>
            
            <p className="text-2xl md:text-4xl font-normal leading-tight mb-8">
              Your PC ran into a problem and needs to restart. We&apos;re <br className="hidden md:block"/>
              just collecting some error info, and then we&apos;ll restart for <br className="hidden md:block"/>
              you.
            </p>

            <p className="text-2xl md:text-4xl font-normal mb-16 text-white/90">
              {progress}% complete
            </p>

            <div className="flex flex-col md:flex-row items-start gap-8 mt-12">
              <div className="bg-white p-2 rounded-sm shrink-0">
                <QrCode size={120} className="text-[#0078D7]" />
              </div>
              <div className="flex flex-col justify-center pt-2">
                <p className="text-sm md:text-base text-white/80 mb-2">
                  For more information about this issue and possible fixes, visit: <br/>
                  <span className="text-white font-semibold">https://windows.com/stopcode</span>
                </p>
                <p className="text-xs md:text-sm text-white/70 mt-4">
                  If you call a support person, give them this info:
                </p>
                <p className="text-sm md:text-base font-semibold mt-1">
                  Stop code: <span className="underline decoration-white/50 underline-offset-4">ERR_LOZ_TOO_AWESOME</span>
                </p>
                <p className="text-sm md:text-base font-semibold mt-2">
                  Suggested fix: <span className="underline decoration-white/50 underline-offset-4">HIRE_THIS_DEVELOPER</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
