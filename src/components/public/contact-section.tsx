"use client";

import { useRef } from "react";
import { Download, Facebook, Github, Linkedin } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ContactSettings } from "@/lib/types";

const links = [
  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin },
  { key: "github_url", label: "GitHub", icon: Github },
  { key: "facebook_url", label: "Facebook", icon: Facebook }
] as const;

export function ContactSection({ contacts }: { contacts: ContactSettings | null }) {
  return (
    <section id="contact" className="min-h-screen border-t border-line px-5 py-28 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Contacts & Resume</p>
        <h2 className="mt-3 font-display text-5xl md:text-8xl">Let's connect.</h2>
        {!contacts ? (
          <p className="mt-12 border border-dashed border-line p-8 text-muted">No entries found</p>
        ) : (
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {links.map(({ key, label, icon: Icon }) => {
              const href = contacts[key];
              return href ? (
                <KineticLink key={key} href={href} label={label}>
                  <Icon size={22} />
                </KineticLink>
              ) : null;
            })}
          </div>
        )}
        {contacts?.resume_url ? (
          <motion.a
            href={contacts.resume_url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-ink px-8 py-5 font-semibold uppercase tracking-[0.18em] text-paper"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <Download size={18} />
            View Resume/CV
          </motion.a>
        ) : null}
      </div>

      <div className="mt-24 flex w-full flex-col justify-end overflow-hidden pb-4 opacity-[0.04] dark:opacity-[0.06] pointer-events-none select-none">
        <h1 className="text-center font-display text-[14vw] font-black leading-[0.8] tracking-tighter text-ink uppercase">
          Let's Work
        </h1>
      </div>
    </section>
  );
}

function KineticLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 12, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 12, mass: 0.4 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.18);
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.18);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="group flex min-h-44 flex-col justify-between border border-line bg-paper/70 p-5 backdrop-blur transition hover:border-accent"
    >
      <span className="grid size-11 place-items-center bg-ink text-paper transition group-hover:bg-accent">{children}</span>
      <span className="font-display text-3xl">{label}</span>
    </motion.a>
  );
}
