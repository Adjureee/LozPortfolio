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
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : (realIp || "127.0.0.1");

    // Attempt to get location from Vercel headers first (fastest)
    let city = headersList.get("x-vercel-ip-city");
    let country = headersList.get("x-vercel-ip-country");
    const latStr = headersList.get("x-vercel-ip-latitude");
    const lonStr = headersList.get("x-vercel-ip-longitude");
    
    let latitude: number | null = latStr ? parseFloat(latStr) : null;
    let longitude: number | null = lonStr ? parseFloat(lonStr) : null;
    const userAgent = headersList.get("user-agent") || "Unknown";

    // If no Vercel headers, we do an IP lookup API (only if it's a real IP)
    if (!city && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,lat,lon`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          city = data.city || "Unknown";
          country = data.country || "Unknown";
          latitude = data.lat || null;
          longitude = data.lon || null;
        }
      } catch (e) {
        console.error("IP lookup failed", e);
      }
    }

    // Default fallbacks for local dev (Sets pin to Manila for testing)
    if (!city && (ip === "127.0.0.1" || ip === "::1")) {
      city = "Local City";
      country = "Local Country";
      latitude = 14.5995;
      longitude = 120.9842;
    }

    const supabase = await createClient();

    // Prevent duplicate logging in a short timeframe by checking recent visits?
    // For simplicity, we just insert it.
    await supabase.from("visitors").insert([
      {
        ip_address: ip,
        city,
        country,
        latitude,
        longitude,
        user_agent: userAgent
      }
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to record visitor", error);
    return { success: false };
  }
}
