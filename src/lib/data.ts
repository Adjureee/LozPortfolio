import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PortfolioData } from "@/lib/types";

export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = await createClient();

  const [config, projects, experiences, achievements, contacts] = await Promise.all([
    supabase.from("site_config").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("experiences").select("*").order("created_at", { ascending: false }),
    supabase.from("achievements").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle()
  ]);

  return {
    config: config.data ?? null,
    projects: projects.data ?? [],
    experiences: experiences.data ?? [],
    achievements: achievements.data ?? [],
    contacts: contacts.data ?? null
  };
}

export async function isCurrentUserAdmin() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  return Boolean(data);
}

export async function getMessages(): Promise<import("@/lib/types").ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
