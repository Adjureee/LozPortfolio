"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Achievement } from "@/lib/types";

import { Typewriter } from "@/components/public/typewriter";

export function AchievementsSection({ achievements }: { achievements: Achievement[] | null }) {

  if (!achievements || achievements.length === 0) return null;

  return (
    <section id="achievements" className="relative min-h-screen border-t border-line px-5 py-28 md:px-12 bg-paper text-ink overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        <header className="mb-16 md:mb-24 flex flex-col">
          <p className="text-sm uppercase tracking-[0.24em] text-muted mb-3">Honors & Awards</p>
          <h2 className="font-display text-5xl md:text-7xl text-ink">
            <Typewriter text="Featured In" animateOnScroll={true} />
          </h2>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <a 
              key={item.id} 
              href={item.url || "#"} 
              target={item.url ? "_blank" : "_self"}
              rel="noreferrer"
              className="group flex flex-col border border-line bg-ink/5 dark:bg-line/10 transition-transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {item.image_url ? (
                <div className="relative aspect-video w-full overflow-hidden border-b border-line">
                  <Image src={item.image_url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden border-b border-line bg-[linear-gradient(135deg,rgb(var(--accent)/0.2),rgb(var(--accent-2)/0.2))]" />
              )}
              
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">{item.date}</p>
                  {item.url && <ArrowUpRight size={18} className="text-muted transition-colors group-hover:text-ink" />}
                </div>
                <h3 className="mb-3 font-display text-2xl leading-tight text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
