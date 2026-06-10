"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioData } from "@/lib/types";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { HeroSection } from "@/components/public/hero-section";
import { ProjectsGlide } from "@/components/public/projects-glide";
import { AchievementsSection } from "@/components/public/achievements-section";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { ContactSection } from "@/components/public/contact-section";

import { Navbar } from "@/components/public/navbar";

import { AboutSection } from "@/components/public/about-section";

import { CustomCursor } from "@/components/public/custom-cursor";
import { TechStackSection } from "@/components/public/tech-stack";

export function PublicPortfolio({ data }: { data: PortfolioData }) {
  const router = useRouter();

  useEffect(() => {
    let sequence = "";
    let clicks = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onKey = (event: KeyboardEvent) => {
      sequence = `${sequence}${event.key.toLowerCase()}`.slice(-3);
      if (sequence === "loz") router.push("/admin-login");
    };

    const onClick = (event: MouseEvent) => {
      const inHotspot = event.clientX > window.innerWidth - 52 && event.clientY > window.innerHeight - 52;
      if (!inHotspot) return;
      clicks += 1;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (clicks = 0), 1600);
      if (clicks >= 5) router.push("/admin-login");
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper text-ink cursor-none [&_*]:cursor-none">
      <CustomCursor />
      <div 
        className="pointer-events-none fixed inset-0 z-[999] opacity-[0.035] dark:opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <Navbar />
      <HeroSection config={data.config} />
      <TechStackSection />
      <ProjectsGlide projects={data.projects} />
      <AchievementsSection achievements={data.achievements} />
      <ExperienceTimeline experiences={data.experiences} />
      <ContactSection contacts={data.contacts} />
      <div aria-hidden className="fixed bottom-0 right-0 z-40 size-11 opacity-0" />
    </main>
  );
}
