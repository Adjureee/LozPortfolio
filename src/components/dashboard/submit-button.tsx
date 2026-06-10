"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, variant = "primary" }: { label: string; variant?: "primary" | "danger" }) {
  const { pending } = useFormStatus();
  
  if (variant === "danger") {
    return (
      <button disabled={pending} className="text-sm text-red-500 hover:text-red-400 disabled:opacity-50">
        {pending ? "Deleting..." : label}
      </button>
    );
  }

  return (
    <button 
      disabled={pending} 
      className="bg-ink px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-paper hover:bg-accent disabled:opacity-50 transition-colors"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}
