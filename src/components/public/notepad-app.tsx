import React from 'react';
import { RetroWindow } from './retro-window';
import { FileText } from 'lucide-react';

export function NotepadApp({ 
  onClose,
  constraintsRef,
  zIndex,
  onFocus
}: { 
  onClose: () => void;
  constraintsRef?: React.RefObject<Element | null>;
  zIndex?: number;
  onFocus?: () => void;
}) {
  return (
    <RetroWindow
      title="Notepad - Resume.txt"
      icon={<FileText size={12} color="white" />}
      width={450}
      height={350}
      defaultPosition={{ x: 40, y: 40 }}
      onClose={onClose}
      constraintsRef={constraintsRef}
      zIndex={zIndex}
      onPointerDown={onFocus}
    >
      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-1 text-sm bg-[#c0c0c0] text-black">
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">File</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Edit</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Search</span>
        <span className="hover:bg-[#000080] hover:text-white cursor-pointer px-1">Help</span>
      </div>

      {/* Recessed Content Area */}
      <div className="flex-1 min-h-0 bg-white shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] p-1 overflow-hidden flex flex-col">
        <textarea 
          className="w-full h-full resize-none outline-none border-none p-2 font-mono text-xs text-black"
          readOnly
          defaultValue={`LAURENCE "LOZ" PORTFOLIO
========================

PROFESSIONAL EXPERIENCE:
------------------------
* Senior Full-Stack Developer
  Building immersive 3D web experiences and retro OS interfaces.

* Game Engine Architect
  Created an isometric C++ rendering pipeline.

SKILLS:
-------
- React, Next.js, Three.js
- Tailwind CSS, Framer Motion
- Node.js, C++

HOBBIES:
--------
- Mechanical keyboards
- CRT monitor restoration
- Win95 aesthetics`}
        />
      </div>
    </RetroWindow>
  );
}
