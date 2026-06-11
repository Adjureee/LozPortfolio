"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Facebook, Github, Linkedin, ArrowUpRight, ArrowUp, MapPin } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ContactSettings } from "@/lib/types";
import { useLenis } from "lenis/react";
import { ContactForm } from "@/components/public/contact-form";

const links = [
  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin },
  { key: "github_url", label: "GitHub", icon: Github },
  { key: "facebook_url", label: "Facebook", icon: Facebook }
] as const;

function Footer() {
  const [time, setTime] = useState("");
  const lenis = useLenis();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit" }) + " PHT");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      // Extremely fluid, custom bezier curve for a "buttery" scroll to top
      lenis.scrollTo(0, { duration: 2.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-32 w-full border-t border-line/50 bg-paper/50 backdrop-blur-lg pt-16 pb-8 px-5 md:px-12 relative z-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left side */}
        <div className="flex flex-col gap-6">
          <h3 className="font-display text-3xl font-medium text-ink">John Lyold Lozada</h3>
          <div className="flex items-center gap-3 text-muted">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink">Student Developer • Open to Internships</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col md:items-end justify-between gap-8">
          <div className="flex flex-col md:items-end gap-3 text-muted text-sm font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-accent" />
              <span>Philippines</span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
              <span>{time || "Loading..."}</span>
            </div>
          </div>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-line bg-paper shadow-sm hover:border-accent transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink group-hover:text-accent transition-colors">Back To Top</span>
            <ArrowUp className="group-hover:-translate-y-1 text-ink group-hover:text-accent transition-all" size={16} />
          </button>
        </div>
      </div>
      
      <div className="mx-auto max-w-6xl mt-16 pt-8 border-t border-line/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">
        <p>© {new Date().getFullYear()} John Lyold Lozada. All Rights Reserved.</p>
        <p>Crafted with Passion</p>
      </div>
    </footer>
  );
}

export function ContactSection({ contacts }: { contacts: ContactSettings | null }) {
  return (
    <section id="contact" className="relative min-h-screen pt-32 flex flex-col justify-between overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-12 flex-grow flex flex-col justify-center">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-6 flex items-center gap-3">
              <span className="w-12 h-px bg-accent"></span> Get in touch
            </p>
            <h2 className="font-display text-6xl md:text-[7.5rem] leading-[0.9] tracking-tighter">
              Let&apos;s build <br/> something <span className="text-accent italic font-light pr-4">together.</span>
            </h2>
          </div>
          
          {contacts?.resume_url && (
            <motion.a
              href={contacts.resume_url}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-ink px-8 py-5 font-bold uppercase tracking-widest text-paper hover:bg-accent hover:text-ink transition-colors duration-500 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} className="group-hover:animate-bounce" />
              Download Resume
            </motion.a>
          )}
        </div>

        {!contacts ? (
          <p className="mt-12 border border-dashed border-line p-8 text-muted text-center font-medium">No contact information found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 relative z-20">
            {links.map(({ key, label, icon: Icon }) => {
              const href = contacts[key];
              return href ? (
                <KineticLink key={key} href={href} label={label}>
                  <Icon size={24} />
                </KineticLink>
              ) : null;
            })}
          </div>
        )}

        <div className="mt-24 relative z-20">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-12 flex items-center gap-3">
            <span className="w-12 h-px bg-accent"></span> Send a Message
          </p>
          <ContactForm />
        </div>
      </div>

      <Footer />
    </section>
  );
}

function KineticLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // 3D Hover Tilt Effect
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        x.set(event.clientX - bounds.left - bounds.width / 2);
        y.set(event.clientY - bounds.top - bounds.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="group relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-paper shadow-lg transition-colors hover:border-accent"
    >
      {/* Glossy Background Reveal */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        <div className="flex w-full items-start justify-between">
          <div className="grid size-14 place-items-center rounded-full bg-ink text-paper shadow-md transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-ink">
            {children}
          </div>
          <ArrowUpRight className="text-muted transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink" size={28} />
        </div>
        <span className="font-display text-4xl font-medium tracking-tight text-ink group-hover:text-accent transition-colors">{label}</span>
      </div>
    </motion.a>
  );
}
