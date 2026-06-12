"use client";

import { PortfolioData } from "@/lib/types";
import Image from "next/image";
import { ExternalLink, Github, Linkedin, FileText } from "lucide-react";
import { useEffect } from "react";

export function ShowcasePage({ data }: { data: PortfolioData }) {
  const { config, projects, experiences, achievements, contacts } = data;

  // Add global style to hide the cursor-none class if it leaks from layout
  useEffect(() => {
    document.body.style.cursor = "auto";
    const allElems = document.querySelectorAll('*');
    allElems.forEach(el => {
      (el as HTMLElement).style.cursor = "auto";
    });
    return () => {
      document.body.style.cursor = "";
      allElems.forEach(el => {
        (el as HTMLElement).style.cursor = "";
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black font-sans p-6 md:p-12 select-auto overflow-y-auto" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header className="mb-12 border-b-4 border-black pb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        {config?.avatar_url && (
          <div className="relative w-32 h-32 border-4 border-black bg-white p-1 shadow-[6px_6px_0_0_#000] flex-shrink-0">
            <Image src={config.avatar_url} alt="Avatar" fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{config?.display_name || "John Lyold Lozada"}</h1>
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mt-2">{config?.title || "IT Professional"}</h2>
        </div>
      </header>

      {/* About */}
      {config?.about_me && (
        <section className="mb-16">
          <h3 className="text-2xl font-black uppercase border-b-2 border-black inline-block mb-6">About</h3>
          <p className="text-lg leading-relaxed max-w-4xl whitespace-pre-wrap font-medium">{config.about_me}</p>
        </section>
      )}

      {/* Projects */}
      <section className="mb-16">
        <h3 className="text-2xl font-black uppercase border-b-2 border-black inline-block mb-6">Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[3px_3px_0_0_#000] transition-all flex flex-col">
              <h4 className="text-2xl font-black mb-1">{project.title}</h4>
              <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">{project.academic_year}</p>
              {project.description && <p className="mb-6 flex-grow font-medium">{project.description}</p>}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="bg-black text-white text-xs font-bold px-2 py-1 uppercase">{tech}</span>
                ))}
              </div>
              
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-black hover:underline mt-auto">
                  VIEW PROJECT <ExternalLink size={18} strokeWidth={3} />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Experience */}
        <section>
          <h3 className="text-2xl font-black uppercase border-b-2 border-black inline-block mb-6">Experience</h3>
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-4 border-black pl-6 py-1 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-black before:left-[-10px] before:top-2">
                <h4 className="text-xl font-black">{exp.title}</h4>
                <p className="text-lg font-bold text-gray-700">{exp.company}</p>
                <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{exp.date_range} {exp.location ? `| ${exp.location}` : ""}</p>
                <ul className="list-disc list-inside space-y-2 font-medium">
                  {exp.bullet_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        {/* Achievements */}
        <section>
          <h3 className="text-2xl font-black uppercase border-b-2 border-black inline-block mb-6">Achievements</h3>
          <div className="space-y-6">
            {achievements.map((ach) => (
              <div key={ach.id} className="bg-white p-5 border-4 border-black shadow-[4px_4px_0_0_#000]">
                <div className="flex justify-between items-start mb-2 flex-col sm:flex-row gap-2">
                  <h4 className="font-black text-lg">{ach.title}</h4>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 border border-gray-300">
                    {new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-sm font-medium">{ach.description}</p>
                {ach.url && (
                  <a href={ach.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-bold hover:underline">
                    View Credentials &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Contact */}
      <section className="mt-16 pt-8 border-t-4 border-black">
        <h3 className="text-2xl font-black uppercase mb-6 text-center">Connect</h3>
        <div className="flex gap-6 justify-center">
          {contacts?.github_url && (
            <a href={contacts.github_url} target="_blank" rel="noopener noreferrer" className="p-4 border-4 border-black bg-white shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-all">
              <Github size={32} strokeWidth={2.5} />
            </a>
          )}
          {contacts?.linkedin_url && (
            <a href={contacts.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-4 border-4 border-black bg-white shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all">
              <Linkedin size={32} strokeWidth={2.5} />
            </a>
          )}
          {contacts?.resume_url && (
            <a href={contacts.resume_url} target="_blank" rel="noopener noreferrer" className="p-4 border-4 border-black bg-white shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-all" title="View Resume">
              <FileText size={32} strokeWidth={2.5} />
            </a>
          )}
        </div>
        <p className="text-center mt-12 text-sm font-bold text-gray-500 uppercase tracking-widest">
          © {new Date().getFullYear()} John Lyold Lozada
        </p>
      </section>
    </div>
  );
}
