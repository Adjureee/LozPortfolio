"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Visitor } from "@/lib/types";

export default function MapComponent({ visitors }: { visitors: Visitor[] }) {
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
      
      {/* The MapContainer MUST have a defined height */}
      <div className="w-full relative z-0 rounded border border-line overflow-hidden" style={{ height: "450px" }}>
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          minZoom={2}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%", background: "#0f1214" }} // Matches dark paper
          worldCopyJump={true}
        >
          {/* CartoDB Dark Matter Base Map for hacker aesthetics */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={['a', 'b', 'c', 'd']}
          />
          
          {markers.map((marker) => (
            <CircleMarker
              key={marker.id}
              center={[marker.latitude!, marker.longitude!]}
              pathOptions={{
                color: "rgb(var(--accent))",
                fillColor: "rgb(var(--accent))",
                fillOpacity: 0.4,
                weight: 2
              }}
              radius={8}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span className="font-bold text-ink">{marker.city}, {marker.country}</span>
              </Tooltip>
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <p className="font-bold text-lg mb-0 text-ink leading-tight">{marker.city}</p>
                  <p className="text-muted text-sm mb-3">{marker.country}</p>
                  <div className="bg-ink/5 p-2 rounded border border-line">
                    <p className="font-mono text-xs text-accent">IP: {marker.ip_address}</p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
