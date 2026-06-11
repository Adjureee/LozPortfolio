"use client";

import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { Visitor } from "@/lib/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function VisitorMap({ visitors }: { visitors: Visitor[] }) {
  const markers = useMemo(() => {
    return visitors.filter((v) => v.latitude !== null && v.longitude !== null);
  }, [visitors]);

  return (
    <div className="w-full bg-ink/5 border border-line rounded-lg p-4 flex flex-col items-center justify-center mb-10 overflow-hidden relative">
      <div className="w-full flex justify-between items-center mb-4 px-4">
        <h3 className="font-display text-xl text-ink uppercase tracking-widest">Global Reach</h3>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-accent drop-shadow-[0_0_4px_var(--accent)] animate-pulse"></span>
           <span className="text-xs text-muted uppercase tracking-wider">{markers.length} Locations Mapped</span>
        </div>
      </div>
      
      <div className="w-full relative" style={{ height: "450px" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(var(--line), 0.3)"
                  stroke="rgba(var(--paper), 0.1)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "rgba(var(--line), 0.6)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          
          {markers.map((marker) => (
            <Marker key={marker.id} coordinates={[marker.longitude!, marker.latitude!]}>
              {/* Outer glowing halo */}
              <circle r={8} fill="rgb(var(--accent))" opacity={0.3} className="animate-pulse" />
              {/* Inner dot */}
              <circle r={3} fill="rgb(var(--accent))" style={{ filter: "drop-shadow(0 0 5px rgb(var(--accent)))" }} />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
