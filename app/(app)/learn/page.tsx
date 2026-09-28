import Link from "next/link";
import { loadCurriculum } from "@/lib/data";

export default async function Learn() {
  const { modules, lessons, progressMap } = await loadCurriculum();
  return (
    <div>
      <h1 className="text-2xl font-bold">Learn</h1>
      <div className="mt-6 space-y-8">
        {modules.map((m) => {
          const ls = lessons.filter((l) => l.module_id === m.id);
          return (
            <section key={m.id}>
              <h2 className="text-lg font-semibold">{m.title}</h2>
              <p className="text-sm text-slate-600">{m.summary}</p>
              {ls.length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">Lessons for this module are still being written.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                  {ls.map((l) => {
                    const p = progressMap.get(l.id);
                    const status = p?.status === "completed" ? "Completed" : p ? "In progress" : "Not started";
                    return (
                      <li key={l.id}>
                        <Link href={`/learn/${l.slug}`} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                          <span>
                            <span className="font-medium">{l.title}</span>
                            <span className="ml-2 text-xs text-slate-500">{l.estimated_minutes} min · {l.difficulty}</span>
                          </span>
                          <span className={`text-xs font-semibold ${p?.status === "completed" ? "text-green-700" : p ? "text-amber-600" : "text-slate-400"}`}>{status}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
