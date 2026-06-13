"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const outerSpringConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const innerSpringConfig = { damping: 30, stiffness: 400, mass: 0.1 };
  
  const outerX = useSpring(cursorX, outerSpringConfig);
  const outerY = useSpring(cursorY, outerSpringConfig);
  
  const innerX = useSpring(cursorX, innerSpringConfig);
  const innerY = useSpring(cursorY, innerSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      if (document.body.classList.contains("force-system-cursor")) {
        if (isVisible) setIsVisible(false);
        return;
      }
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, input, textarea, [role='button'], .project-card");
      setIsHovered(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[999999] rounded-full flex items-center justify-center overflow-hidden mix-blend-difference"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovered ? 64 : (isClicking ? 8 : 12),
          height: isHovered ? 64 : (isClicking ? 8 : 12),
          backgroundColor: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,1)",
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 0 : -45 
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-black"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 22V2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v-2h-2v-2h-2v2H8z" fill="white"/>
            <path d="M9 3v18h2v-2h2v-2h2v-2h2v-2h2v-2h2V9h-2V7h-2V5h-2V3H9z" fill="black"/>
          </svg>
        </motion.div>
      </motion.div>

      {/* Click Ring Flash */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1, borderWidth: "4px" }}
            animate={{ scale: 2.5, opacity: 0, borderWidth: "0px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-none fixed top-0 left-0 z-[999998] rounded-full border-white mix-blend-difference"
            style={{
              x: outerX,
              y: outerY,
              width: 32,
              height: 32,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
