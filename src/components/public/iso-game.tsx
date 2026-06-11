"use client";

import { useEffect, useRef, useState } from "react";
import { X, Gamepad2, Trophy, Skull } from "lucide-react";

export function IsoGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "victory">("playing");
  const [score, setScore] = useState(0);
  const MAX_SCORE = 5;

  // 0 = empty space, 1 = walkable floor, 2 = solid wall block
  const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 0],
    [0, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 1, 2, 1, 1, 2, 0, 2, 1, 1, 1, 2, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 1, 2, 1, 1, 2, 0, 2, 1, 1, 2, 1, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 1, 2, 1, 1, 2, 0, 2, 1, 2, 1, 1, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 0],
    [0, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  // Ref to hold mutable game engine state without triggering React renders
  const engineRef = useRef({
    px: 2.5, py: 2.5,
    vx: 17.5, vy: 14.5,
    nodes: [] as { x: number, y: number, collected: boolean }[],
    keys: {} as Record<string, boolean>,
    isRunning: true
  });

  const initGame = () => {
    engineRef.current.px = 2.5;
    engineRef.current.py = 2.5;
    engineRef.current.vx = 17.5;
    engineRef.current.vy = 14.5;
    engineRef.current.isRunning = true;
    setGameState("playing");
    setScore(0);

    // Spawn 5 random nodes on floor tiles
    const nodes = [];
    while (nodes.length < MAX_SCORE) {
      const rx = Math.floor(Math.random() * map[0].length);
      const ry = Math.floor(Math.random() * map.length);
      if (map[ry][rx] === 1 && (rx !== 2 || ry !== 2)) { // Must be floor, not player spawn
        nodes.push({ x: rx + 0.5, y: ry + 0.5, collected: false });
      }
    }
    engineRef.current.nodes = nodes;
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const state = engineRef.current;

    const TILE_W = 48;
    const TILE_H = 24;

    const iso = (x: number, y: number, z: number = 0) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 8;
      const sx = (x - y) * (TILE_W / 2) + cx;
      const sy = (x + y) * (TILE_H / 2) - z + cy;
      return { x: sx, y: sy };
    };

    const drawBlock = (x: number, y: number, z: number, top: string, left: string, right: string) => {
      const { x: sx, y: sy } = iso(x, y, z);
      ctx.fillStyle = top; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + TILE_W/2, sy + TILE_H/2); ctx.lineTo(sx, sy + TILE_H); ctx.lineTo(sx - TILE_W/2, sy + TILE_H/2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.stroke();
      ctx.fillStyle = left; ctx.beginPath(); ctx.moveTo(sx - TILE_W/2, sy + TILE_H/2); ctx.lineTo(sx, sy + TILE_H); ctx.lineTo(sx, sy + TILE_H + TILE_H); ctx.lineTo(sx - TILE_W/2, sy + TILE_H/2 + TILE_H); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = right; ctx.beginPath(); ctx.moveTo(sx, sy + TILE_H); ctx.lineTo(sx + TILE_W/2, sy + TILE_H/2); ctx.lineTo(sx + TILE_W/2, sy + TILE_H/2 + TILE_H); ctx.lineTo(sx, sy + TILE_H + TILE_H); ctx.closePath(); ctx.fill(); ctx.stroke();
    };

    interface Entity { x: number; y: number; z: number; type: string; }
    
    const staticEntities: Entity[] = [];
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 1 || map[y][x] === 2) staticEntities.push({ x, y, z: 0, type: "floor" });
        if (map[y][x] === 2) staticEntities.push({ x, y, z: 1, type: "wall" });
      }
    }

    const loop = () => {
      if (!state.isRunning) return;

      // Player Movement
      const speed = 0.08;
      let nx = state.px;
      let ny = state.py;

      if (state.keys["ArrowUp"] || state.keys["w"]) { nx -= speed; ny -= speed; }
      if (state.keys["ArrowDown"] || state.keys["s"]) { nx += speed; ny += speed; }
      if (state.keys["ArrowLeft"] || state.keys["a"]) { nx -= speed; ny += speed; }
      if (state.keys["ArrowRight"] || state.keys["d"]) { nx += speed; ny -= speed; }

      // Player Collision
      const gx = Math.floor(nx);
      const gy = Math.floor(ny);
      if (gy >= 0 && gy < map.length && gx >= 0 && gx < map[0].length && map[gy][gx] === 1) {
        state.px = nx;
        state.py = ny;
      }

      // Enemy Movement (Chases Player slowly)
      const enemySpeed = 0.025;
      const dx = state.px - state.vx;
      const dy = state.py - state.vy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 0) {
        const nvx = state.vx + (dx/dist) * enemySpeed;
        const nvy = state.vy + (dy/dist) * enemySpeed;
        // Basic enemy wall sliding
        if (map[Math.floor(nvy)][Math.floor(nvx)] === 1) {
          state.vx = nvx; state.vy = nvy;
        } else if (map[Math.floor(state.vy)][Math.floor(nvx)] === 1) {
          state.vx = nvx;
        } else if (map[Math.floor(nvy)][Math.floor(state.vx)] === 1) {
          state.vy = nvy;
        }
      }

      // Collect Nodes
      let currentScore = 0;
      state.nodes.forEach(node => {
        if (!node.collected) {
          const d = Math.sqrt(Math.pow(state.px - node.x, 2) + Math.pow(state.py - node.y, 2));
          if (d < 0.5) {
            node.collected = true;
            // Need to update React state safely inside loop
          }
        }
        if (node.collected) currentScore++;
      });

      // Update React Score State if changed
      setScore((prev) => {
        if (prev !== currentScore) {
          if (currentScore >= MAX_SCORE) {
            state.isRunning = false;
            setGameState("victory");
          }
          return currentScore;
        }
        return prev;
      });

      // Enemy Collision (Game Over)
      if (dist < 0.6 && state.isRunning) {
        state.isRunning = false;
        setGameState("gameover");
      }

      // Rendering
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const dynamicEntities: Entity[] = [
        { x: state.px, y: state.py, z: 0.5, type: "player" },
        { x: state.vx, y: state.vy, z: 0.5, type: "enemy" }
      ];

      state.nodes.forEach(n => {
        if (!n.collected) dynamicEntities.push({ x: n.x - 0.5, y: n.y - 0.5, z: 0.2, type: "node" });
      });

      const allEntities = [...staticEntities, ...dynamicEntities].sort((a, b) => {
        const dA = a.x + a.y; const dB = b.x + b.y;
        if (Math.abs(dA - dB) < 0.1) return a.z - b.z;
        return dA - dB;
      });

      allEntities.forEach(ent => {
        if (ent.type === "floor") drawBlock(ent.x, ent.y, 0, "#e2e8f0", "#cbd5e1", "#94a3b8");
        else if (ent.type === "wall") drawBlock(ent.x, ent.y, TILE_H, "#94a3b8", "#64748b", "#475569");
        else if (ent.type === "node") {
          const hover = TILE_H/4 + Math.sin(Date.now()/150)*4;
          drawBlock(ent.x, ent.y, hover, "#4ade80", "#22c55e", "#16a34a");
        }
        else if (ent.type === "player") {
          const hover = TILE_H/2 + Math.sin(Date.now()/200)*4;
          drawBlock(ent.x, ent.y, hover, "#ef4444", "#dc2626", "#b91c1c");
        }
        else if (ent.type === "enemy") {
          const hover = TILE_H/2 + Math.cos(Date.now()/200)*4;
          drawBlock(ent.x, ent.y, hover, "#a855f7", "#9333ea", "#7e22ce");
        }
      });

      if (state.isRunning) {
        animationId = requestAnimationFrame(loop);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => { state.keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { state.keys[e.key] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gameState]); // Re-run effect if game state resets

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8">
      <div className="relative flex h-full max-h-[800px] w-full max-w-[1000px] flex-col overflow-hidden border border-line bg-paper shadow-2xl rounded-xl">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-line bg-paper/50 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-ink">
            <Gamepad2 size={18} />
            <span className="font-display text-sm font-bold tracking-widest">DATA HEIST</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm font-bold text-accent">NODES: {score}/{MAX_SCORE}</span>
            <button onClick={onClose} className="text-muted hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Render Canvas */}
        <div className="flex-1 w-full h-full bg-[#1e293b]">
          <canvas 
            ref={canvasRef} 
            className={`h-full w-full block outline-none ${gameState === "playing" ? "cursor-crosshair" : "cursor-default"}`}
          />
        </div>

        {/* HUD Overlay */}
        <div className="absolute bottom-6 left-6 pointer-events-none">
          <div className="bg-ink/80 backdrop-blur-sm border border-line px-4 py-3 rounded text-xs font-mono text-paper shadow-2xl flex flex-col gap-1">
            <span className="font-bold text-accent mb-1">OBJECTIVE</span>
            <span>Collect all 5 Green Nodes.</span>
            <span>Avoid the Purple Virus.</span>
            <span className="mt-2 text-muted">W A S D - Move Player</span>
          </div>
        </div>

        {/* Game Over Modal */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-ink text-paper p-8 rounded-xl border border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)] flex flex-col items-center max-w-sm text-center">
              <Skull size={48} className="text-red-500 mb-4" />
              <h2 className="font-display text-3xl font-bold mb-2">SYSTEM FAILURE</h2>
              <p className="text-muted mb-6">The virus caught you. Your session was terminated.</p>
              <button 
                onClick={initGame}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors w-full"
              >
                REBOOT SYSTEM
              </button>
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {gameState === "victory" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-ink text-paper p-8 rounded-xl border border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)] flex flex-col items-center max-w-sm text-center">
              <Trophy size={48} className="text-green-500 mb-4" />
              <h2 className="font-display text-3xl font-bold mb-2">HEIST COMPLETE</h2>
              <p className="text-muted mb-6">You successfully extracted all data nodes without being detected.</p>
              <button 
                onClick={initGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors w-full"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
