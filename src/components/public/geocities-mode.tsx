"use client";

import { useEffect, useState } from "react";

export function GeocitiesMode({ onClose }: { onClose: () => void }) {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Generate a massive fake visitor count
    setVisitorCount(Math.floor(Math.random() * 9000000) + 1000000);
    
    // Attempt to make cursor custom for the whole document while this is active
    document.body.style.cursor = "url('https://web.archive.org/web/20091026002737im_/http://geocities.com/Heartland/Woods/4493/dinosaur_cursor.gif'), auto";
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-auto select-none"
      style={{
        backgroundColor: "black",
        backgroundImage: "url('https://web.archive.org/web/20091027005115im_/http://geocities.com/Area51/Lair/9716/starbg.gif')",
        color: "#00FF00",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <div className="min-h-screen flex flex-col items-center p-4 md:p-8 text-center space-y-8">
        
        {/* Header Marquee using pure CSS to avoid React warnings */}
        <div className="w-full bg-blue-900 border-[6px] border-gray-400 p-2 overflow-hidden whitespace-nowrap">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
          <div 
            style={{ animation: "marquee 8s linear infinite", display: "inline-block" }}
            className="text-3xl md:text-5xl font-bold text-yellow-400 tracking-widest drop-shadow-md"
          >
            WELCOME TO MY HOMEPAGE!!! BEST VIEWED IN NETSCAPE NAVIGATOR 4.0!!!
          </div>
        </div>

        {/* Title & Flames */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://web.archive.org/web/20090831102958im_/http://geocities.com/Heartland/Valley/2610/flames.gif" alt="flames" className="w-16 md:w-auto" />
          <h1 className="text-5xl md:text-7xl text-red-500 font-extrabold uppercase tracking-widest" style={{ textShadow: "4px 4px 0px yellow" }}>
            Loz&apos;s Cyber Space
          </h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://web.archive.org/web/20090831102958im_/http://geocities.com/Heartland/Valley/2610/flames.gif" alt="flames" className="w-16 md:w-auto" />
        </div>

        {/* Dancing Baby */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://web.archive.org/web/20091024040905im_/http://geocities.com/SunsetStrip/Arena/8086/baby.gif" alt="Dancing baby" className="h-40 md:h-64 object-contain" />

        {/* Content Box */}
        <div className="bg-[#000080] border-[6px] border-t-white border-l-white border-b-gray-600 border-r-gray-600 p-6 md:p-10 max-w-2xl text-xl text-white font-bold leading-relaxed shadow-2xl">
          <p>Hello Surfer!</p>
          <p>You have found my secret web ring. This page is currently...</p>
          
          <div className="my-8 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://web.archive.org/web/20091023030310im_/http://geocities.com/Tokyo/4255/under_construction.gif" alt="Under construction" />
          </div>

          <p className="text-[#00FFFF] underline decoration-wavy">Please sign my Guestbook!!!</p>
        </div>

        {/* Visitor Counter */}
        <div className="flex flex-col items-center">
          <p className="text-lg text-yellow-300 font-bold mb-2">You are visitor number:</p>
          <div className="flex font-mono text-4xl border-4 border-gray-500 bg-black text-red-500 p-2 tracking-[0.3em]">
            {visitorCount.toString().padStart(8, '0')}
          </div>
        </div>

        {/* Web rings */}
        <div className="flex gap-8 items-center mt-12 bg-gray-800 border-2 border-gray-400 p-4 font-bold text-sm">
          <button className="text-blue-400 underline hover:text-blue-300">{'<< Previous Site'}</button>
          <span className="text-white">The HTML Web Ring</span>
          <button className="text-blue-400 underline hover:text-blue-300">{'Next Site >>'}</button>
        </div>

        {/* Exit Button */}
        <button 
          onClick={onClose}
          className="mt-16 bg-[#C0C0C0] text-black border-[4px] border-t-white border-l-white border-b-gray-800 border-r-gray-800 px-10 py-3 font-bold font-sans text-xl active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
        >
          X Close Netscape Navigator
        </button>

      </div>
    </div>
  );
}
