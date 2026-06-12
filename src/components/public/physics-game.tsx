"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { X, RefreshCw } from "lucide-react";

const BIRD_ICON = { name: "React", slug: "react", color: "61DAFB" };
const TARGET_ICONS = [
  { name: "Next.js", slug: "nextdotjs", color: "000000" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "Supabase", slug: "supabase", color: "3ECF8E" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "Vercel", slug: "vercel", color: "000000" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
  { name: "Git", slug: "git", color: "F05032" },
];

export function PhysicsGame({ onClose }: { onClose: () => void }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  
  const [blocks, setBlocks] = useState<{ id: number; slug: string; color: string; isBird: boolean; width: number; height: number }[]>([]);
  const elementsRef = useRef<Record<number, HTMLDivElement | null>>({});
  
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  const [bandPos, setBandPos] = useState({ bx: 0, by: 0, active: false });
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint,
      Events = Matter.Events,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Walls
    const wallOptions = { isStatic: true, friction: 0.8, render: { visible: false } };
    const groundHeight = 100;
    const ground = Bodies.rectangle(width / 2, height - groundHeight / 2 + 50, width + 200, groundHeight, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -500, width + 200, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height + 1000, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height + 1000, wallOptions);

    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Create Slingshot Anchor
    const isMobile = window.innerWidth < 768;
    const anchorX = isMobile ? 80 : 200;
    const anchorY = height - 250;
    setAnchorPos({ x: anchorX, y: anchorY });

    const birdRadius = isMobile ? 25 : 35;
    
    // Create Bird
    const bird = Bodies.circle(anchorX, anchorY, birdRadius, {
      restitution: 0.4,
      density: 0.08, // heavier to smash blocks
      friction: 0.5,
    });

    // Elastic Slingshot constraint
    let slingshot: Matter.Constraint | null = Constraint.create({
      pointA: { x: anchorX, y: anchorY },
      bodyB: bird,
      stiffness: 0.05,
      length: 0,
      render: { visible: false }
    });

    // Build Target Pyramid
    const newBlocks: { id: number; slug: string; color: string; isBird: boolean; width: number; height: number }[] = [];
    const newBodies: Matter.Body[] = [];
    
    // Add Bird to blocks
    newBlocks.push({ id: bird.id, slug: BIRD_ICON.slug, color: BIRD_ICON.color, isBird: true, width: birdRadius * 2, height: birdRadius * 2 });
    newBodies.push(bird);

    // Build pyramid
    const boxSize = isMobile ? 40 : 60;
    const columns = isMobile ? 4 : 5;
    const startX = isMobile ? width - (columns * boxSize) - 20 : width - (columns * boxSize) - 150;
    const startY = height - groundHeight + 50;

    let targetIndex = 0;

    for (let row = 0; row < columns; row++) {
      for (let col = 0; col < columns - row; col++) {
        const x = startX + col * boxSize + (row * boxSize) / 2;
        const y = startY - row * boxSize - boxSize / 2;
        
        const body = Bodies.rectangle(x, y, boxSize, boxSize, {
          restitution: 0.1,
          friction: 0.8,
          density: 0.02
        });
        
        const tech = TARGET_ICONS[targetIndex % TARGET_ICONS.length];
        targetIndex++;

        newBodies.push(body);
        newBlocks.push({ id: body.id, slug: tech.slug, color: tech.color, isBird: false, width: boxSize, height: boxSize });
      }
    }

    Composite.add(engine.world, [bird, slingshot, ...newBodies.filter(b => b !== bird)]);
    setBlocks(newBlocks);

    // Mouse constraint for dragging
    const mouse = Mouse.create(sceneRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // Slingshot firing logic
    let isFiring = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Events.on(mouseConstraint, 'startdrag', (e: any) => {
      if (e.body === bird) {
        isFiring = true;
      }
    });

    Events.on(engine, 'afterUpdate', () => {
      // Slingshot release logic: If dragging stopped and bird passed the anchor
      if (isFiring && !mouseConstraint.body && bird.position.x > anchorX + 20) {
        if (slingshot) {
          Composite.remove(engine.world, slingshot);
          slingshot = null;
          isFiring = false;
        }
      }
      
      // Update slingshot band UI
      if (slingshot) {
        setBandPos({
          bx: bird.position.x,
          by: bird.position.y,
          active: true
        });
      } else {
        setBandPos(prev => prev.active ? { ...prev, active: false } : prev);
      }
    });

    // Sync Loop: Updates DOM elements to match physics bodies
    let reqId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      if (delta > 0 && delta < 100) {
        Engine.update(engine, delta);
      } else {
        Engine.update(engine, 1000 / 60);
      }

      newBodies.forEach(body => {
        const el = elementsRef.current[body.id];
        if (el) {
          const block = newBlocks.find(b => b.id === body.id);
          if (block) {
            const x = body.position.x - block.width / 2;
            const y = body.position.y - block.height / 2;
            const angle = body.angle * (180 / Math.PI);
            el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
          }
        }
      });
      reqId = requestAnimationFrame(update);
    };
    
    reqId = requestAnimationFrame(update);

    const handleResize = () => {
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight - groundHeight / 2 + 50 });
      Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      Engine.clear(engine);
    };
  }, [resetCounter]);

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden bg-paper/90 backdrop-blur-md font-sans select-none touch-none">
      <div ref={sceneRef} className="absolute inset-0 cursor-crosshair touch-none" />
      
      {/* Visual Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[50px] bg-ink/5 border-t border-line z-0 pointer-events-none" />

      {/* Slingshot Visuals */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {bandPos.active && anchorPos.x > 0 && (
          <>
            <line x1={anchorPos.x - 10} y1={anchorPos.y} x2={bandPos.bx} y2={bandPos.by} stroke="#3e2723" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
            <line x1={anchorPos.x + 10} y1={anchorPos.y} x2={bandPos.bx} y2={bandPos.by} stroke="#5d4037" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
          </>
        )}
        {/* Slingshot stand */}
        {anchorPos.x > 0 && (
          <path 
            d={`M${anchorPos.x} ${anchorPos.y} L${anchorPos.x} ${anchorPos.y + 250} M${anchorPos.x - 20} ${anchorPos.y - 15} L${anchorPos.x} ${anchorPos.y + 15} L${anchorPos.x + 20} ${anchorPos.y - 15}`} 
            stroke="#5d4037" 
            strokeWidth="16" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </svg>

      {/* Physics Objects */}
      {blocks.map(block => (
        <div
          key={block.id}
          ref={(el) => { elementsRef.current[block.id] = el; }}
          className={`absolute left-0 top-0 flex items-center justify-center pointer-events-none will-change-transform z-20
            ${block.isBird ? 'rounded-full border-4 border-accent bg-paper shadow-[0_0_25px_rgba(255,0,0,0.6)]' : 'rounded-md shadow-[0_4px_10px_rgba(0,0,0,0.15)] bg-white border border-line/30'}`}
          style={{ width: block.width, height: block.height }}
        >
          <img 
            src={`https://cdn.simpleicons.org/${block.slug}/${block.color}`} 
            alt="Tech Icon" 
            className={`w-[70%] h-[70%] object-contain ${block.isBird ? 'drop-shadow-lg' : ''}`} 
            draggable={false}
          />
        </div>
      ))}

      {/* UI Controls */}
      <div className="absolute left-6 top-6 md:left-12 md:top-12 z-50 flex gap-4">
        <button 
          onClick={() => setResetCounter(c => c + 1)}
          className="flex items-center gap-2 border border-line bg-ink px-4 py-3 text-sm font-bold uppercase tracking-widest text-paper transition-transform hover:scale-105 shadow-xl"
        >
          <RefreshCw size={18} />
          Reload
        </button>
      </div>

      <button 
        onClick={onClose}
        className="absolute right-6 top-6 z-50 flex items-center gap-2 border border-line bg-ink px-4 py-3 text-sm font-bold uppercase tracking-widest text-paper transition-transform hover:scale-105 shadow-xl md:right-12 md:top-12"
      >
        <X size={18} />
        Exit Game
      </button>

      {/* Titles */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 text-center z-0">
        <p className="mb-2 font-display text-4xl md:text-6xl uppercase tracking-widest text-ink/10 select-none">Angry Tech</p>
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-accent/80 select-none">Pull React back to destroy the stack!</p>
      </div>
    </div>
  );
}
