"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function recordVisitor() {
  try {
    const headersList = await headers();
    
    // Attempt to get IP from standard headers (Vercel, Cloudflare, etc)
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    // In local dev, this might be ::1
    let ip = forwardedFor ? forwardedFor.split(",")[0].trim() : (realIp || "127.0.0.1");

    // Attempt to get location from Vercel headers first (fastest)
    let city = headersList.get("x-vercel-ip-city");
    let country = headersList.get("x-vercel-ip-country");
    const userAgent = headersList.get("user-agent") || "Unknown";

    // If no Vercel headers, we do an IP lookup API (only if it's a real IP)
    if (!city && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,country`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          city = data.city || "Unknown";
          country = data.country || "Unknown";
        }
      } catch (e) {
        console.error("IP lookup failed", e);
      }
    }

    // Default fallbacks for local dev
    if (!city) city = "Local City";
    if (!country) country = "Local Country";

    const supabase = await createClient();

    // Prevent duplicate logging in a short timeframe by checking recent visits?
    // For simplicity, we just insert it.
    await supabase.from("visitors").insert([
      {
        ip_address: ip,
        city,
        country,
        user_agent: userAgent
      }
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to record visitor", error);
    return { success: false };
  }
}
