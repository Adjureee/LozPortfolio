import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CustomCursor } from "@/components/public/custom-cursor";
import { LightboxImage } from "@/components/public/lightbox-image";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();

  if (!project) notFound();

  return (
    <main className="relative min-h-screen bg-paper text-ink cursor-none [&_*]:cursor-none selection:bg-accent selection:text-paper">
      <CustomCursor />
      
      {/* Editorial Film Grain */}
      <div 
        className="pointer-events-none fixed inset-0 z-[999] opacity-[0.035] dark:opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <ThemeToggle className="hidden" /> {/* Ensures provider loads correctly if needed */}
      
      {/* Fixed Sticky Header for easy back navigation */}
      <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-5 py-6 md:px-12 pointer-events-none">
        <div className="mix-blend-difference text-white pointer-events-auto">
          <Link href="/#projects" className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] transition-transform hover:-translate-x-2">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Back
          </Link>
        </div>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </nav>

      <article className="pt-32 pb-24">
        {/* Massive Editorial Header */}
        <header className="mx-auto max-w-7xl px-5 md:px-12 mb-20 text-center flex flex-col items-center">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[7rem] mb-10 leading-[0.95] tracking-tight">{project.title}</h1>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {project.tech_stack?.map((tag: string) => (
              <span key={tag} className="border border-line/50 bg-ink/5 px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-full">{tag}</span>
            ))}
          </div>

          {project.project_url && (
             <a href={project.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-ink text-paper px-8 py-5 font-bold uppercase tracking-[0.2em] text-xs transition-transform hover:scale-105">
               View Source Code <Github size={18} />
             </a>
          )}
        </header>

        {/* Showcase Image */}
        {project.image_url && (
          <div className="mx-auto max-w-5xl px-5 md:px-12 mb-24">
            <LightboxImage 
              src={project.image_url} 
              alt={project.title} 
              containerClassName="relative w-full aspect-video rounded-3xl overflow-hidden border border-line shadow-2xl bg-ink/5 dark:bg-line/10"
              imageClassName="object-contain" 
              priority 
            />
          </div>
        )}

        {/* Content Section with Drop Cap */}
        <div className="mx-auto max-w-5xl px-5 md:px-12">
          <div className="grid lg:grid-cols-[1fr_2.5fr] gap-16 mb-32">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted mb-6 border-b border-line pb-4">Overview</p>
              <p className="text-xl md:text-2xl text-ink font-light leading-snug">{project.description}</p>
            </div>
            
            <div className="prose prose-xl dark:prose-invert prose-headings:font-display max-w-none text-ink/80 font-light leading-relaxed">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted mb-6 border-b border-line pb-4">Full Details</p>
              {project.content ? (
                project.content.split("\n").filter((p: string) => p.trim() !== "").map((paragraph: string, i: number) => (
                  <p key={i} className={`mb-8 last:mb-0 ${i === 0 ? "first-letter:text-7xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8]" : ""}`}>{paragraph}</p>
                ))
              ) : (
                <p className="italic text-muted">No detailed story provided.</p>
              )}
            </div>
          </div>

          {/* Immersive Gallery */}
          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div className="mb-24">
               <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted mb-12 border-b border-line pb-4 text-center">Gallery Showcase</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery_urls.map((url: string, index: number) => (
                  <LightboxImage 
                    key={index} 
                    src={url} 
                    alt={`${project.title} gallery image ${index + 1}`} 
                    containerClassName={`group relative w-full overflow-hidden border border-line bg-line/10 ${index % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"}`}
                    imageClassName="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Team Photos */}
          {project.team_photo_urls && project.team_photo_urls.length > 0 && (
            <div className="mb-24">
               <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted mb-12 border-b border-line pb-4 text-center">The Whole Team</p>
               <div className="mx-auto max-w-5xl px-5 md:px-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {project.team_photo_urls.map((url: string, index: number) => {
                     const isSingle = project.team_photo_urls.length === 1;
                     const isWide = index % 3 === 0;
                     return (
                       <LightboxImage 
                         key={index} 
                         src={url} 
                         alt={`Team Group Photo ${index + 1}`} 
                         containerClassName={`group relative w-full overflow-hidden rounded-3xl border border-line shadow-2xl bg-line/10 ${isSingle ? "md:col-span-2 aspect-video md:aspect-[2/1]" : isWide ? "md:col-span-2 aspect-video md:aspect-[21/9]" : "aspect-[4/3]"}`}
                         imageClassName="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                       />
                     );
                   })}
                 </div>
                 {project.team_photo_names && (
                   <p className="mt-8 text-center text-sm uppercase tracking-widest text-muted/80">
                     {project.team_photo_names}
                   </p>
                 )}
               </div>
            </div>
          )}

          {/* Named Contributors Gallery */}
          {project.contributors_data && project.contributors_data.length > 0 && (
            <div className="mb-24">
               <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted mb-12 border-b border-line pb-4 text-center">Team & Contributors</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {project.contributors_data.map((contributor: { name: string; image_url: string }, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="group relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-line/10 shadow-lg mb-4">
                      <Image src={contributor.image_url} alt={contributor.name} fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                    </div>
                    <p className="font-display text-lg text-ink text-center leading-tight">{contributor.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
