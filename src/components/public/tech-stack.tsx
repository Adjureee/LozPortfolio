"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Typewriter } from "@/components/public/typewriter";

const technologies = [
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "Tailwind", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
  { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
  { name: "Dart", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg" },
  { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
];

export function TechStackSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 1.5 })
  ]);

  return (
    <section className="relative w-full overflow-hidden border-b border-line/50 bg-paper py-24 md:py-32 cursor-grab active:cursor-grabbing">
      <div className="mx-auto max-w-7xl px-8 md:px-12 lg:px-16 mb-16 pointer-events-none">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-widest text-ink">
          <Typewriter text="Techstack" animateOnScroll={true} />
        </h2>
        <div className="mt-4 h-1 w-24 bg-accent"></div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex backface-hidden touch-pan-y">
          {technologies.map((tech, idx) => (
            <div 
              key={idx} 
              className="relative min-w-[280px] shrink-0 mx-4 flex items-center justify-center gap-6 border-2 border-line bg-paper px-8 py-6 transition-all duration-300 hover:-translate-y-2 hover:border-ink hover:shadow-[6px_6px_0px_var(--color-accent)] group"
            >
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                <img 
                  src={tech.logo} 
                  alt={`${tech.name} logo`}
                  className="max-h-full max-w-full object-contain filter grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
              <span className="font-display text-xl font-bold uppercase tracking-widest">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Edge Gradients for smooth fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-paper to-transparent md:w-32" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-paper to-transparent md:w-32" />
    </section>
  );
}
