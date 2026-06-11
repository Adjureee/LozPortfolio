"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await submitContactForm(formData);
      toast.success("Message sent! I'll get back to you soon.", {
        description: "Thanks for reaching out.",
      });
      (event.target as HTMLFormElement).reset();
      setCharCount(0);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* Name & Email side by side on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="group relative">
          <label
            htmlFor="cf-name"
            className="absolute left-4 top-3 text-xs font-bold uppercase tracking-[0.18em] text-muted transition-all pointer-events-none"
          >
            Your Name
          </label>
          <input
            type="text"
            id="cf-name"
            name="name"
            required
            placeholder="John Lyold Lozada"
            className="w-full bg-ink/[0.03] border border-line text-ink pt-8 pb-3 px-4 rounded-none outline-none focus:border-accent focus:bg-accent/5 transition-all placeholder:text-muted/40 text-sm"
          />
        </div>

        <div className="group relative">
          <label
            htmlFor="cf-email"
            className="absolute left-4 top-3 text-xs font-bold uppercase tracking-[0.18em] text-muted transition-all pointer-events-none"
          >
            Email Address
          </label>
          <input
            type="email"
            id="cf-email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full bg-ink/[0.03] border border-line text-ink pt-8 pb-3 px-4 rounded-none outline-none focus:border-accent focus:bg-accent/5 transition-all placeholder:text-muted/40 text-sm"
          />
        </div>
      </div>

      {/* Message */}
      <div className="group relative">
        <label
          htmlFor="cf-message"
          className="absolute left-4 top-3 text-xs font-bold uppercase tracking-[0.18em] text-muted pointer-events-none"
        >
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          maxLength={MAX_CHARS}
          placeholder="Tell me about your project, idea, or just say hi…"
          onChange={(e) => setCharCount(e.target.value.length)}
          className="w-full bg-ink/[0.03] border border-line text-ink pt-8 pb-3 px-4 rounded-none outline-none focus:border-accent focus:bg-accent/5 transition-all placeholder:text-muted/40 text-sm resize-none"
        />
        <span className="absolute bottom-3 right-4 text-[11px] text-muted/60 tabular-nums font-mono">
          {charCount}/{MAX_CHARS}
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group self-start flex items-center gap-3 bg-accent text-ink font-bold uppercase tracking-[0.2em] text-xs px-8 py-4 hover:bg-ink hover:text-paper transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
