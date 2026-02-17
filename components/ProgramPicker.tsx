"use client";

type P = { id: number; name: string };

export function ProgramPicker({ players, active }: { players: P[]; active: { playerId: number; type: string }[] }) {
  const assign = async (playerId: number, type: string) => {
    await fetch("/api/settings", { method: "POST", body: JSON.stringify({ kind: "program", playerId, type }) });
    location.reload();
  };
  return <div className="card">
    <h2 className="mb-2 font-semibold">Support Programs</h2>
    <table className="table"><thead><tr><th>Player</th><th>Active</th><th>Actions</th></tr></thead><tbody>
      {players.map((p)=><tr key={p.id}><td>{p.name}</td><td>{active.find(a=>a.playerId===p.id)?.type ?? "-"}</td><td className="space-x-1">
        {["Training Camp","Rehab","Nutrition","Mental Coach","Analyst Pack"].map((t)=><button key={t} className="rounded bg-slate-800 px-1 text-xs" onClick={()=>assign(p.id,t)}>{t}</button>)}
      </td></tr>)}
    </tbody></table>
  </div>;
}
