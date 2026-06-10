"use client";

import { useState, useRef, useEffect } from "react";
import { X, Terminal as TerminalIcon } from "lucide-react";

interface HackerTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchZork: () => void;
  onLaunchIso: () => void;
}

export function HackerTerminal({ isOpen, onClose, onLaunchZork, onLaunchIso }: HackerTerminalProps) {
  const [history, setHistory] = useState<{ type: "input" | "output", text: string }[]>([
    { type: "output", text: "Portfolio OS [Version 1.0.0]" },
    { type: "output", text: "(c) Loz. All rights reserved." },
    { type: "output", text: " " },
    { type: "output", text: "Type 'help' to see available commands." }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isOpen]);

  const print = (text: string) => {
    setHistory(prev => [...prev, { type: "output", text }]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const lowerCmd = cmd.toLowerCase();
    
    setHistory(prev => [...prev, { type: "input", text: `C:\\Users\\Guest> ${cmd}` }]);
    setInput("");

    const tokens = lowerCmd.split(" ");
    const action = tokens[0];

    switch (action) {
      case "help":
        print("Available commands:");
        print("  whoami       - Display current user information");
        print("  ls / dir     - List directory contents");
        print("  cat [file]   - Read a file's contents");
        print("  clear / cls  - Clear the terminal screen");
        print("  play zork    - Launch the hidden text adventure");
        print("  play iso     - Launch the 2.5D isometric engine");
        print("  exit         - Close the terminal");
        break;

      case "whoami":
        print("guest");
        print("Access Level: Restricted.");
        print("Hint: You are viewing the portfolio of an amazing developer.");
        break;

      case "ls":
      case "dir":
        print("Directory of C:\\Users\\Guest");
        print(" ");
        print("10/06/2026  10:00 PM    <DIR>          projects");
        print("10/06/2026  10:00 PM    <DIR>          contact");
        print("10/06/2026  10:05 PM                42 about.txt");
        print("10/06/2026  10:15 PM               104 secrets.txt");
        print("               2 File(s)            146 bytes");
        break;

      case "cat":
      case "type":
        if (tokens[1] === "about.txt") {
          print("I'm a passionate developer who loves building interactive web experiences!");
        } else if (tokens[1] === "secrets.txt") {
          print("ERROR: Access Denied. You do not have permission to read this file.");
        } else if (!tokens[1]) {
          print("cat: missing operand");
        } else {
          print(`cat: ${tokens[1]}: No such file or directory`);
        }
        break;

      case "sudo":
        print("Nice try. This incident will be reported.");
        break;

      case "play":
        if (tokens[1] === "zork") {
          print("Initializing Zork Engine...");
          setTimeout(() => {
            onLaunchZork();
          }, 500);
        } else if (tokens[1] === "iso") {
          print("Initializing 2.5D Rendering Engine...");
          setTimeout(() => {
            onLaunchIso();
          }, 500);
        } else {
          print("play: unknown game. Try 'play zork' or 'play iso'");
        }
        break;

      case "clear":
      case "cls":
        setHistory([]);
        break;

      case "exit":
        onClose();
        break;

      default:
        print(`'${action}' is not recognized as an internal or external command, operable program or batch file.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] flex h-[50vh] min-h-[300px] flex-col border-b-2 border-green-500/50 bg-ink/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out animate-in slide-in-from-top">
      {/* Header */}
      <div className="flex items-center justify-between bg-green-900/20 px-4 py-2 border-b border-green-500/30">
        <div className="flex items-center gap-2 text-green-500">
          <TerminalIcon size={16} />
          <span className="font-mono text-xs font-bold tracking-widest">HACKER TERMINAL</span>
        </div>
        <button onClick={onClose} className="text-green-500/50 hover:text-green-400">
          <X size={16} />
        </button>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-green-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-900/50">
        {history.map((line, i) => (
          <div key={i} className="mb-1 leading-relaxed whitespace-pre-wrap">
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 bg-black/20 p-4 font-mono text-sm">
        <span className="font-bold text-green-500">C:\Users\Guest{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-green-400 outline-none placeholder:text-green-900/50"
          spellCheck="false"
          autoComplete="off"
        />
      </form>
    </div>
  );
}
