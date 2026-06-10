"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Experience } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".timeline-line").forEach((line) => {
        gsap.to(line, {
          backgroundSize: "100% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 82%",
            end: "bottom 48%",
            scrub: true
          }
        });
      });
    }, root);

    return () => context.revert();
  }, [experiences]);

  return (
    <section ref={rootRef} id="experience" className="px-5 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Experience Timeline</p>
        <h2 className="mt-3 font-display text-5xl md:text-8xl">Work in motion</h2>
        <div className="mt-16 border-l border-line">
          {experiences.length === 0 ? (
            <p className="ml-8 border border-dashed border-line p-8 text-muted">No entries found</p>
          ) : experiences.map((experience) => (
            <article key={experience.id} className="relative mb-16 pl-8">
              <span className="absolute -left-[5px] top-2 size-2 bg-accent" />
              <div className="flex items-center gap-3">
                <p className="text-sm uppercase tracking-[0.18em] text-muted">{experience.date_range}</p>
                {experience.is_current && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-accent">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex size-1.5 rounded-full bg-accent"></span>
                    </span>
                    CURRENT ROLE
                  </span>
                )}
              </div>
              <h3 className="timeline-line line-mask mt-2 font-display text-3xl md:text-5xl">{experience.title}</h3>
              <p className="mt-2 text-lg text-muted">
                {experience.company}
                {experience.location && <span className="text-accent/80"> • {experience.location}</span>}
              </p>
              <ul className="mt-5 space-y-3">
                {experience.bullet_points.map((point) => (
                  <li key={point} className="timeline-line line-mask text-lg leading-relaxed">{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
