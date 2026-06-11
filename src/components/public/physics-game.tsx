"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { X } from "lucide-react";

const techIcons = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Next.js", slug: "nextdotjs", color: "000000" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "Supabase", slug: "supabase", color: "3ECF8E" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "GSAP", slug: "greensock", color: "88CE02" },
  { name: "Framer", slug: "framer", color: "0055FF" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "HTML5", slug: "html5", color: "E34F26" },
  { name: "CSS3", slug: "css3", color: "1572B6" },
  { name: "Vercel", slug: "vercel", color: "000000" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
];

export function PhysicsGame({ onClose }: { onClose: () => void }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  
  const [blocks, setBlocks] = useState<{ id: number; slug: string; color: string }[]>([]);
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

    // Create blocks (Circles for icons)
    const newBlocks: { id: number; slug: string; color: string }[] = [];
    const newBodies: Matter.Body[] = [];
    
    const radius = window.innerWidth < 768 ? 40 : 50;

    techIcons.forEach((tech, i) => {
      // Spawn from the bottom center for the firework effect
      const body = Bodies.circle(
        width / 2 + (Math.random() - 0.5) * 100,
        height - 50,
        radius,
        {
          restitution: 0.8, // Bouncy
          friction: 0.005,
          density: 0.04,
        }
      );

      // Apply massive upward firework velocity
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 50, // Explosive horizontal spread
        y: -(Math.random() * 25 + 30)  // Explosive vertical launch
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.8); // Add spin

      newBodies.push(body);
      newBlocks.push({ id: body.id, slug: tech.slug, color: tech.color });
    });

    Composite.add(engine.world, newBodies);
    setBlocks(newBlocks);

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
          const x = body.position.x - radius;
          const y = body.position.y - radius;
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
          className="absolute left-0 top-0 flex items-center justify-center pointer-events-none will-change-transform w-20 h-20 md:w-[100px] md:h-[100px]"
        >
          <img 
            src={`https://cdn.simpleicons.org/${block.slug}/${block.color}`} 
            alt="Tech Icon" 
            className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]" 
            draggable={false}
          />
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
