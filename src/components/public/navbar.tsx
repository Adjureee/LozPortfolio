"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#achievements", label: "Achievements" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(href);
    }
  };

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${scrolled ? "bg-paper/80 backdrop-blur-md border-b border-line shadow-sm py-4" : "bg-transparent py-6"}`}>
        <div className="mx-auto flex w-full items-center justify-center px-5 relative md:px-12 min-h-[32px]">
          
          {/* Mobile Hamburger (Left side) */}
          <div className="md:hidden absolute left-5 flex items-center">
            <button 
              className="p-2 -ml-2 text-ink"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-12">
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

          {/* Theme Toggle (Right side) */}
          <div className="absolute right-5 md:right-12 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-paper flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-6 right-5 p-2 text-ink"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-8">
              {links.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="font-display text-4xl uppercase tracking-[0.1em] text-ink hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
