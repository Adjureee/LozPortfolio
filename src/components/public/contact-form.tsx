"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    try {
      await submitContactForm(formData);
      toast.success("Message sent successfully! I'll get back to you soon.");
      (event.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted">Your Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          placeholder="John Lyold Lozada"
          className="w-full bg-transparent border border-line/50 text-ink px-4 py-3 rounded-sm focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted">Email Address</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          placeholder="you@example.com"
          className="w-full bg-transparent border border-line/50 text-ink px-4 py-3 rounded-sm focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted">Message</label>
        <textarea 
          id="message" 
          name="message" 
          required 
          rows={5}
          placeholder="What's on your mind?"
          className="w-full bg-transparent border border-line/50 text-ink px-4 py-3 rounded-sm focus:outline-none focus:border-accent transition-colors resize-y"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="self-start mt-2 bg-accent text-ink font-bold uppercase tracking-widest px-8 py-4 text-sm flex items-center gap-3 hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Message"} 
        {!isSubmitting && <ArrowRight size={18} strokeWidth={2.5} />}
      </button>
    </form>
  );
}
