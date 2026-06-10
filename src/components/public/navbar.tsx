"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#achievements", label: "Achievements" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(href);
    }
  };

  return (
    <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${scrolled ? "bg-paper/80 backdrop-blur-md border-b border-line shadow-sm py-4" : "bg-transparent py-6"}`}>
      <div className="mx-auto flex w-full items-center justify-center px-5 relative md:px-12">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
          {links.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-xs md:text-sm font-medium uppercase tracking-[0.18em] text-muted transition hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="absolute right-5 md:right-12 flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
