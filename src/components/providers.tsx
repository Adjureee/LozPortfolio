"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 0.95, touchMultiplier: 1.15 }}>
        {children}
      </ReactLenis>
    </ThemeProvider>
  );
}
