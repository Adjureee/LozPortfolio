"use client";

import { useState, useRef, useEffect } from "react";
import { X, Terminal as TerminalIcon } from "lucide-react";
import { GameState, INITIAL_STATE, ROOMS, ITEMS, RoomId } from "@/lib/game-data";

export function ZorkEngine({ onClose }: { onClose: () => void }) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [history, setHistory] = useState<{ type: "input" | "output", text: string }[]>([
    { type: "output", text: "Welcome to THE DEVELOPER'S JOURNEY (Part 1)." },
    { type: "output", text: "Type 'help' for a list of commands." },
    { type: "output", text: "------------------------------------------------" },
    { type: "output", text: ROOMS[INITIAL_STATE.currentRoom].name.toUpperCase() },
    { type: "output", text: ROOMS[INITIAL_STATE.currentRoom].description(INITIAL_STATE) },
    { type: "output", text: "Items here: " + INITIAL_STATE.roomItems[INITIAL_STATE.currentRoom].map(id => ITEMS[id].name).join(", ") }
  ]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const room = ROOMS[gameState.currentRoom];

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    // Auto-focus input when opening
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const print = (text: string) => {
    setHistory(prev => [...prev, { type: "output", text }]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setHistory(prev => [...prev, { type: "input", text: "> " + input }]);
    setInput("");

    const tokens = cmd.split(" ");
    const action = tokens[0];
    const target = tokens.slice(1).join(" ");

    let newState = { ...gameState };

    switch (action) {
      case "help":
        print("COMMANDS:");
        print("- look: Look around the room");
        print("- go [north/south/east/west]: Move to a different room");
        print("- take [item]: Pick up an item");
        print("- drop [item]: Drop an item");
        print("- inventory / i: Check your inventory");
        print("- inspect [object]: Look closely at something");
        print("- use [item]: Use an item from your inventory");
        break;

      case "look":
        print(room.name.toUpperCase());
        print(room.description(newState));
        const itemsHere = newState.roomItems[room.id];
        if (itemsHere.length > 0) {
          print("You see: " + itemsHere.map(id => ITEMS[id].name).join(", "));
        }
        break;

      case "go":
      case "move":
      case "walk":
        if (!target) {
          print("Go where? (e.g., 'go north')");
          break;
        }
        const dir = target as keyof typeof room.exits;
        const nextRoomId = room.exits[dir];

        if (!nextRoomId) {
          print("You can't go that way.");
        } else if (nextRoomId === "locked") {
          // Special lock logic for Breakroom -> Server Room
          if (dir === "north" && room.id === "breakroom") {
            if (newState.inventory.includes("badge")) {
              print("You swipe the ID Badge. The heavy security door unlatches!");
              newState.currentRoom = "server_room";
              const nextRoom = ROOMS["server_room"];
              print("------------------------------------------------");
              print(nextRoom.name.toUpperCase());
              print(nextRoom.description(newState));
            } else {
              print("The door is locked. You need an ID Badge to enter the server room. Maybe someone left one around here.");
            }
          } 
          // Lock logic for Senior Desk -> CTO Office
          else if (dir === "west" && room.id === "senior_desk") {
            if (newState.inventory.includes("brass_key")) {
              print("You unlock the door with the Brass Key!");
              newState.currentRoom = "cto_office";
              const nextRoom = ROOMS["cto_office"];
              print("------------------------------------------------");
              print(nextRoom.name.toUpperCase());
              print(nextRoom.description(newState));
            } else {
              print("The CTO's office is locked. You need a key.");
            }
          }
          // Lock logic for Server Room -> Network Closet
          else if (dir === "east" && room.id === "server_room") {
            if (newState.flags.networkUnlocked) {
              print("You open the unlocked Network Closet door!");
              newState.currentRoom = "network_closet";
              const nextRoom = ROOMS["network_closet"];
              print("------------------------------------------------");
              print(nextRoom.name.toUpperCase());
              print(nextRoom.description(newState));
            } else {
              print("The Network Closet is locked by a keypad. Try inspecting the keypad.");
            }
          }
          else {
            print("The way is locked.");
          }
        } else {
          newState.currentRoom = nextRoomId;
          const nextRoom = ROOMS[nextRoomId];
          print("------------------------------------------------");
          print(nextRoom.name.toUpperCase());
          print(nextRoom.description(newState));
          const itemsHere = newState.roomItems[nextRoom.id];
          if (itemsHere.length > 0) {
            print("You see: " + itemsHere.map(id => ITEMS[id].name).join(", "));
          }
        }
        break;

      case "take":
      case "get":
      case "grab":
        if (!target) {
          print("Take what?");
          break;
        }
        const roomItemIds = newState.roomItems[room.id];
        const itemToTake = roomItemIds.find(id => ITEMS[id].name.toLowerCase() === target || id === target);
        
        if (itemToTake) {
          newState.roomItems[room.id] = roomItemIds.filter(id => id !== itemToTake);
          newState.inventory.push(itemToTake);
          print(`Taken: ${ITEMS[itemToTake].name}.`);
        } else {
          print("You don't see that here.");
        }
        break;

      case "drop":
        if (!target) {
          print("Drop what?");
          break;
        }
        const itemToDrop = newState.inventory.find(id => ITEMS[id].name.toLowerCase() === target || id === target);
        if (itemToDrop) {
          newState.inventory = newState.inventory.filter(id => id !== itemToDrop);
          newState.roomItems[room.id].push(itemToDrop);
          print(`Dropped: ${ITEMS[itemToDrop].name}.`);
        } else {
          print("You don't have that.");
        }
        break;

      case "i":
      case "inv":
      case "inventory":
        if (newState.inventory.length === 0) {
          print("You are empty-handed.");
        } else {
          print("You are carrying: " + newState.inventory.map(id => ITEMS[id].name).join(", "));
        }
        break;

      case "inspect":
      case "examine":
      case "x":
        if (!target) {
          print("Inspect what?");
          break;
        }
        
        // Check items in room
        const roomItem = newState.roomItems[room.id].find(id => ITEMS[id].name.toLowerCase() === target || id === target);
        if (roomItem) {
          print(ITEMS[roomItem].description);
          break;
        }

        // Check inventory
        const invItem = newState.inventory.find(id => ITEMS[id].name.toLowerCase() === target || id === target);
        if (invItem) {
          print(ITEMS[invItem].description);
          break;
        }

        // Check interactables
        let found = false;
        for (const [key, value] of Object.entries(room.interactables)) {
          if (target.includes(key)) {
            if (typeof value === "string") {
              print(value);
            } else {
              const res = value(newState);
              print(res.message);
              if (res.newState) newState = res.newState;
            }
            found = true;
            break;
          }
        }

        if (!found) {
          print("You see nothing special about that.");
        }
        break;

      case "use":
        if (!target) {
          print("Use what?");
          break;
        }
        const itemToUse = newState.inventory.find(id => ITEMS[id].name.toLowerCase() === target || id === target);
        if (itemToUse) {
          const itemDef = ITEMS[itemToUse];
          if (itemDef.onUse) {
            const res = itemDef.onUse(newState);
            print(res.message);
            newState = res.newState;
          } else {
            print(`You can't use the ${itemDef.name} right now.`);
          }
        } else {
          print("You don't have that.");
        }
        break;

      default:
        print(`I don't know the word '${action}'.`);
    }

    setGameState(newState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8">
      <div className="flex h-full max-h-[800px] w-full max-w-[1000px] flex-col overflow-hidden border border-green-900 bg-black text-green-500 shadow-[0_0_50px_rgba(0,255,0,0.1)] font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-green-900 bg-green-950/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <TerminalIcon size={18} />
            <span className="text-sm font-bold tracking-widest text-green-500">ZORK TERMINAL</span>
          </div>
          <button onClick={onClose} className="text-green-700 hover:text-green-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Scanlines overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-10 z-10" />
            
          {/* Terminal Console */}
          <div className="flex flex-1 flex-col overflow-hidden bg-black p-6 md:p-8 z-20">
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-900">
              {history.map((line, i) => (
                <div key={i} className={`mb-3 text-sm md:text-base leading-relaxed ${line.type === "input" ? "text-green-300 font-bold" : "text-green-500"}`}>
                  {line.text}
                </div>
              ))}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleCommand} className="mt-4 flex items-center gap-3 border-t border-green-900/50 pt-6">
              <span className="font-bold text-green-500 text-lg">{">"}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent font-mono text-base md:text-lg text-green-400 outline-none placeholder:text-green-900/50"
                placeholder="What do you want to do?"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
