import Link from "next/link";
import { loadCurriculum } from "@/lib/data";

export default async function Dashboard() {
  const { modules, lessons, progressMap } = await loadCurriculum();
  const ordered = modules.flatMap((m) => lessons.filter((l) => l.module_id === m.id));
  const done = ordered.filter((l) => progressMap.get(l.id)?.status === "completed").length;
  const next = ordered.find((l) => progressMap.get(l.id)?.status !== "completed");
  const pct = ordered.length ? Math.round((100 * done) / ordered.length) : 0;
  const remainingMin = ordered.filter((l) => progressMap.get(l.id)?.status !== "completed").reduce((s, l) => s + l.estimated_minutes, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold">Your SAP career progress</h1>
      <p className="mt-1 text-sm text-slate-600">Lessons count as complete only after you read them, pass the quiz and submit the practical task.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Lessons completed</p>
          <p className="mt-1 text-3xl font-bold">{done}<span className="text-lg text-slate-400"> / {ordered.length}</span></p>
          <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Available content remaining</p>
          <p className="mt-1 text-3xl font-bold">{Math.round(remainingMin / 60 * 10) / 10}<span className="text-lg text-slate-400"> hours</span></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Next lesson</p>
          {next ? (
            <Link href={`/learn/${next.slug}`} className="mt-1 block font-semibold text-brand-600 hover:underline">{next.title}</Link>
          ) : <p className="mt-1 font-semibold">All available lessons done</p>}
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Modules</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {modules.map((m) => {
          const ls = lessons.filter((l) => l.module_id === m.id);
          const d = ls.filter((l) => progressMap.get(l.id)?.status === "completed").length;
          return (
            <Link key={m.id} href="/learn" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500">
              <h3 className="font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{m.summary}</p>
              <p className="mt-3 text-sm text-slate-500">{ls.length ? `${d} of ${ls.length} lessons complete` : "Lessons coming soon"}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
