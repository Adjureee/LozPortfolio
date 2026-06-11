import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { isCurrentUserAdmin, getMessages } from "@/lib/data";
import { Sidebar } from "@/components/dashboard/sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  if (!(await isCurrentUserAdmin())) redirect("/admin-login");
  
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex min-h-screen bg-paper text-ink flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 px-5 py-8 md:px-10">
        <header className="mb-10 flex flex-wrap items-center justify-end gap-6 border-b border-line pb-6">
          <a href="/dashboard" className="relative group cursor-pointer" title="Inbox">
            <Mail className="text-ink group-hover:text-accent transition-colors" size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center border-2 border-paper">
                {unreadCount}
              </span>
            )}
          </a>
          <form action={signOutAction}>
            <button className="border border-line px-4 py-3 text-sm uppercase tracking-[0.18em] hover:bg-ink hover:text-paper transition-colors">Sign out</button>
          </form>
        </header>

        <div className="max-w-5xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
