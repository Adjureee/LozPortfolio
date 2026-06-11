"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, FolderKanban, BriefcaseBusiness, Trophy, LogOut, Activity } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/dashboard/analytics", icon: Activity },
  { name: "Site Config", href: "/dashboard/config", icon: Settings },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Experiences", href: "/dashboard/experiences", icon: BriefcaseBusiness },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-paper/50 border-r border-line/50 min-h-full flex flex-col p-6">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-muted mb-2">Hidden</p>
        <h1 className="font-display text-2xl">CMS</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium ${
                isActive 
                  ? "bg-accent/10 text-accent border border-accent/20" 
                  : "text-muted hover:text-ink hover:bg-ink/5 border border-transparent"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-10 pt-6 border-t border-line/50">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted hover:text-ink transition-colors"
        >
          <LogOut size={18} className="rotate-180" />
          Back to Live Site
        </Link>
      </div>
    </aside>
  );
}
