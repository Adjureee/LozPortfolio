import { LockKeyhole } from "lucide-react";
import { signInAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 text-ink">
      <form action={signInAction} className="w-full max-w-sm border border-line bg-paper/80 p-6 shadow-glow backdrop-blur">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-11 place-items-center border border-line bg-ink text-paper">
            <LockKeyhole size={18} />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Private CMS</p>
            <h1 className="font-display text-2xl">Admin access</h1>
          </div>
        </div>
        <label className="mb-4 block text-sm">
          Email
          <input name="email" type="email" required className="mt-2 w-full border border-line bg-transparent px-3 py-3 outline-none focus:border-accent" />
        </label>
        <label className="mb-5 block text-sm">
          Password
          <input name="password" type="password" required className="mt-2 w-full border border-line bg-transparent px-3 py-3 outline-none focus:border-accent" />
        </label>
        {params.error ? <p className="mb-4 text-sm text-red-500">{params.error}</p> : null}
        <button className="w-full bg-ink px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-accent">
          Enter Dashboard
        </button>
      </form>
    </main>
  );
}
