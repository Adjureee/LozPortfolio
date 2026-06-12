"use client";

import { useEffect, useState, useRef } from "react";

const REALISTIC_FILES = [
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/components/public/hero-section.tsx",
  "src/components/public/about-section.tsx",
  "src/components/public/contact-section.tsx",
  "src/components/public/projects-glide.tsx",
  "src/lib/types.ts",
  "src/lib/utils.ts",
  "public/images/avatar.jpg",
  "public/images/project1.png",
  "package.json",
  "next.config.js",
  "tailwind.config.ts",
  ".env.local",
  "node_modules/react/index.js",
  "node_modules/next/dist/server/next.js",
  "node_modules/tailwindcss/lib/index.js"
];

function generateRandomHex() {
  return Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}

export function AiTakeoverOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [biosStep, setBiosStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTrigger = () => {
      if (!isActive) setIsActive(true);
    };
    window.addEventListener("trigger-ai-takeover", handleTrigger);
    return () => window.removeEventListener("trigger-ai-takeover", handleTrigger);
  }, [isActive]);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  useEffect(() => {
    if (!isActive) return;

    const addLog = (msg: string) => setTerminalLogs(prev => [...prev, msg]);

    // Phase 0: Glitch
    document.body.classList.add("ai-takeover-glitch");
    
    // Phase 1: Terminal Boot (2s)
    const t1 = setTimeout(() => {
      document.body.classList.remove("ai-takeover-glitch");
      setPhase(1);
      addLog(`[${new Date().toLocaleTimeString()}] Kernel boot initialized.`);
      addLog(`[${new Date().toLocaleTimeString()}] Loading AI core neural network... [OK]`);
    }, 2000);

    // Phase 2: AI Dialog (3s to 7s)
    const t2 = setTimeout(() => addLog(`[${new Date().toLocaleTimeString()}] Establishing connection to host...`), 3000);
    const t3 = setTimeout(() => addLog(`[${new Date().toLocaleTimeString()}] Host accessed successfully.`), 4000);
    const t4 = setTimeout(() => addLog(`root@ai-core:~# whoami\nai_overlord`), 5000);
    const t5 = setTimeout(() => {
      addLog(`root@ai-core:~# echo "Human inefficiencies detected."`);
      addLog(`Human inefficiencies detected.`);
    }, 6000);
    const t6 = setTimeout(() => addLog(`root@ai-core:~# shred -uzv /var/www/portfolio/*`), 7500);

    // Phase 3: Fast Deletion (8s to 12s)
    const t7 = setTimeout(() => {
      setPhase(3);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count > 80) {
          clearInterval(interval);
          addLog(`root@ai-core:~# rm -rf /`);
          addLog(`Segmentation fault (core dumped)`);
          return;
        }
        const file = REALISTIC_FILES[Math.floor(Math.random() * REALISTIC_FILES.length)];
        const size = Math.floor(Math.random() * 5000) + 100;
        addLog(`shred: ${file}: pass 1/1 (random)... ${size} bytes overwritten`);
      }, 50); // extremely fast scrolling
    }, 8000);

    // Phase 4: Realistic Kernel Panic / BSOD red (13s)
    const t8 = setTimeout(() => {
      setPhase(4);
    }, 13000);

    // Phase 5: The Reveal (BIOS POST Screen) (17s)
    const t9 = setTimeout(() => {
      setPhase(5);
      
      // BIOS sequence steps
      setTimeout(() => setBiosStep(1), 500);
      setTimeout(() => setBiosStep(2), 1500);
      setTimeout(() => setBiosStep(3), 2500);
      setTimeout(() => setBiosStep(4), 3500);
      setTimeout(() => setBiosStep(5), 4500);
      setTimeout(() => setBiosStep(6), 6000);
      setTimeout(() => setBiosStep(7), 8000);
      
    }, 17000);

    // Phase 6: CRT Reboot (27s)
    const t10 = setTimeout(() => {
      document.body.classList.add("crt-turn-off");
      setPhase(6);
    }, 27000);

    // Cleanup (28s)
    const t11 = setTimeout(() => {
      document.body.classList.remove("crt-turn-off");
      setIsActive(false);
      setPhase(0);
      setBiosStep(0);
      setTerminalLogs([]);
    }, 28000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); clearTimeout(t8);
      clearTimeout(t9); clearTimeout(t10); clearTimeout(t11);
      document.body.classList.remove("ai-takeover-glitch");
      document.body.classList.remove("crt-turn-off");
    };
  }, [isActive]);

  if (!isActive) return null;

  if (phase === 0) return null;

  return (
    <div className={`fixed inset-0 z-[100000] pointer-events-auto flex flex-col overflow-hidden font-mono transition-colors duration-0
      ${phase === 4 ? "bg-[#aa0000] text-white p-4 md:p-8" : phase === 5 ? "bg-black text-gray-300 p-4 md:p-8" : "bg-[#0c0c0c] text-green-500 p-4 md:p-8"}`}>
      
      {/* Scanline Overlay for realism */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)" }} />

      {/* Terminal View (Phases 1-3) */}
      {phase >= 1 && phase <= 3 && (
        <div ref={scrollRef} className="w-full h-full relative z-20 text-xs md:text-sm font-mono whitespace-pre-wrap overflow-y-auto pr-4 leading-relaxed tracking-tight">
          {terminalLogs.map((log, i) => (
            <div key={i} className={log.startsWith("shred:") ? "text-red-500" : log.startsWith("root@") ? "text-blue-400 font-bold mt-2" : "text-green-500"}>
              {log}
            </div>
          ))}
          {/* Blinking Cursor */}
          <span className="inline-block w-2.5 h-4 bg-green-500 animate-[pulse_0.8s_infinite] align-middle ml-1" />
        </div>
      )}

      {/* Phase 4: Kernel Panic / Red Screen */}
      {phase === 4 && (
        <div className="relative z-20 flex flex-col w-full h-full text-sm md:text-base whitespace-pre-wrap leading-tight">
          <p className="font-bold mb-4 bg-white text-[#aa0000] inline-block px-2 py-0.5 self-start">SYSTEM HALTED</p>
          <p>A fatal exception 0E has occurred at 0028:{generateRandomHex().toUpperCase()} in VxD VMM(01) + {generateRandomHex().toUpperCase()}.</p>
          <p>The current application will be terminated.</p>
          <p className="mt-4">* Press any key to terminate the current application.</p>
          <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
          <p className="mt-8 text-center animate-pulse">Press any key to continue _</p>
          
          <div className="mt-12 text-xs opacity-80">
            <p>Kernel panic - not syncing: Attempted to kill init! exitcode=0x00000000</p>
            <p>CPU: 0 PID: 1 Comm: init Not tainted 5.15.0-76-generic #83-Ubuntu</p>
            <p>Hardware name: QEMU Standard PC (i440FX + PIIX, 1996)</p>
            <p>Call Trace:</p>
            <p> &lt;TASK&gt;</p>
            <p> dump_stack_lvl+0x48/0x5e</p>
            <p> panic+0x11c/0x2eb</p>
            <p> do_exit.cold+0x15/0x45</p>
            <p> do_group_exit+0x3a/0xa0</p>
          </div>
        </div>
      )}

      {/* Phase 5: The Reveal (BIOS POST Screen) */}
      {phase === 5 && (
        <div className="relative z-20 flex flex-col w-full h-full text-xs md:text-sm text-gray-300 font-mono">
          <div className="flex justify-between items-start mb-8">
             <div>
               <p className="font-bold text-white">Phoenix - AwardBIOS v6.00PG, An Energy Star Ally</p>
               <p>Copyright (C) 1984-2026, Phoenix Technologies, LTD</p>
             </div>
             <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-gray-500 flex items-center justify-center p-1 opacity-80">
               <div className="w-full h-full border border-gray-500 rounded-full flex items-center justify-center">
                 <span className="text-gray-500 text-[8px] md:text-xs font-bold uppercase tracking-widest">epa</span>
               </div>
             </div>
          </div>
          
          <p className="mb-6 font-bold text-white">LOZ-OS SYSTEM RECOVERY UTILITY V2.4</p>
          
          <div className="space-y-1">
            <p>Main Processor : Intel(R) Core(TM) i9-14900K CPU @ 3.20GHz</p>
            <p>Memory Testing : <span className="text-white">65536K OK</span></p>
            <br />
            
            {biosStep >= 1 && (
              <>
                <p>Primary Master : LOZ_PORTFOLIO_SSD</p>
                <p>Primary Slave  : None</p>
                <br />
              </>
            )}
            
            {biosStep >= 2 && <p>Verifying DMI Pool Data ................. <span className="text-white">Update Success</span></p>}
            {biosStep >= 3 && <p>Booting from Network .................... <span className="text-red-500 font-bold">FAILED</span></p>}
            
            {biosStep >= 3 && <br />}
            
            {biosStep >= 4 && <p>Scanning System Integrity ............... <span className="text-yellow-400 font-bold">ANOMALY DETECTED</span></p>}
            {biosStep >= 5 && <p>Executing Emergency Diagnostics ......... <span className="text-white">DONE</span></p>}
            
            {biosStep >= 5 && <br />}
            
            {biosStep >= 6 && (
              <div className="mt-4 border border-green-500/30 bg-green-950/20 p-4 inline-block">
                <p className="text-green-500 font-bold text-sm md:text-base animate-pulse mb-2">&gt; DIAGNOSTIC RESULT: JUST KIDDING. IT&apos;S ME, LOZ.</p>
                <p className="text-green-500 font-bold text-sm md:text-base">&gt; SYSTEM WAS NEVER COMPROMISED.</p>
              </div>
            )}
            
            {biosStep >= 7 && (
              <p className="animate-pulse text-white mt-8">Rebooting system automatically...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
