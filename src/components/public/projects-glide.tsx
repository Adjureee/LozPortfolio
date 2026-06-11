"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AcademicYear, Project } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

import { Typewriter } from "@/components/public/typewriter";

const years: AcademicYear[] = ["First Year", "Second Year", "Third Year", "Fourth Year"];

export function ProjectsGlide({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const grouped = useMemo(() => years.map((year) => ({ year, projects: projects.filter((project) => project.academic_year === year) })), [projects]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const context = gsap.context(() => {
      // Use matchMedia to only apply horizontal scrolling on desktop (>768px)
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${track.scrollWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true
          }
        });
      });
      // On mobile (<768px), it does nothing, letting native vertical scrolling take over.

    }, root);

    return () => context.revert();
  }, [projects]);

  return (
    <section ref={rootRef} id="projects" className="relative min-h-screen border-y border-line bg-paper overflow-hidden">
      <div ref={trackRef} className="flex flex-col md:flex-row md:h-screen w-full md:w-max">
        {grouped.map(({ year, projects: yearProjects }) => (
          <article key={year} className="flex w-full md:w-screen shrink-0 flex-col justify-center px-5 py-20 md:px-12 border-b md:border-b-0 border-line">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted">Featured Projects</p>
                <h2 className="font-display text-5xl md:text-8xl">
                  <Typewriter text={year} animateOnScroll={true} />
                </h2>
              </div>
              <span className="text-sm text-muted">{yearProjects.length} entries</span>
            </div>
            {yearProjects.length === 0 ? (
              <div className="grid min-h-72 place-items-center border border-dashed border-line text-muted">No entries found</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {yearProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="project-card group relative aspect-[4/3] sm:aspect-video xl:aspect-[4/3] overflow-hidden border border-line bg-ink text-paper"
                  >
                    {project.image_url ? (
                      <Image 
                        src={project.image_url} 
                        alt={project.title} 
                        fill 
                        sizes="(max-width: 768px) 90vw, 33vw" 
                        className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgb(var(--accent)/0.42),rgb(var(--accent-2)/0.35))]" />
                    )}
                    
                    {/* Dark gradient to ensure white text is ALWAYS readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {project.tech_stack.map((tag) => <span key={tag} className="border border-white/25 bg-black/20 px-2 py-1 text-xs">{tag}</span>)}
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl leading-tight line-clamp-2">{project.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/80">{project.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent opacity-0 transition-opacity group-hover:opacity-100">
                        View Project <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
