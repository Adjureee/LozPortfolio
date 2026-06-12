"use client";

import { PortfolioData } from "@/lib/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PT_Serif } from "next/font/google";

const serifFont = PT_Serif({ 
  weight: ["400", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"]
});

type Tab = "home" | "about" | "experience" | "projects" | "contact";

export function ShowcasePage({ data }: { data: PortfolioData }) {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const { config, projects, experiences, contacts } = data;

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

  const navItems: { id: Tab; label: string }[] = [
    { id: "about", label: "ABOUT" },
    { id: "experience", label: "EXPERIENCE" },
    { id: "projects", label: "PROJECTS" },
    { id: "contact", label: "CONTACT" }
  ];

  // Helper to render the resume banner
  const renderResumeBanner = () => {
    if (!contacts?.resume_url) return null;
    return (
      <a href={contacts.resume_url} target="_blank" rel="noopener noreferrer" className="block w-full border-b-2 border-gray-300 pb-4 mb-8 group cursor-pointer hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-4">
          <div className="text-4xl group-hover:-rotate-12 transition-transform duration-300">📄</div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">Looking for my resume?</h3>
            <p className="text-gray-600">Click here to download it!</p>
          </div>
        </div>
      </a>
    );
  };

  // Content renderers
  const renderHome = () => (
    <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>
        {config?.display_name || "John Lyold Lozada"}
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-16" style={{ fontFamily: "Courier New, monospace", letterSpacing: "-0.5px" }}>
        As an aspiring fullstack dev
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-lg font-bold">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="text-gray-800 hover:underline underline-offset-8 decoration-2 cursor-pointer transition-all"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold mb-8 text-gray-900" style={{ fontFamily: "Georgia, serif" }}>About Me</h2>
      {config?.avatar_url && (
        <div className="mb-8 w-48 h-48 relative grayscale hover:grayscale-0 transition-all duration-500">
          <Image src={config.avatar_url} alt="Profile" fill className="object-cover border-4 border-gray-900" />
        </div>
      )}
      <div className="text-lg leading-relaxed text-gray-800 space-y-6" style={{ fontFamily: "Georgia, serif" }}>
        <p className="whitespace-pre-wrap">{config?.about_me}</p>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="animate-in fade-in duration-500">
      {renderResumeBanner()}
      <div className="space-y-16">
        {experiences.map((exp) => (
          <div key={exp.id}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>{exp.company}</h2>
                <h3 className="text-2xl font-bold text-gray-700" style={{ fontFamily: "Courier New, monospace" }}>{exp.title}</h3>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "Georgia, serif" }}>{exp.location || "Remote"}</p>
                <p className="text-lg font-bold text-gray-600" style={{ fontFamily: "Georgia, serif" }}>{exp.date_range}</p>
              </div>
            </div>
            <ul className="space-y-4 text-lg text-gray-800 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              {exp.bullet_points.map((pt, i) => (
                <li key={i} className="text-justify">{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold mb-12 text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Projects</h2>
      <div className="space-y-16">
        {projects.map((project) => (
          <div key={project.id}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>{project.title}</h3>
                <p className="text-xl font-bold text-gray-700" style={{ fontFamily: "Courier New, monospace" }}>{project.academic_year}</p>
              </div>
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-800 hover:underline mt-4 md:mt-0" style={{ fontFamily: "Georgia, serif" }}>
                  View Project &rarr;
                </a>
              )}
            </div>
            <div className="text-lg text-gray-800 leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
              {project.description}
            </div>
            <div className="flex flex-wrap gap-3">
              {project.tech_stack.map((tech) => (
                <span key={tech} className="text-sm font-bold text-gray-600 border border-gray-400 px-2 py-1" style={{ fontFamily: "Courier New, monospace" }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold mb-8 text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Contact</h2>
      <p className="text-xl mb-12 text-gray-800" style={{ fontFamily: "Georgia, serif" }}>
        Feel free to reach out. I&apos;m currently open to new opportunities!
      </p>
      
      <div className="space-y-6 text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
        {contacts?.linkedin_url && (
          <div>
            <a href={contacts.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline flex items-center gap-4">
              LINKEDIN <ExternalLink size={24} />
            </a>
          </div>
        )}
        {contacts?.github_url && (
          <div>
            <a href={contacts.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline flex items-center gap-4">
              GITHUB <ExternalLink size={24} />
            </a>
          </div>
        )}
        {contacts?.resume_url && (
          <div>
            <a href={contacts.resume_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline flex items-center gap-4">
              RESUME <ExternalLink size={24} />
            </a>
          </div>
        )}
      </div>
    </div>
  );

  if (activeTab === "home") {
    return (
      <div className={`w-full h-screen bg-[#fdfdfd] overflow-hidden ${serifFont.className}`}>
        {renderHome()}
      </div>
    );
  }

  // Split layout for inner pages
  return (
    <div className={`w-full h-screen bg-[#fdfdfd] flex flex-col md:flex-row overflow-hidden ${serifFont.className}`}>
      
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col flex-shrink-0 bg-[#fdfdfd] z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
            {config?.display_name ? config.display_name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            )) : (
              <>
                <span className="block">John</span>
                <span className="block">Lyold</span>
                <span className="block">Lozada</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-xl font-bold text-gray-600" style={{ fontFamily: "Georgia, serif" }}>
            Showcase &apos;{new Date().getFullYear().toString().slice(-2)}
          </p>
        </div>
        
        <nav className="flex flex-col space-y-6 mt-auto md:mt-12 text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>
          <button
            onClick={() => setActiveTab("home")}
            className="text-left text-gray-800 hover:underline underline-offset-4 w-fit"
          >
            HOME
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-left w-fit transition-all ${
                activeTab === item.id 
                  ? "text-gray-900 underline underline-offset-4" 
                  : "text-gray-800 hover:underline underline-offset-4"
              }`}
            >
              {activeTab === item.id && <span className="mr-2">&bull;</span>}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-8 md:p-12 lg:p-16 overflow-y-auto bg-[#fdfdfd]">
        <div className="max-w-3xl">
          {activeTab === "about" && renderAbout()}
          {activeTab === "experience" && renderExperience()}
          {activeTab === "projects" && renderProjects()}
          {activeTab === "contact" && renderContact()}
        </div>
      </div>
      
    </div>
  );
}
