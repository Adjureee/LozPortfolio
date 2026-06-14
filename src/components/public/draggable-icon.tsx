import React from 'react';
import { motion } from 'framer-motion';

interface DraggableIconProps {
  id: string;
  label: string;
  iconSrc: string;
  initialX: number;
  initialY: number;
  onDoubleClick: () => void;
  constraintsRef?: React.RefObject<Element | null>;
}

export function DraggableIcon({
  id,
  label,
  iconSrc,
  initialX,
  initialY,
  onDoubleClick,
  constraintsRef
}: DraggableIconProps) {
  return (
    <motion.div 
      key={id}
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      style={{ position: 'absolute', top: initialY, left: initialX }}
      className="flex flex-col items-center justify-start w-[70px] cursor-pointer group active:opacity-70 pointer-events-auto"
      onDoubleClick={onDoubleClick}
    >
      <img 
        src={iconSrc} 
        alt={label} 
        className="w-8 h-8 mb-1 group-hover:scale-105 transition-transform pointer-events-none drop-shadow-md" 
        style={{ imageRendering: 'pixelated' }} 
      />
      <span className="text-white text-[11px] leading-tight font-sans text-center bg-transparent group-hover:bg-[#000080] group-hover:px-1 shadow-[0_1px_1px_rgba(0,0,0,0.8)] pointer-events-none break-words w-full">
        {label}
      </span>
    </motion.div>
  );
}
