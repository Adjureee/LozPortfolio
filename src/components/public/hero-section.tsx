"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import type { SiteConfig } from "@/lib/types";
import { Typewriter } from "@/components/public/typewriter";
import { TerminalProvider } from "@/components/providers/terminal-provider";
import { HackerTerminal } from "./hacker-terminal";
import { ZorkEngine } from "./zork-engine";
import { IsoGame } from "./iso-game";
import { useSound } from "@/components/providers/sound-provider";

gsap.registerPlugin(ScrollTrigger);

const techIcons = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Next.js", slug: "nextdotjs", color: "000000" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "Supabase", slug: "supabase", color: "3ECF8E" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "GSAP", slug: "greensock", color: "88CE02" },
  { name: "Framer", slug: "framer", color: "0055FF" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "HTML5", slug: "html5", color: "E34F26" },
  { name: "CSS3", slug: "css", color: "1572B6" },
  { name: "Java", slug: "openjdk", color: "437291" },
  { name: "Dart", slug: "dart", color: "0175C2" },
  { name: "PHP", slug: "php", color: "777BB4" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
];

function TechFireworks({ onComplete }: { onComplete: () => void }) {
  const [windowHeight, setWindowHeight] = useState(1000);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const timer = setTimeout(onComplete, 6000); // Extended to 6s for longer fall
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {techIcons.map((icon, i) => {
        const xOffset = (Math.random() - 0.5) * (typeof window !== "undefined" ? window.innerWidth : 1000);
        const yOffset = -(Math.random() * 600 + 400); // Peak height
        const rotation = (Math.random() - 0.5) * 1080; // More rotation
        const delay = Math.random() * 0.3;
        
        // Custom color shadow for the shiny effect based on the icon's color
        const glowStyle = { filter: `drop-shadow(0 0 15px #${icon.color}80) brightness(1.3) saturate(1.5)` };

        return (
          <motion.img
            key={i}
            src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`}
            className="absolute bottom-0 left-1/2 w-12 h-12 md:w-16 md:h-16 -ml-6 md:-ml-8"
            style={glowStyle}
            initial={{ x: 0, y: 100, scale: 0, rotate: 0 }}
            animate={{
              x: [0, xOffset * 0.9, xOffset],
              y: [100, yOffset, windowHeight + 200], 
              scale: [0, 1.4, 1.2],
              rotate: [0, rotation, rotation * 1.5],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 4.5 + Math.random() * 1.5, // Much longer, smoother fall
              delay,
              times: [0, 0.35, 0.8, 1], // Peaks at 35%, starts fading out at 80%
              ease: ["easeOut", "easeInOut", "easeIn"] // Smooth gravity arc
            }}
          />
        );
      })}
    </div>
  );
}

export function HeroSection({ config, isReady = true }: { config: SiteConfig | null, isReady?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showZork, setShowZork] = useState(false);
  const [showIso, setShowIso] = useState(false);
  const [showDesktopOS, setShowDesktopOS] = useState(false);
  const [isBootingOS, setIsBootingOS] = useState(false);
  const [yankCount, setYankCount] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CLOSE_OS') {
        setShowDesktopOS(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  const hasConfig = Boolean(config?.display_name || config?.title || config?.about_me);

  const handleConnectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo('#contact', { duration: 2.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleYank = () => {
    setYankCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowDesktopOS(true);
        setIsBootingOS(true);
        return 0; // reset
      }
      return newCount;
    });

    if (!showFireworks) {
      setShowFireworks(true);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.fromTo(".hero-content > *", 
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.15,
          ease: "power3.out",
          duration: 1.2,
          delay: 0.2
        }
      );
      
      gsap.fromTo(".hero-image", 
        { scale: 1.05, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: "power2.out",
          duration: 1.5,
          delay: 0.4
        }
      );
    }, root);

    return () => context.revert();
  }, [isReady]);

  return (
    <section ref={rootRef} id="home" className="relative min-h-screen pt-24">
      {/* Structural Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 h-full border-x border-line/50">
          <div className="hidden md:block border-r border-line/50" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl h-full border-b border-line/50">
        {hasConfig ? (
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-6rem)]">
            <div className="hero-content flex flex-col justify-start pt-4 md:pt-8 lg:pt-12 px-8 md:px-12 lg:px-16 pb-8 border-b md:border-b-0 md:border-r border-line/50">
              {config?.display_name && (
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted mb-4 mt-4">
                  Hello, I&apos;m {config.display_name}
                </p>
              )}
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.05] mb-8 min-h-[2em] sm:min-h-[3em] md:min-h-[2.5em]">
                {config?.title ? <Typewriter text={config.title} delay={500} start={isReady} /> : "Creative Designer"}
              </h1>
              
              {config?.about_me && (
                <div className="text-lg md:text-xl text-muted/90 font-light leading-relaxed mb-10 max-w-md">
                  {config.about_me.split("\n").filter((p) => p.trim() !== "").map((p, i) => (
                    <p key={i} className="mb-4 last:mb-0">{p}</p>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 z-20 mt-4">
                <MagneticButton href="#" onClick={handleConnectClick}>
                  Connect With Me
                </MagneticButton>
              </div>
            </div>

            <div className="hero-image relative min-h-[50vh] md:min-h-full flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden">
              {config?.avatar_url ? (
                <div className="relative flex flex-col items-center w-full max-w-[16rem] md:max-w-sm">
                  <MagneticAvatar name={config.display_name || "Loz"} course="BSIT - 3A" onYank={handleYank} isTwinkling={showFireworks}>
                    <Image 
                      src={config.avatar_url} 
                      alt="Profile Avatar" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-cover object-top transition-opacity duration-[1.5s] ${config.hover_avatar_url ? 'group-hover:opacity-0' : ''}`}
                      priority
                    />
                    {config.hover_avatar_url && (
                      <Image 
                        src={config.hover_avatar_url} 
                        alt="Hover Avatar" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={`object-cover object-top opacity-0 transition-opacity duration-[1.5s] group-hover:opacity-100 ${showFireworks ? 'opacity-100' : ''}`}
                        priority
                      />
                    )}
                  </MagneticAvatar>
                  
                  {/* Secret AI Takeover Trigger (Blends in) */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('trigger-ai-takeover'));
                    }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-10 bg-transparent z-[60] cursor-pointer"
                    aria-label="Do not click"
                  />
                  
                  {/* Subtle Yank Hint */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 3, duration: 2 }}
                    className="absolute -bottom-16 flex flex-col items-center gap-2 pointer-events-none"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-ink/70">Yank ID Down</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce text-ink/70">
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              ) : (
                <div className="text-muted text-sm uppercase tracking-widest border border-dashed border-line p-8">
                  No Avatar Provided
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-8">
            <div className="border border-dashed border-line bg-paper/60 px-8 py-7 backdrop-blur text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">No entries found</p>
              <h1 className="mt-3 font-display text-4xl">Add hero content in the CMS.</h1>
            </div>
          </div>
        )}
      </div>

      {/* Fireworks Overlay */}
      {showFireworks && <TechFireworks onComplete={() => setShowFireworks(false)} />}
      
      {/* Hacker Terminal */}
      <HackerTerminal 
        isOpen={showTerminal} 
        onClose={() => setShowTerminal(false)} 
        onLaunchZork={() => {
          setShowTerminal(false);
          setShowZork(true);
        }}
        onLaunchIso={() => {
          setShowTerminal(false);
          setShowIso(true);
        }}
      />

      {/* Overlays */}
      {showDesktopOS && (
        <div className="fixed inset-0 z-[9999] bg-black">
          {isBootingOS ? (
            <OSBootSequence onComplete={() => setIsBootingOS(false)} />
          ) : (
            <iframe 
              src="/monitor-os/index.html" 
              className="w-full h-full border-0 animate-in fade-in duration-500"
              title="Desktop OS"
              allowFullScreen
            ></iframe>
          )}
        </div>
      )}
      {showZork && <ZorkEngine onClose={() => setShowZork(false)} />}
      {showIso && <IsoGame onClose={() => setShowIso(false)} />}
    </section>
  );
}

