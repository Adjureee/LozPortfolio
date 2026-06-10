"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { SiteConfig } from "@/lib/types";
import { Typewriter } from "@/components/public/typewriter";
import { PhysicsGame } from "./physics-game";
import { useTerminal } from "@/components/providers/terminal-provider";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection({ config }: { config: SiteConfig | null }) {
  const rootRef = useRef<HTMLElement>(null);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const { openZork } = useTerminal();
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.15,
        ease: "power3.out",
        duration: 1.2,
        delay: 0.2
      });
      gsap.from(".hero-image", {
        scale: 1.05,
        autoAlpha: 0,
        ease: "power2.out",
        duration: 1.5,
        delay: 0.4
      });
    }, root);

    return () => context.revert();
  }, []);

  const hasConfig = Boolean(config?.display_name || config?.title || config?.about_me);

  const handleConnectClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo("#contact");
    }
  };

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
                  Hello, I'm {config.display_name}
                </p>
              )}
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.05] mb-8 min-h-[3.5em] md:min-h-[2.5em]">
                {config?.title ? <Typewriter text={config.title} delay={1000} /> : "Creative Designer"}
              </h1>
              
              {config?.about_me && (
                <div className="text-lg md:text-xl text-muted/90 font-light leading-relaxed mb-10 max-w-md">
                  {config.about_me.split("\n").filter((p) => p.trim() !== "").map((p, i) => (
                    <p key={i} className="mb-4 last:mb-0">{p}</p>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 z-20 mt-4">
                <MagneticButton href="#contact" onClick={handleConnectClick}>
                  Connect With Me
                </MagneticButton>
              </div>
            </div>

            <div className="hero-image relative min-h-[50vh] md:min-h-full flex items-center justify-center p-8 md:p-12 overflow-hidden">
              {config?.avatar_url ? (
                <div className="group relative w-full max-w-48 md:max-w-64 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-line/50">
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
                      className="object-cover object-top opacity-0 transition-opacity duration-[1.5s] group-hover:opacity-100 absolute inset-0" 
                    />
                  )}
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

      {/* Physics Game Overlay */}
      {isGameOpen && <PhysicsGame onClose={() => setIsGameOpen(false)} />}
    </section>
  );
}

function MagneticButton({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      className="inline-flex items-center justify-center bg-accent text-paper px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:scale-105"
    >
      <motion.span style={{ x: useSpring(useTransform(x, (v) => v * 0.5), springConfig), y: useSpring(useTransform(y, (v) => v * 0.5), springConfig) }}>
        {children}
      </motion.span>
    </motion.a>
  );
}
