"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __CONSOLE_EGG_LOADED__?: boolean;
    hireLoz?: () => string;
  }
}

export function ConsoleEasterEgg() {
  useEffect(() => {
    // Ensure this only runs on the client and only once
    if (typeof window === "undefined" || window.__CONSOLE_EGG_LOADED__) return;
    window.__CONSOLE_EGG_LOADED__ = true;

    // A beautiful ASCII art logo
    const asciiArt = `
  _        _______  _______ 
 ( \\      (  ___  )/ ___   )
 | (      | (   ) |\\/   /  /
 | |      | |   | |    /  / 
 | |      | |   | |   /  /  
 | |      | |   | |  /  /   
 | (____/\\| (___) | /  /____
 (_______/(_______)(_______)
                            
    `;

    const styles = [
      "color: #10B981", // Emerald green color
      "font-size: 16px",
      "font-family: monospace",
      "font-weight: bold",
      "text-shadow: 0 0 5px #10B981",
    ].join(";");

    console.log("%c" + asciiArt, styles);
    
    console.log(
      "%cHello there, fellow developer! 👋\n\n%cI see you peeking under the hood. If you're looking for my secrets, try running %cwindow.hireLoz()%c in this console.",
      "color: #F3F4F6; font-size: 14px; font-weight: bold; font-family: sans-serif;",
      "color: #9CA3AF; font-size: 14px; font-family: sans-serif;",
      "color: #10B981; font-size: 14px; font-family: monospace; font-weight: bold; padding: 2px 4px; border-radius: 4px; background: rgba(16, 185, 129, 0.1);",
      "color: #9CA3AF; font-size: 14px; font-family: sans-serif;"
    );

    // Attach the secret function
    window.hireLoz = () => {
      console.clear();
      console.log(
        "%c🎉 YOU FOUND IT! 🎉",
        "color: #3B82F6; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #3B82F6;"
      );
      console.log(
        "%cHere is my secret message to you:\n\nIf you're reading this, it means you have an eye for detail and you appreciate developers who build fun things. I am always looking for exciting opportunities, amazing teams, and cool projects to build.\n\nLet's build something awesome together.\n\nP.S. Type 'matrix' on the keyboard right now (without focusing the console).",
        "color: #F3F4F6; font-size: 14px; font-family: sans-serif; line-height: 1.5;"
      );
      return "Access Granted.";
    };
  }, []);

  return null; // This component doesn't render anything to the DOM
}
