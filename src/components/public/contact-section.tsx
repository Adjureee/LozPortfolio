"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Facebook, Github, Linkedin, ArrowUpRight, ArrowUp, MapPin, Mail } from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { ContactSettings } from "@/lib/types";
import { useLenis } from "lenis/react";
import { ContactForm } from "@/components/public/contact-form";

// ── Animated heading ──────────────────────────────────────────
const lines = [
  ["Let\u2019s", "build"],
  ["something"],
];

function AnimatedHeading() {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const wordVariants = {
    hidden: { y: "110%", opacity: 0 },
    visible: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        delay: i * 0.12,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  let wordIndex = 0;

  return (
    <h2
      ref={ref}
      className="font-display text-5xl md:text-[6.5rem] leading-[1.0] tracking-tighter"
    >
      {lines.map((words, li) => (
        <span key={li} className="block overflow-hidden">
          <span className="inline-flex flex-wrap gap-x-[0.25em]">
            {words.map((word) => {
              const idx = wordIndex++;
              return (
                <motion.span
                  key={word}
                  custom={idx}
                  variants={wordVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              );
            })}
          </span>
        </span>
      ))}
      {/* Last word: italic accent with underline draw */}
      <span className="block overflow-hidden">
        <motion.span
          custom={wordIndex}
          variants={wordVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="inline-block text-accent italic font-light relative pr-4"
        >
          together.
          {/* Underline sweep */}
          <motion.span
            className="absolute bottom-2 left-0 h-px bg-accent"
            initial={{ scaleX: 0, originX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: (wordIndex + 1) * 0.12 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%" }}
          />
        </motion.span>
      </span>
    </h2>
  );
}

const socialLinks = [
  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin, color: "hover:border-[#0A66C2]" },
  { key: "github_url",   label: "GitHub",   icon: Github,   color: "hover:border-ink" },
  { key: "facebook_url", label: "Facebook", icon: Facebook,  color: "hover:border-[#1877F2]" },
] as const;

function Footer() {
  const [time, setTime] = useState("");
  const lenis = useLenis();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
        }) + " PHT"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 2.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-24 w-full border-t border-line/50 bg-paper/60 backdrop-blur-lg pt-14 pb-8 px-5 md:px-12 relative z-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left */}
        <div className="flex flex-col gap-5">
          <h3 className="font-display text-3xl font-medium text-ink">John Lyold Lozada</h3>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Student Developer · Open to Internships
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col md:items-end justify-between gap-6">
          <div className="flex flex-col md:items-end gap-2 text-sm text-muted font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent" />
              <span>Philippines</span>
            </div>
            <span className="font-mono text-xs tabular-nums opacity-70" suppressHydrationWarning>
              {time || "--:-- PHT"}
            </span>
          </div>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 px-6 py-3 border border-line bg-transparent hover:border-accent hover:bg-accent/5 transition-all duration-300"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted group-hover:text-accent transition-colors">
              Back to Top
            </span>
            <ArrowUp size={14} className="text-muted group-hover:text-accent group-hover:-translate-y-1 transition-all duration-300" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-14 pt-6 border-t border-line/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted font-bold uppercase tracking-widest opacity-50">
        <p>© {new Date().getFullYear()} John Lyold Lozada. All Rights Reserved.</p>
        <p>Crafted with Passion</p>
      </div>
    </footer>
  );
}

export function ContactSection({ contacts }: { contacts: ContactSettings | null }) {
  return (
    <section id="contact" className="relative min-h-screen pt-32 flex flex-col justify-between overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-12 flex-grow">

        {/* Section header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-6 flex items-center gap-3"
          >
            <span className="w-12 h-px bg-accent" /> Get in Touch
          </motion.p>
          <AnimatedHeading />
        </div>

        {/* Two-column layout: Info (left) + Form (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

          {/* ── Left column: Info ── */}
          <div className="flex flex-col gap-10">

            {/* Availability note */}
            <div className="flex items-start gap-4 border border-line p-6 bg-accent/5 border-accent/30">
              <div className="mt-0.5 grid size-10 shrink-0 place-items-center bg-ink text-paper">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Let&apos;s Connect</p>
                <p className="text-sm text-ink leading-relaxed">
                  I&apos;m currently open to internship opportunities and freelance projects. Drop a message using the form!
                </p>
              </div>
            </div>

            {/* Social links */}
            {contacts && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Find me on</p>
                <div className="flex flex-col gap-2">
                  {socialLinks.map(({ key, label, icon: Icon, color }) => {
                    const href = contacts[key];
                    return href ? (
                      <motion.a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ x: 6 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`group flex items-center justify-between border border-line px-5 py-4 hover:bg-ink/5 transition-colors duration-200 ${color}`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon size={20} className="text-muted group-hover:text-ink transition-colors" />
                          <span className="font-semibold text-sm text-ink">{label}</span>
                        </div>
                        <ArrowUpRight size={16} className="text-muted group-hover:text-ink transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </motion.a>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Resume download */}
            {contacts?.resume_url && (
              <motion.a
                href={contacts.resume_url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-4 bg-ink text-paper px-6 py-5 font-bold uppercase tracking-[0.18em] text-xs hover:bg-accent hover:text-ink transition-all duration-300 self-start"
              >
                <Download size={18} className="group-hover:animate-bounce" />
                Download Résumé
              </motion.a>
            )}
          </div>

          {/* ── Right column: Contact Form ── */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted mb-1">Drop a message</p>
              <p className="text-sm text-muted">
                Have a project in mind or want to connect? Fill out the form and I&apos;ll respond within 24 hours.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
