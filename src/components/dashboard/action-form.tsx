"use client";

import { toast } from "sonner";

export function ActionForm({ 
  action, 
  children, 
  successMessage = "Saved successfully!",
  className = ""
}: { 
  action: (formData: FormData) => Promise<void>; 
  children: React.ReactNode; 
  successMessage?: string;
  className?: string;
}) {
  const handleAction = async (formData: FormData) => {
    try {
      await action(formData);
      toast.success(successMessage);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    }
  };

  return (
    <form action={handleAction} className={className}>
      {children}
    </form>
  );
}
