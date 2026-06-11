"use client";

import dynamic from "next/dynamic";
import type { Visitor } from "@/lib/types";

// Dynamically import the actual map component, disabling SSR to avoid window is not defined errors
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-ink/5 border border-line rounded-lg p-4 flex flex-col items-center justify-center mb-10 overflow-hidden" style={{ height: "450px" }}>
      <div className="animate-pulse flex flex-col items-center gap-4">
         <span className="w-6 h-6 rounded-full bg-accent drop-shadow-[0_0_10px_var(--accent)]"></span>
         <span className="text-muted text-sm uppercase tracking-widest font-bold">Initializing Satellite Uplink...</span>
      </div>
    </div>
  ),
});

export function VisitorMap({ visitors }: { visitors: Visitor[] }) {
  return <MapComponent visitors={visitors} />;
}
