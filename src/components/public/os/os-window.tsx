"use client";

import { ReactNode } from "react";
import { motion, useDragControls } from "framer-motion";

interface OSWindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  isActive: boolean;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  width?: number;
  height?: number;
}

export function OSWindow({
  title,
  icon,
  isActive,
  zIndex,
  onClose,
  onFocus,
  children,
  defaultPosition = { x: 50, y: 50 },
  width = 600,
  height = 400
}: OSWindowProps) {
  const dragControls = useDragControls();

  // Mobile responsiveness
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const finalWidth = isMobile ? window.innerWidth - 20 : width;
  const finalHeight = isMobile ? window.innerHeight - 100 : height;
  const finalPos = isMobile ? { x: 10, y: 10 } : defaultPosition;

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      initial={finalPos}
      onMouseDown={onFocus}
      style={{ width: finalWidth, height: finalHeight, zIndex, position: 'absolute' }}
      className={`flex flex-col bg-[#C0C0C0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0_#000]`}
    >
      {/* Title Bar */}
      <div 
        className={`title-bar flex items-center justify-between px-1 py-1 cursor-default select-none ${isActive ? 'bg-[#000080] text-white' : 'bg-[#808080] text-[#C0C0C0]'}`}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2 overflow-hidden pl-1">
          {icon && <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>}
          <span className="font-bold text-sm truncate font-sans">{title}</span>
        </div>
        
        <button 
          onClick={onClose}
          onMouseDown={(e) => e.stopPropagation()}
          className="ml-2 flex items-center justify-center w-5 h-5 bg-[#C0C0C0] text-black font-bold text-xs border border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white focus:outline-none shrink-0"
        >
          X
        </button>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-hidden p-1 bg-[#C0C0C0]">
        <div className="w-full h-full bg-white border border-t-[#808080] border-l-[#808080] border-r-white border-b-white overflow-hidden text-black flex flex-col relative">
          {isActive === false && (
            // Invisible overlay to capture drags when iframe is unfocused
            <div className="absolute inset-0 z-50 bg-transparent" />
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
}