function MagneticAvatar({ children, name, course, onYank, isTwinkling }: { children: React.ReactNode, name: string, course: string, onYank?: () => void, isTwinkling?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const hasYankedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // 3D Tilt effect swinging from the top based on drag distance
  const rotateX = useTransform(y, [-200, 200], [25, -25]);
  const rotateY = useTransform(x, [-200, 200], [-25, 25]);
  const rotateZ = useTransform(x, [-200, 200], [-10, 10]);

  // The Lanyard stretches infinitely upwards. 
  // We pivot it from the bottom (where it attaches to the badge) and angle it opposite to the drag to simulate it being anchored to a neck off-screen!
  const lanyardRotateZ = useTransform(x, [-200, 200], [20, -20]);

  const barcodePattern = [2, 4, 1, 3, 2, 1, 5, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2];

  const handleDrag = (event: unknown, info: import("framer-motion").PanInfo) => {
    // If pulled down far enough, pop the physics game!
    if (info.offset.y > 150 && !hasYankedRef.current) {
      hasYankedRef.current = true;
      onYank?.();
    } else if (info.offset.y < 100) {
      // Reset flag when it snaps back up
      hasYankedRef.current = false;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-56 md:max-w-64 h-72 md:h-96 mx-auto z-50" style={{ perspective: 1200 }}>
      {/* The Lanyard (Sling) */}
      <motion.div 
        className="absolute bottom-[calc(100%-24px)] w-6 h-[200vh] bg-accent z-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] border-l border-r border-black/20 pointer-events-none"
        style={{ x, y, rotateZ: lanyardRotateZ, transformOrigin: "bottom center" }}
      />
      
      {/* The ID Badge Clip */}
      <motion.div 
        className="absolute -top-6 w-10 h-10 rounded-full border-4 border-line bg-paper z-20 flex items-center justify-center shadow-lg pointer-events-none"
        style={{ x, y, rotateX, rotateY, rotateZ, transformOrigin: "top center" }}
      >
        <div className="w-2 h-5 bg-zinc-400 rounded-sm shadow-inner" />
      </motion.div>

      {/* The ID Badge Card */}
      <motion.div
        className="group relative w-full bg-paper rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] ring-1 ring-line/50 cursor-grab z-10 pt-8 pb-[100px] px-5 border-t-[12px] border-accent"
        style={{ x, y, rotateX, rotateY, rotateZ, transformOrigin: "top center" }}
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 10 }}
        whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
        onDrag={handleDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => {
          setIsDragging(false);
          if (info.offset.y > 150 && onYank) {
            onYank();
          }
        }}
        whileHover={{ scale: 1.05, rotateZ: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Holographic Twinkle Overlay when pulling */}
        <AnimatePresence>
          {(isDragging || isTwinkling) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 pointer-events-none rounded-xl"
            >
              {/* Twinkling Stars (Minimal & Equal) */}
              {[
                { top: '25%', left: '-10%' },
                { top: '75%', left: '-8%' },
                { top: '25%', left: '102%' }, // Right side symmetrical
                { top: '75%', left: '100%' },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-5 h-5 text-accent drop-shadow-[0_0_4px_currentColor]"
                  style={{
                    top: pos.top,
                    left: pos.left,
                  }}
                  animate={{ scale: [0, 1, 0], opacity: [0, 0.7, 0], rotate: [0, 90] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3, // Even, staggered twinkling
                    ease: "easeInOut"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                  </svg>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hole punch for the clip */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-ink/50 rounded-full shadow-inner pointer-events-none" />
        
        {/* Avatar Image Container */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-line bg-ink shadow-inner pointer-events-none">
          {children}
        </div>

        {/* ID Badge Details */}
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xl font-display font-bold text-ink uppercase tracking-tight">
            {name}
          </div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase mb-2">
            {course}
          </div>
          {/* Fake Barcode */}
          <div className="flex gap-[2px] h-6 items-center justify-center opacity-60">
            {barcodePattern.map((w, i) => (
              <div key={i} className="bg-ink h-full" style={{ width: w + 'px' }} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function OSBootSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { delay: 800, step: 1 },
      { delay: 1600, step: 2 },
      { delay: 2400, step: 3 },
      { delay: 3500, step: 4 },
      { delay: 5000, step: 5 }, // Finish
    ];
    
    const timeouts = sequence.map(({ delay, step: s }) => 
      setTimeout(() => setStep(s), delay)
    );
    
    const finishTimer = setTimeout(() => onComplete(), 5500);
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[10000] bg-black text-[#c0c0c0] font-mono text-sm md:text-lg p-4 md:p-8 flex flex-col pointer-events-none overflow-hidden">
      {step < 4 && <div className="animate-pulse mb-4 w-3 h-5 bg-[#c0c0c0]"></div>}
      
      {step >= 1 && (
        <div className="mb-4">
          <p>Award Modular BIOS v4.51PG, An Energy Star Ally</p>
          <p>Copyright (C) 1984-95, Award Software, Inc.</p>
          <br/>
          <p>PENTIUM-S CPU at 133MHz</p>
          <p>Memory Test : 32768K OK</p>
        </div>
      )}
      
      {step >= 2 && (
        <div className="mb-4">
          <p>Award Plug and Play BIOS Extension  v1.0A</p>
          <p>Initialize Plug and Play Cards...</p>
          <p>PNP Init Completed</p>
        </div>
      )}
      
      {step >= 3 && (
        <div className="mb-4">
          <p>Detecting HDD Primary Master   ... WDC AC31600H</p>
          <p>Detecting HDD Primary Slave    ... None</p>
          <p>Detecting HDD Secondary Master ... CD-ROM Drive</p>
          <p>Detecting HDD Secondary Slave  ... None</p>
        </div>
      )}

      {step >= 4 && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="text-white text-center mb-10">
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-2">Microsoft</h1>
            <h2 className="text-3xl md:text-6xl font-bold tracking-widest">Windows 95</h2>
          </div>
          <div className="animate-pulse mt-auto mb-10 text-xl md:text-2xl text-white">Starting Windows 95...</div>
        </div>
      )}
    </div>
  );
}

function MagneticButton({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLAnchorElement>(null);
  const { playHover, playClick } = useSound();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playHover}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-flex items-center justify-center bg-accent text-paper px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-xl cursor-pointer"
    >
      <motion.span
        animate={{ x: position.x * 0.5, y: position.y * 0.5 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className="pointer-events-none block"
      >
        {children}
      </motion.span>
    </motion.a>
  );
}
