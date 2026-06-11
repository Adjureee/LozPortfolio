"use client";

import { useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success(successMessage);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to save.");
      }
    });
  };

  return (
    <form action={handleSubmit} className={className}>
      {children}
    </form>
  );
}
