"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/app/actions/contact";
import type { ContactMessage } from "@/lib/types";

export function InboxPanel({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return <p className="text-muted text-sm italic">No messages yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageCard key={msg.id} message={msg} />
      ))}
    </div>
  );
}

function MessageCard({ message }: { message: ContactMessage }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  async function handleMarkRead() {
    setIsMarking(true);
    const formData = new FormData();
    formData.append("id", message.id);
    await markMessageRead(formData);
    setIsMarking(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", message.id);
    await deleteMessage(formData);
    setIsDeleting(false);
  }

  return (
    <div className={`border border-line p-5 flex flex-col gap-3 transition-colors ${message.is_read ? 'bg-transparent opacity-70' : 'bg-ink/5 border-accent/30'}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="font-bold text-lg flex items-center gap-2">
            {!message.is_read && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
            {message.name}
          </h4>
          <p className="text-sm text-muted">{message.email}</p>
        </div>
        <div className="text-xs text-muted" suppressHydrationWarning>
          {new Date(message.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
        </div>
      </div>
      
      <p className="text-sm mt-2 whitespace-pre-wrap">{message.message}</p>
      
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-line/50">
        {!message.is_read ? (
          <button 
            onClick={handleMarkRead}
            disabled={isMarking}
            className="text-xs font-bold uppercase tracking-widest text-accent hover:text-ink flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <MailOpen size={14} /> Mark as Read
          </button>
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
            <Mail size={14} /> Read
          </span>
        )}
        
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-2 ml-auto transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
