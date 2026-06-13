"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  unlockAndUnmute: () => Promise<void>;
  playHover: () => void;
  playClick: () => void;
  playMouseDown: () => void;
  playMouseUp: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Web Audio API on first user interaction to comply with Autoplay policies
    const initAudio = () => {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    };

    window.addEventListener("click", initAudio, { once: true });
    window.addEventListener("keydown", initAudio, { once: true });

    // Set up placeholder background music
    bgmRef.current = new Audio("/audio/bgm.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.15;

    return () => {
      window.removeEventListener("click", initAudio);
      window.removeEventListener("keydown", initAudio);
    };
  }, []);

  useEffect(() => {
    if (bgmRef.current) {
      if (!isMuted) {
        bgmRef.current.play().catch(() => {
          // Ignore autoplay blocks
        });
      } else {
        bgmRef.current.pause();
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const unlockAndUnmute = async () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.error("AudioContext resume failed", e);
      }
    }
    setIsMuted(false);
  };

  // Synthesize a soft "tick" for hover
  const playHover = useCallback(() => {
    if (isMuted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime); // Very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [isMuted]);

  // Use authentic mechanical click for all UI buttons
  const playClick = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/audio/real_click_down.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Click audio error:", e));
  }, [isMuted]);

  // Authentic Monitor Click Sounds
  const playMouseDown = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/audio/real_click_down.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("MouseDown audio error:", e));
  }, [isMuted]);

  const playMouseUp = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/audio/real_click_up.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("MouseUp audio error:", e));
  }, [isMuted]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, unlockAndUnmute, playHover, playClick, playMouseDown, playMouseUp }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}
