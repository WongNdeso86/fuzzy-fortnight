"use client";

type Prospect = { id: number; name: string; age: number; position: string; overall: number; potential: number; morale: number; isClaimed: boolean };

export function YouthRecruitPanel({ prospects }: { prospects: Prospect[] }) {
  const recruit = async (prospectId: number) => {
    await fetch("/api/youth/recruit", { method: "POST", body: JSON.stringify({ prospectId }) });
    location.reload();
  };

  return (
    <div className="card">
      <h2 className="mb-2 font-semibold">Free Youth Intake (Awal + Tengah Musim)</h2>
      {prospects.length === 0 && <p className="text-sm text-slate-400">Belum ada intake aktif. Muncul pada week 1 dan week 26 tiap musim.</p>}
      <div className="grid gap-2 md:grid-cols-2">
        {prospects.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-slate-300">Age {p.age} • {p.position} • OVR {p.overall.toFixed(1)} • POT {p.potential.toFixed(1)}</div>
            <button className="btn mt-2" disabled={p.isClaimed} onClick={() => recruit(p.id)}>{p.isClaimed ? "Claimed" : "Recruit Free"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
