"use client";

import { PortfolioData } from "@/lib/types";
import Image from "next/image";
import { ExternalLink, Github, Linkedin, FileText } from "lucide-react";
import { useEffect } from "react";

export function ShowcasePage({ data }: { data: PortfolioData }) {
  const { config, projects, experiences, achievements, contacts } = data;

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

  // Authentic Windows 95 border styles
  const win95Outset = "border-t-[2px] border-l-[2px] border-t-[#ffffff] border-l-[#ffffff] border-b-[2px] border-r-[2px] border-b-[#808080] border-r-[#808080] bg-[#c0c0c0]";
  const win95Inset = "border-t-[2px] border-l-[2px] border-t-[#808080] border-l-[#808080] border-b-[2px] border-r-[2px] border-b-[#ffffff] border-r-[#ffffff] bg-white";
  const win95DeepInset = "border-t-[2px] border-l-[2px] border-t-[#000000] border-l-[#000000] border-b-[2px] border-r-[2px] border-b-[#ffffff] border-r-[#ffffff] bg-white";
  const win95ButtonActive = "active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#ffffff] active:border-r-[#ffffff]";

  return (
    <div 
      className="min-h-screen bg-[#c0c0c0] text-black p-4 select-auto overflow-y-auto antialiased" 
      style={{ fontFamily: "'MS Sans Serif', 'Microsoft Sans Serif', Tahoma, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header Window */}
        <div className={`${win95Outset} p-[3px]`}>
          <div className="bg-[#000080] text-white px-2 py-1 font-bold mb-2 flex items-center justify-between">
            <span className="text-sm">System Properties</span>
            <div className="flex gap-1">
              <div className={`${win95Outset} w-4 h-4 bg-[#c0c0c0] flex items-center justify-center cursor-default`}><span className="text-black leading-none font-bold pb-1">-</span></div>
              <div className={`${win95Outset} w-4 h-4 bg-[#c0c0c0] flex items-center justify-center cursor-default`}><span className="text-black leading-none font-bold pb-1 block">X</span></div>
            </div>
          </div>
          
          <div className="p-3 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {config?.avatar_url && (
              <div className={`${win95Inset} p-1 flex-shrink-0 w-32 h-32 relative`}>
                <Image src={config.avatar_url} alt="Avatar" fill className="object-cover" />
              </div>
            )}
            <div className="flex-grow">
              <h1 className="text-2xl mb-1 flex items-center gap-2">
                <Image src="/os-icons/computer.png" alt="PC" width={24} height={24} className="pixelated" />
                {config?.display_name || "John Lyold Lozada"}
              </h1>
              <div className="w-full h-[1px] bg-[#808080] my-2"></div>
              <div className="w-full h-[1px] bg-[#ffffff] mb-2 -mt-[7px]"></div>
              
              <p className="text-sm mb-2">{config?.title || "IT Professional"}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {contacts?.github_url && (
                  <a href={contacts.github_url} target="_blank" rel="noopener noreferrer" className={`${win95Outset} ${win95ButtonActive} px-3 py-1 flex items-center gap-2 hover:bg-[#c0c0c0] text-sm`}>
                    <Github size={16} /> GitHub
                  </a>
                )}
                {contacts?.linkedin_url && (
                  <a href={contacts.linkedin_url} target="_blank" rel="noopener noreferrer" className={`${win95Outset} ${win95ButtonActive} px-3 py-1 flex items-center gap-2 hover:bg-[#c0c0c0] text-sm`}>
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
                {contacts?.resume_url && (
                  <a href={contacts.resume_url} target="_blank" rel="noopener noreferrer" className={`${win95Outset} ${win95ButtonActive} px-3 py-1 flex items-center gap-2 hover:bg-[#c0c0c0] text-sm`}>
                    <FileText size={16} /> Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {config?.about_me && (
          <div className={`${win95Outset} p-[3px]`}>
            <div className="bg-[#000080] text-white px-2 py-1 font-bold mb-2 flex items-center justify-between">
              <span className="text-sm">Notepad - AboutMe.txt</span>
              <div className="flex gap-1">
                <div className={`${win95Outset} w-4 h-4 bg-[#c0c0c0] flex items-center justify-center`}><span className="text-black leading-none font-bold pb-1 block">X</span></div>
              </div>
            </div>
            <div className="p-1">
              <div className={`${win95Inset} p-2 text-sm leading-relaxed whitespace-pre-wrap`}>
                {config.about_me}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className={`${win95Outset} p-[3px]`}>
          <div className="bg-[#000080] text-white px-2 py-1 font-bold mb-2 flex items-center justify-between">
             <span className="text-sm">Projects Explorer</span>
             <div className="flex gap-1">
                <div className={`${win95Outset} w-4 h-4 bg-[#c0c0c0] flex items-center justify-center`}><span className="text-black leading-none font-bold pb-1 block">X</span></div>
              </div>
          </div>
          <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className={`${win95Outset} p-2 flex flex-col`}>
                <div className="flex gap-2 items-center mb-1">
                  <Image src="/os-icons/folder.png" alt="Folder" width={16} height={16} className="pixelated" />
                  <h4 className="text-md font-bold">{project.title}</h4>
                </div>
                <p className="text-xs text-gray-700 mb-2 pl-6">{project.academic_year}</p>
                
                <div className={`${win95Inset} p-2 mb-3 flex-grow text-sm`}>
                  {project.description}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className={`${win95Inset} text-[10px] px-1 py-0.5`}>{tech}</span>
                  ))}
                </div>
                
                {project.project_url && (
                  <div className="mt-auto flex justify-end">
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer" className={`${win95Outset} ${win95ButtonActive} px-3 py-1 flex items-center gap-1 text-xs hover:bg-[#c0c0c0]`}>
                      Open.exe
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Experience */}
          <div className={`${win95Outset} p-[3px]`}>
            <div className="bg-[#000080] text-white px-2 py-1 font-bold mb-2 flex items-center justify-between">
              <span className="text-sm">Experience.exe</span>
              <div className={`${win95Outset} w-4 h-4 bg-[#c0c0c0] flex items-center justify-center`}><span className="text-black leading-none font-bold pb-1 block">X</span></div>
            </div>
            <div className="p-1">
              <div className={`${win95Inset} p-3 space-y-4 max-h-80 overflow-y-auto bg-white`}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="pb-3 border-b border-[#c0c0c0] last:border-0 last:pb-0">
                    <h4 className="font-bold flex items-center gap-1">
                      <Image src="/os-icons/file.png" alt="File" width={14} height={14} className="pixelated" />
                      {exp.title}
                    </h4>
                    <p className="text-sm font-semibold ml-5">{exp.company}</p>
                    <p className="text-xs text-gray-700 mb-2 ml-5">{exp.date_range} {exp.location ? `| ${exp.location}` : ""}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-5">
                      {exp.bullet_points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className={`${win95Outset} p-[3px]`}>
            <div className="bg-[#000080] text-white px-2 py-1 font-bold mb-2 flex items-center justify-between">
              <span className="text-sm">Achievements.log</span>
              <div className={`${win95Outset} w-4 h-4 bg-[#c0c0c0] flex items-center justify-center`}><span className="text-black leading-none font-bold pb-1 block">X</span></div>
            </div>
            <div className="p-1">
              <div className={`${win95Inset} p-3 space-y-4 max-h-80 overflow-y-auto bg-white`}>
                {achievements.map((ach) => (
                  <div key={ach.id} className="pb-3 border-b border-[#c0c0c0] last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm flex items-center gap-1">
                        <Image src="/os-icons/file.png" alt="File" width={14} height={14} className="pixelated" />
                        {ach.title}
                      </h4>
                    </div>
                    <span className="text-xs text-gray-700 mb-1 ml-5 block">
                      {new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </span>
                    <p className="text-sm ml-5">{ach.description}</p>
                    {ach.url && (
                      <a href={ach.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 ml-5 text-xs text-[#0000EE] hover:underline">
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
