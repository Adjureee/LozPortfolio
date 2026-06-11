"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    throw new Error("All fields are required");
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("messages")
    .insert([{ name, email, message, is_read: false }]);

  if (error) {
    console.error("Error inserting message:", error);
    throw new Error("Failed to send message. Please try again later.");
  }

  revalidatePath("/dashboard/messages");
}

export async function markMessageRead(formData: FormData) {
  if (!(await isCurrentUserAdmin())) {
    redirect("/admin-login");
  }

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing message ID");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking message as read:", error);
    throw new Error("Failed to update message");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/messages");
}

export async function deleteMessage(formData: FormData) {
  if (!(await isCurrentUserAdmin())) {
    redirect("/admin-login");
  }

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing message ID");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting message:", error);
    throw new Error("Failed to delete message");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/messages");
}
