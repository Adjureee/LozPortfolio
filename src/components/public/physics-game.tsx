"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { X } from "lucide-react";

const techStack = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Supabase", 
  "Node.js", "GSAP", "Framer Motion", "JavaScript", "HTML5", "CSS3", "Vercel", "Git", "Figma"
];
const colors = ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"];

export function PhysicsGame({ onClose }: { onClose: () => void }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  
  const [blocks, setBlocks] = useState<{ id: number; label: string; color: string; textColor: string }[]>([]);
  const elementsRef = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Walls
    const wallOptions = { isStatic: true };
    const ground = Bodies.rectangle(width / 2, height + 50, width + 200, 100, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -50, width + 200, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height + 200, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height + 200, wallOptions);

    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Create blocks
    const newBlocks: { id: number; label: string; color: string; textColor: string }[] = [];
    const newBodies: Matter.Body[] = [];

    techStack.forEach((tech, i) => {
      const color = colors[i % colors.length];
      const textColor = (i % colors.length === 1 || i % colors.length === 2 || i % colors.length === 6) ? "#111" : "#fff";
      
      const body = Bodies.rectangle(
        Math.random() * (width - 300) + 150,
        Math.random() * 300 + 50, // Spawn blocks directly inside the screen so they are instantly visible!
        220,
        80,
        {
          restitution: 0.8, // Bouncy
          friction: 0.005,
        }
      );

      newBodies.push(body);
      newBlocks.push({ id: body.id, label: tech, color, textColor });
    });

    Composite.add(engine.world, newBodies);
    setBlocks(newBlocks); // Trigger React render for the divs

    // Mouse interaction mapped to background div
    const mouse = Mouse.create(sceneRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // Sync Loop: Updates DOM elements to match physics bodies
    let reqId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Manually step the engine to guarantee it ticks regardless of Runner modules
      if (delta > 0 && delta < 100) {
        Engine.update(engine, delta);
      } else {
        Engine.update(engine, 1000 / 60);
      }

      newBodies.forEach(body => {
        const el = elementsRef.current[body.id];
        if (el) {
          const x = body.position.x - 110;
          const y = body.position.y - 40;
          const angle = body.angle * (180 / Math.PI); // Convert radians to degrees safely
          // Use translate3d for GPU acceleration
          el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
        }
      });
      reqId = requestAnimationFrame(update);
    };
    
    // Start loop
    reqId = requestAnimationFrame(update);

    const handleResize = () => {
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
      Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-paper/80 backdrop-blur-md">
      <div ref={sceneRef} className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none" />
      
      {blocks.map(block => (
        <div
          key={block.id}
          ref={(el) => { elementsRef.current[block.id] = el; }}
          className="absolute left-0 top-0 flex h-[80px] w-[220px] items-center justify-center border-4 border-ink shadow-lg pointer-events-none will-change-transform"
          style={{
            backgroundColor: block.color,
            color: block.textColor,
          }}
        >
          <span className="font-display text-2xl font-bold tracking-wider">{block.label}</span>
        </div>
      ))}

      <button 
        onClick={onClose}
        className="absolute right-6 top-6 z-50 flex items-center gap-2 border border-line bg-ink px-4 py-3 text-sm font-bold uppercase tracking-widest text-paper transition-transform hover:scale-105 md:right-12 md:top-12"
      >
        <X size={18} />
        Exit Game
      </button>

      <div className="pointer-events-none absolute bottom-12 left-0 right-0 text-center">
        <p className="mb-2 font-display text-5xl uppercase tracking-widest text-ink/20">Physics Playground</p>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Grab the blocks and throw them!</p>
      </div>
    </div>
  );
}
