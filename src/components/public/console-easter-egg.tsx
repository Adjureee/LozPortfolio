"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __CONSOLE_EGG_LOADED__?: boolean;
    loz?: Record<string, () => string>;
  }
}

export function ConsoleEasterEgg() {
  useEffect(() => {
    // Ensure this only runs on the client and only once
    if (typeof window === "undefined" || window.__CONSOLE_EGG_LOADED__) return;
    window.__CONSOLE_EGG_LOADED__ = true;

    // A beautiful ASCII art logo for "LOZ."
    const asciiArt = `
  _       _______ _______      
 | |     |  ___  |___   /      
 | |     | |   | |   / /   _   
 | |     | |   | |  / /   (_)  
 | |____ | |___| | / /___  _   
 |______)(_______)_______)(_)  
                               
    `;

    const styles = [
      "color: #3B82F6", // Blue color
      "font-size: 14px",
      "font-family: monospace",
      "font-weight: bold",
      "text-shadow: 0 0 8px #3B82F6",
    ].join(";");

    console.log("%c" + asciiArt, styles);
    
    console.log(
      "%cHello there, fellow developer! 👋\n\n%cI see you peeking under the hood. To explore my secrets, type %cwindow.loz%c in this console and hit Enter.",
      "color: #F3F4F6; font-size: 14px; font-weight: bold; font-family: sans-serif;",
      "color: #9CA3AF; font-size: 14px; font-family: sans-serif;",
      "color: #3B82F6; font-size: 14px; font-family: monospace; font-weight: bold; padding: 2px 4px; border-radius: 4px; background: rgba(59, 130, 246, 0.1);",
      "color: #9CA3AF; font-size: 14px; font-family: sans-serif;"
    );

    // Attach the interactive API
    window.loz = {
      about: () => {
        console.log(
          "%cABOUT ME\n\n%cI'm John Lyold Lozada, a developer who loves building highly interactive, memorable, and beautiful web experiences. I pay attention to the tiny details (like this console message).",
          "color: #10B981; font-weight: bold; font-size: 16px;",
          "color: #D1D5DB; font-size: 14px; line-height: 1.5;"
        );
        return "End of transmission.";
      },
      skills: () => {
        console.table([
          { Skill: "React & Next.js", Level: "Expert", Vibe: "🔥" },
          { Skill: "TypeScript", Level: "Advanced", Vibe: "💪" },
          { Skill: "Tailwind CSS", Level: "Expert", Vibe: "🎨" },
          { Skill: "Framer Motion", Level: "Advanced", Vibe: "✨" },
          { Skill: "Easter Eggs", Level: "God-tier", Vibe: "🥚" }
        ]);
        return "These are just the highlights.";
      },
      contact: () => {
        console.log(
          "%cLet's build something awesome together.\n\n%cEmail: %clozada.johnlyold@example.com\n%cGitHub: %chttps://github.com/Adjureee",
          "color: #F59E0B; font-weight: bold; font-size: 14px;",
          "color: #9CA3AF; font-size: 14px;",
          "color: #60A5FA; font-size: 14px; text-decoration: underline;",
          "color: #9CA3AF; font-size: 14px;",
          "color: #60A5FA; font-size: 14px; text-decoration: underline;"
        );
        return "Awaiting your ping...";
      },
      hack: () => {
        console.log("%cINITIATING SYSTEM OVERRIDE...", "color: #EF4444; font-weight: bold; font-size: 16px;");
        // Programmatically trigger the Matrix easter egg
        setTimeout(() => {
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 't' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
        }, 1000);
        return "Good luck.";
      },
      crash: () => {
        console.log("%cFATAL ERROR INJECTED...", "color: #EF4444; font-weight: bold; font-size: 16px;");
        // Programmatically trigger the BSOD easter egg
        setTimeout(() => {
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
           window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' }));
        }, 500);
        return "System failure imminent.";
      },
      roll: () => {
        console.log("%cDO A BARREL ROLL!", "color: #3B82F6; font-weight: bold; font-size: 16px;");
        if (!document.body.classList.contains("animate-barrel-roll")) {
          document.body.classList.add("animate-barrel-roll");
          setTimeout(() => document.body.classList.remove("animate-barrel-roll"), 2000);
        }
        return "Wheeeee!";
      },
      shake: () => {
        console.log("%cEARTHQUAKE INITIATED!", "color: #F59E0B; font-weight: bold; font-size: 16px;");
        if (!document.body.classList.contains("animate-earthquake")) {
          document.body.classList.add("animate-earthquake");
          setTimeout(() => document.body.classList.remove("animate-earthquake"), 2500);
        }
        return "Hold on tight!";
      },
      help: () => {
        console.log(
          "%cAVAILABLE COMMANDS:\n\n%c- loz.about()\n- loz.skills()\n- loz.contact()\n- loz.roll()     %c[FUN]%c\n- loz.shake()    %c[FUN]%c\n- loz.hack()     %c[DANGER]%c\n- loz.crash()    %c[DANGER]%c\n- loz.help()",
          "color: #8B5CF6; font-weight: bold; font-size: 16px;",
          "color: #A78BFA; font-size: 14px; line-height: 1.5; font-family: monospace;",
          "color: #3B82F6; font-weight: bold;",
          "color: #A78BFA;",
          "color: #F59E0B; font-weight: bold;",
          "color: #A78BFA;",
          "color: #EF4444; font-weight: bold;",
          "color: #A78BFA;",
          "color: #EF4444; font-weight: bold;",
          "color: #A78BFA;"
        );
        return "Try them out!";
      }
    };
    
    // Auto-log help when they just type `window.loz` to inspect it
    console.log(
      "%c💡 Tip: Type %cloz.help()%c to see all available terminal commands.",
      "color: #FCD34D; font-size: 12px;",
      "color: #F59E0B; font-weight: bold; font-family: monospace;",
      "color: #FCD34D; font-size: 12px;"
    );

  }, []);

  return null;
}
