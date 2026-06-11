import { createClient } from "@/lib/supabase/server";
import type { Visitor } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  
  // Fetch visitors, newest first
  const { data: visitors, error } = await supabase
    .from("visitors")
    .select("*")
    .order("visited_at", { ascending: false });

  if (error) {
    console.error("Error fetching visitors:", error);
  }

  const visitorList = (visitors as Visitor[]) || [];

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-display font-bold">Visitor Analytics</h2>
        <p className="text-muted mt-2">Monitor traffic and visitor locations.</p>
      </div>

      <div className="bg-ink/5 border border-line rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-ink/10 border-b border-line text-muted uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">IP Address</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">User Agent</th>
                <th className="px-6 py-4 font-semibold">Time of Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50">
              {visitorList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    No visitor data available yet.
                  </td>
                </tr>
              ) : (
                visitorList.map((v) => {
                  const date = new Date(v.visited_at);
                  const formattedDate = date.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <tr key={v.id} className="hover:bg-ink/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-accent">
                        {v.ip_address}
                      </td>
                      <td className="px-6 py-4">
                        {v.city && v.country ? `${v.city}, ${v.country}` : "Unknown Location"}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs" title={v.user_agent || ""}>
                        {v.user_agent || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
