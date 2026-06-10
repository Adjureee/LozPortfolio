"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AcademicYear, Project } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

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
      const tween = gsap.to(track, {
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

      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.fromTo(card, { y: 60, rotate: -2, autoAlpha: 0.4 }, {
          y: 0,
          rotate: 0,
          autoAlpha: 1,
          ease: "power3.out",
          scrollTrigger: {
            containerAnimation: tween,
            trigger: card,
            start: "left 85%",
            end: "right 35%",
            scrub: true
          }
        });
      });
    }, root);

    return () => context.revert();
  }, [projects]);

  return (
    <section ref={rootRef} id="projects" className="relative min-h-screen overflow-hidden border-y border-line bg-paper">
      <div ref={trackRef} className="flex h-screen w-max">
        {grouped.map(({ year, projects: yearProjects }) => (
          <article key={year} className="flex w-screen shrink-0 flex-col justify-center px-5 py-20 md:px-12">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted">Featured Projects</p>
                <h2 className="font-display text-5xl md:text-8xl">{year}</h2>
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
                      <Image src={project.image_url} alt={project.title} fill sizes="(max-width: 768px) 90vw, 33vw" className="object-contain p-2 opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(var(--accent)/0.42),rgb(var(--accent-2)/0.35))]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {project.tech_stack.map((tag) => <span key={tag} className="border border-white/25 px-2 py-1 text-xs">{tag}</span>)}
                      </div>
                      <h3 className="font-display text-3xl">{project.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-white/72">{project.description}</p>
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
