"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface LightboxImageProps {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function LightboxImage({ src, alt, containerClassName = "", imageClassName = "", priority = false }: LightboxImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div 
        className={`cursor-zoom-in ${containerClassName}`} 
        onClick={() => setIsOpen(true)}
      >
        <Image src={src} alt={alt} fill className={imageClassName} priority={priority} />
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-zoom-out backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors p-2 bg-black/50 rounded-full"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>
          
          <div 
            className="relative w-full h-full max-w-7xl mx-auto cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={src} 
              alt={alt} 
              fill 
              className="object-contain" 
              priority 
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
