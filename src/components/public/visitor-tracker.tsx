"use client";

import { useEffect, useRef } from "react";
import { recordVisitor } from "@/app/actions/analytics";

export function VisitorTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent double tracking in React Strict Mode
    if (hasTracked.current) return;
    hasTracked.current = true;

    // Fire and forget
    recordVisitor();
  }, []);

  return null; // This component is invisible
}
