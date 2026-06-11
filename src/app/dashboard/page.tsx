import { getMessages, getPortfolioData } from "@/lib/data";
import { InboxPanel } from "@/components/dashboard/inbox";
import { Panel } from "@/components/dashboard/ui";

export default async function DashboardOverviewPage() {
  const messages = await getMessages();
  const data = await getPortfolioData();

  const totalProjects = data.projects.length;
  const totalExperiences = data.experiences.length;
  const totalAchievements = data.achievements.length;
  const unreadMessages = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={totalProjects} />
        <StatCard title="Experiences" value={totalExperiences} />
        <StatCard title="Achievements" value={totalAchievements} />
        <StatCard title="Unread Messages" value={unreadMessages} highlight={unreadMessages > 0} />
      </div>

      <Panel title="Message Inbox">
        <InboxPanel messages={messages} />
      </Panel>
    </div>
  );
}

function StatCard({ title, value, highlight }: { title: string; value: number; highlight?: boolean }) {
  return (
    <div className={`p-5 border border-line bg-paper/50 ${highlight ? 'border-accent/50 bg-accent/5' : ''}`}>
      <p className="text-xs uppercase tracking-widest text-muted">{title}</p>
      <p className={`text-3xl font-display mt-2 ${highlight ? 'text-accent' : 'text-ink'}`}>{value}</p>
    </div>
  );
}
