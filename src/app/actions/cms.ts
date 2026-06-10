"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { isCurrentUserAdmin } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AcademicYear } from "@/lib/types";
import { splitList } from "@/lib/utils";

async function assertAdmin() {
  if (!(await isCurrentUserAdmin())) {
    redirect("/admin-login");
  }
}

function cleanString(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function saveSiteConfig(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();
  const id = String(formData.get("id") || randomUUID());

  const avatarFile = formData.get("avatar");
  let avatarUrl = cleanString(formData.get("existing_avatar_url"));
  if (avatarFile instanceof File && avatarFile.size > 0) {
    avatarUrl = await uploadToCloudinary(avatarFile);
  }

  const hoverAvatarFile = formData.get("hover_avatar");
  let hoverAvatarUrl = cleanString(formData.get("existing_hover_avatar_url"));
  if (hoverAvatarFile instanceof File && hoverAvatarFile.size > 0) {
    hoverAvatarUrl = await uploadToCloudinary(hoverAvatarFile);
  }

  await supabase.from("site_config").upsert({
    id,
    display_name: cleanString(formData.get("display_name")),
    title: cleanString(formData.get("title")),
    hero_kicker: cleanString(formData.get("hero_kicker")),
    avatar_url: avatarUrl,
    hover_avatar_url: hoverAvatarUrl,
    about_me: cleanString(formData.get("about_me"))
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function saveProject(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();
  const id = String(formData.get("id") || randomUUID());
  
  const imageFile = formData.get("image");
  let imageUrl = cleanString(formData.get("existing_image_url"));
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadToCloudinary(imageFile);
  }

  const galleryFiles = formData.getAll("gallery");
  let galleryUrls: string[] = [];
  const existingGalleryRaw = cleanString(formData.get("existing_gallery_urls"));
  if (existingGalleryRaw) {
    try {
      galleryUrls = JSON.parse(existingGalleryRaw);
    } catch { }
  }

  const newGalleryUrls: string[] = [];
  for (const file of galleryFiles) {
    if (file instanceof File && file.size > 0) {
      newGalleryUrls.push(await uploadToCloudinary(file));
    }
  }

  // If "clear_gallery" is checked, wipe the gallery
  if (formData.get("clear_gallery") === "true") {
    galleryUrls = [];
  } else {
    galleryUrls = [...galleryUrls, ...newGalleryUrls];
  }

  // --- Team Photos Upload ---
  const teamPhotoFiles = formData.getAll("team_photos");
  let teamPhotoUrls: string[] = [];
  const existingTeamPhotosRaw = cleanString(formData.get("existing_team_photo_urls"));
  if (existingTeamPhotosRaw) {
    try {
      teamPhotoUrls = JSON.parse(existingTeamPhotosRaw);
    } catch { }
  }

  const newTeamPhotoUrls: string[] = [];
  for (const file of teamPhotoFiles) {
    if (file instanceof File && file.size > 0) {
      newTeamPhotoUrls.push(await uploadToCloudinary(file));
    }
  }

  if (formData.get("clear_team_photos") === "true") {
    teamPhotoUrls = [];
  } else {
    teamPhotoUrls = [...teamPhotoUrls, ...newTeamPhotoUrls];
  }

  // --- Solo Named Contributors ---
  const contributorsData: { name: string; image_url: string }[] = [];
  
  // We provide 10 slots in the UI (0 to 9)
  for (let i = 0; i < 10; i++) {
    const existingName = cleanString(formData.get(`existing_contributor_name_${i}`));
    const existingUrl = cleanString(formData.get(`existing_contributor_url_${i}`));
    
    const newName = cleanString(formData.get(`contributor_name_${i}`));
    const newFile = formData.get(`contributor_file_${i}`);
    
    // Determine the name to use (prefer new input, fallback to existing)
    const finalName = newName || existingName;
    
    let finalUrl = existingUrl;
    if (newFile instanceof File && newFile.size > 0) {
      finalUrl = await uploadToCloudinary(newFile);
    }
    
    // Check if the delete flag was set for this specific contributor
    const isDeleted = formData.get(`delete_contributor_${i}`) === "true";

    // If there is a name or a photo, and it wasn't marked for deletion, save it
    if ((finalName || finalUrl) && !isDeleted) {
      contributorsData.push({
        name: finalName ?? "Unknown Contributor",
        image_url: finalUrl ?? "" // In a real app we'd have a placeholder or block saves without photos
      });
    }
  }

  await supabase.from("projects").upsert({
    id,
    title: cleanString(formData.get("title")) ?? "Untitled",
    description: cleanString(formData.get("description")),
    content: cleanString(formData.get("content")),
    tech_stack: splitList(formData.get("tech_stack")),
    project_url: cleanString(formData.get("project_url")),
    academic_year: (cleanString(formData.get("academic_year")) ?? "First Year") as AcademicYear,
    image_url: imageUrl,
    gallery_urls: galleryUrls.length > 0 ? galleryUrls : null,
    team_photo_urls: teamPhotoUrls.length > 0 ? teamPhotoUrls : null,
    team_photo_names: cleanString(formData.get("team_photo_names")),
    contributors_data: contributorsData.length > 0 ? contributorsData : null
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/project/${id}`);
}

export async function deleteProject(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();
  await supabase.from("projects").delete().eq("id", String(formData.get("id")));
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function saveAchievement(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();
  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const url = formData.get("url") as string;
  
  let image_url = formData.get("existing_image_url") as string | null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadToCloudinary(imageFile);
  }

  const payload = { title, description, date, url, image_url };

  if (id) {
    const { error } = await supabase.from("achievements").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("achievements").insert([payload]);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function deleteAchievement(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function saveExperience(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();

  const isCurrent = formData.get("is_current") === "true";
  const startMonth = cleanString(formData.get("start_month")) || "Jan";
  const startYear = cleanString(formData.get("start_year")) || "2024";
  const endMonth = cleanString(formData.get("end_month")) || "Jan";
  const endYear = cleanString(formData.get("end_year")) || "2024";
  
  let dateRange = `${startMonth} ${startYear} - `;
  if (isCurrent) {
    dateRange += "Present";
  } else {
    dateRange += `${endMonth} ${endYear}`;
  }

  await supabase.from("experiences").upsert({
    id: String(formData.get("id") || randomUUID()),
    title: cleanString(formData.get("title")) ?? "Untitled",
    company: cleanString(formData.get("company")),
    location: cleanString(formData.get("location")),
    date_range: dateRange,
    is_current: isCurrent,
    bullet_points: splitList(formData.get("bullet_points"))
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function deleteExperience(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();
  await supabase.from("experiences").delete().eq("id", String(formData.get("id")));
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function saveContacts(formData: FormData) {
  await assertAdmin();
  const supabase = createAdminClient();

  await supabase.from("contact_settings").upsert({
    id: String(formData.get("id") || randomUUID()),
    linkedin_url: cleanString(formData.get("linkedin_url")),
    github_url: cleanString(formData.get("github_url")),
    facebook_url: cleanString(formData.get("facebook_url")),
    resume_url: cleanString(formData.get("resume_url"))
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}
