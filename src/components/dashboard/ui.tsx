import type { ReactNode } from "react";

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-line bg-paper/70 p-5 backdrop-blur">
      <h2 className="mb-5 font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export function Field({ name, label, value = "", placeholder = "" }: { name: string; label: string; value?: string | null; placeholder?: string }) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <input name={name} defaultValue={value ?? ""} placeholder={placeholder} className="mt-2 w-full border border-line bg-transparent px-3 py-3 text-ink outline-none focus:border-accent" />
    </label>
  );
}

export function TextArea({ name, label, value = "", placeholder = "" }: { name: string; label: string; value?: string | null; placeholder?: string }) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <textarea name={name} defaultValue={value ?? ""} placeholder={placeholder} rows={4} className="mt-2 w-full border border-line bg-transparent px-3 py-3 text-ink outline-none focus:border-accent" />
    </label>
  );
}

export function Empty() {
  return <p className="border border-dashed border-line p-5 text-sm text-muted text-center font-medium">No entries found.</p>;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function DateDropdowns({ dateRange = "" }: { dateRange?: string }) {
  const currentYear = new Date().getFullYear();
  const dropdownYears = Array.from({ length: 30 }, (_, i) => String(currentYear - i));

  const parts = dateRange.split(" - ");
  const startParts = parts[0]?.split(" ") || [];
  const endParts = parts[1]?.split(" ") || [];
  
  const startMonth = startParts[0] || "Jan";
  const startYear = startParts[1] || String(currentYear);
  const endMonth = endParts[0] || "Jan";
  const endYear = endParts[1] || String(currentYear);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-muted mb-2">Start Date</label>
        <div className="flex gap-2">
          <select name="start_month" defaultValue={startMonth} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="start_year" defaultValue={startYear} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {dropdownYears.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-muted mb-2">End Date</label>
        <div className="flex gap-2">
          <select name="end_month" defaultValue={endMonth} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="end_year" defaultValue={endYear} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {dropdownYears.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
