"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Typewriter({ text, delay = 0, animateOnScroll = false, start = true }: { text: string; delay?: number; animateOnScroll?: boolean; start?: boolean }) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    if (!start) return;
    
    // If animateOnScroll is true and it's not in view, clear the text and wait
    if (animateOnScroll && !isInView) {
      setDisplayText("");
      return;
    }

    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 75); // speed in ms
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay, animateOnScroll, isInView, start]);

  return (
    <span ref={ref}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[0.1em] h-[1em] bg-accent ml-2 -mb-2"
      />
    </span>
  );
}
