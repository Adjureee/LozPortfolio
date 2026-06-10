"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { HackerTerminal } from "@/components/public/hacker-terminal";
import { ZorkEngine } from "@/components/public/zork-engine";
import { IsoGame } from "@/components/public/iso-game";

interface TerminalContextType {
  isTerminalOpen: boolean;
  toggleTerminal: () => void;
  closeTerminal: () => void;
  openZork: () => void;
  closeZork: () => void;
  openIso: () => void;
  closeIso: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isZorkOpen, setIsZorkOpen] = useState(false);
  const [isIsoOpen, setIsIsoOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal with backtick/tilde, but avoid interfering with input fields unless it's exactly the tilde
      // Actually, standard is usually just ` or ~ anywhere.
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
      
      if (e.key === "Escape" && isTerminalOpen) {
        setIsTerminalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalOpen]);

  const toggleTerminal = () => setIsTerminalOpen(prev => !prev);
  const closeTerminal = () => setIsTerminalOpen(false);
  const openZork = () => {
    setIsZorkOpen(true);
    setIsTerminalOpen(false); // Close terminal if Zork opens
  };
  const closeZork = () => setIsZorkOpen(false);
  
  const openIso = () => {
    setIsIsoOpen(true);
    setIsTerminalOpen(false);
  };
  const closeIso = () => setIsIsoOpen(false);

  return (
    <TerminalContext.Provider value={{ isTerminalOpen, toggleTerminal, closeTerminal, openZork, closeZork, openIso, closeIso }}>
      {children}
      
      {/* Global Overlays */}
      <HackerTerminal 
        isOpen={isTerminalOpen} 
        onClose={closeTerminal} 
        onLaunchZork={openZork} 
        onLaunchIso={openIso}
      />
      
      {isZorkOpen && <ZorkEngine onClose={closeZork} />}
      {isIsoOpen && <IsoGame onClose={closeIso} />}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}
