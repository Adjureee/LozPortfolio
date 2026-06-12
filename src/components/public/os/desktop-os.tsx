"use client";

import { useState, useEffect } from "react";
import { OSWindow } from "./os-window";
import { Terminal, FileText, Gamepad2 } from "lucide-react";

interface AppConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  width?: number;
  height?: number;
}

export function DesktopOS({ onClose }: { onClose: () => void }) {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [zIndices, setZIndices] = useState<Record<string, number>>({});
  const [nextZIndex, setNextZIndex] = useState(10);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const apps: Record<string, AppConfig> = {
    "doom": {
      id: "doom",
      title: "DOOM (1993)",
      icon: <Gamepad2 size={16} />,
      width: 660,
      height: 440,
      content: (
        <iframe 
          src="https://archive.org/embed/msdos_Doom_1993" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen
          className="w-full h-full bg-black"
        ></iframe>
      )
    },
    "prince": {
      id: "prince",
      title: "Prince of Persia",
      icon: <Gamepad2 size={16} />,
      width: 660,
      height: 440,
      content: (
        <iframe 
          src="https://archive.org/embed/msdos_Prince_of_Persia_1990" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen
          className="w-full h-full bg-black"
        ></iframe>
      )
    },
    "resume": {
      id: "resume",
      title: "Resume.txt - Notepad",
      icon: <FileText size={16} />,
      width: 500,
      height: 600,
      content: (
        <div className="p-4 font-mono text-sm whitespace-pre-wrap overflow-auto h-full">
          {`Loz
Creative Developer & Engineer

EXPERIENCE:
- Building highly interactive web experiences
- Proficient in React, Next.js, TypeScript, Tailwind
- Passionate about WebGL and animations

SKILLS:
- Frontend: React, Next.js, Framer Motion
- Backend: Node.js, Supabase, PostgreSQL
- Tools: Git, Vercel, Figma

"It looks like you're writing a resume. Would you like help?"
... No thanks, Clippy.`}
        </div>
      )
    }
  };

  const openApp = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
    focusWindow(id);
  };

  const closeApp = (id: string) => {
    setOpenWindows(openWindows.filter(w => w !== id));
    if (activeWindow === id) {
      const remaining = openWindows.filter(w => w !== id);
      setActiveWindow(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  };

  const focusWindow = (id: string) => {
    if (activeWindow !== id) {
      setActiveWindow(id);
      setZIndices(prev => ({ ...prev, [id]: nextZIndex }));
      setNextZIndex(nextZIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#008080] overflow-hidden font-sans select-none touch-none text-black">
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6">
        <DesktopIcon 
          title="DOOM" 
          icon={<Gamepad2 size={32} className="text-white" />} 
          onDoubleClick={() => openApp('doom')} 
        />
        <DesktopIcon 
          title="Prince of Persia" 
          icon={<Gamepad2 size={32} className="text-white" />} 
          onDoubleClick={() => openApp('prince')} 
        />
        <DesktopIcon 
          title="Resume.txt" 
          icon={<FileText size={32} className="text-white" />} 
          onDoubleClick={() => openApp('resume')} 
        />
      </div>

      {/* Windows */}
      {openWindows.map((id, index) => {
        const app = apps[id];
        return (
          <OSWindow
            key={id}
            id={id}
            title={app.title}
            icon={app.icon}
            isActive={activeWindow === id}
            zIndex={zIndices[id] || 10 + index}
            onClose={() => closeApp(id)}
            onFocus={() => focusWindow(id)}
            width={app.width}
            height={app.height}
            defaultPosition={{ x: 100 + (index * 30), y: 50 + (index * 30) }}
          >
            {app.content}
          </OSWindow>
        );
      })}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#C0C0C0] border-t-2 border-white flex items-center justify-between px-1 shadow-[0_-2px_4px_rgba(0,0,0,0.2)] z-[10000]">
        <div className="flex items-center gap-1">
          {/* Start Button */}
          <button 
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white font-bold text-sm"
          >
            <Terminal size={16} className="text-blue-600" />
            <span className="mb-0.5 tracking-wide">Shutdown</span>
          </button>
          
          <div className="w-px h-6 bg-[#808080] mx-1 border-r border-white"></div>
          
          {/* Open Apps Taskbar Tabs */}
          {openWindows.map(id => {
            const app = apps[id];
            const isActive = activeWindow === id;
            return (
              <button
                key={id}
                onClick={() => focusWindow(id)}
                className={`flex items-center gap-1 px-3 py-1 max-w-[150px] truncate border-2 text-sm
                  ${isActive 
                    ? 'border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#e0e0e0] font-bold' 
                    : 'border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#C0C0C0]'
                  }`}
              >
                {app.icon}
                <span className="truncate">{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* System Tray Clock */}
        <div className="px-3 py-1 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#C0C0C0] text-sm font-sans">
          {time}
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({ title, icon, onDoubleClick }: { title: string, icon: React.ReactNode, onDoubleClick: () => void }) {
  const [selected, setSelected] = useState(false);

  return (
    <div 
      className={`flex flex-col items-center gap-1 w-20 p-1 cursor-pointer ${selected ? 'bg-blue-800 border border-blue-400 border-dotted' : ''}`}
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      onDoubleClick={onDoubleClick}
      tabIndex={0}
    >
      <div className="w-10 h-10 flex items-center justify-center drop-shadow-md">
        {icon}
      </div>
      <span className={`text-xs text-center leading-tight ${selected ? 'bg-blue-800 text-white' : 'text-white'}`} style={{ textShadow: '1px 1px 0 #000' }}>
        {title}
      </span>
    </div>
  );
}
