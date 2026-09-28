import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("display_name, onboarding_completed").eq("id", user.id).single();
  if (profile && !profile.onboarding_completed) redirect("/onboarding");
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold text-brand-700">SAP CareerForge</Link>
            <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</Link>
            <Link href="/learn" className="text-sm text-slate-600 hover:text-slate-900">Learn</Link>
          </div>
          <form action="/auth/signout" method="post" className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">{profile?.display_name}</span>
            <button className="text-sm text-slate-600 hover:text-slate-900">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      <footer className="mx-auto max-w-5xl px-6 pb-8 text-xs text-slate-500">
        Independent training content. Not affiliated with SAP and not an SAP certification. Training and simulation are not employment experience.
      </footer>
    </div>
  );
}
