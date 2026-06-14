import React from 'react';
import { motion, useDragControls } from 'framer-motion';

interface RetroWindowProps {
  title: string;
  icon?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
  children: React.ReactNode;
  constraintsRef?: React.RefObject<Element | null>;
  zIndex?: number;
  onPointerDown?: () => void;
}

export function RetroWindow({
  title,
  icon,
  width = 600,
  height = 400,
  defaultPosition = { x: 50, y: 50 },
  onClose,
  children,
  constraintsRef,
  zIndex = 50,
  onPointerDown
}: RetroWindowProps) {
  const dragControls = useDragControls();

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={defaultPosition}
      onPointerDown={onPointerDown}
      style={{
        width,
        height,
        zIndex,
        position: 'absolute'
      }}
      className="bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] flex flex-col pointer-events-auto select-none"
    >
      {/* Title Bar */}
      <div 
        className="title-bar h-6 bg-[#000080] m-[2px] flex items-center justify-between px-1 cursor-default active:cursor-move"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          {icon && <div className="w-4 h-4 flex items-center justify-center">{icon}</div>}
          <span className="text-white text-xs font-bold font-sans tracking-wide truncate pr-2">
            {title}
          </span>
        </div>
        
        {/* Window Controls */}
        <div className="flex gap-[2px]">
          <button className="w-4 h-4 bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] flex items-center justify-center text-black font-bold text-[10px]">
            <span className="relative -top-[4px]">_</span>
          </button>
          <button className="w-4 h-4 bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] flex items-center justify-center text-black font-bold text-[10px]">
            <div className="w-2 h-[6px] border-[1px] border-black border-t-[2px]"></div>
          </button>
          <button 
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#fff] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf,inset_2px_2px_#808080,inset_-2px_-2px_#fff] flex items-center justify-center text-black font-bold text-[10px]"
          >
            x
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0 relative p-1 cursor-default">
        {children}
      </div>
    </motion.div>
  );
}
