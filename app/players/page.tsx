import { prisma } from "@/lib/prisma";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({ take: 200, orderBy: { overall: "desc" } });
  return <div className="card"><h1 className="font-semibold mb-2">Players</h1><table className="table"><thead><tr><th>Name</th><th>Pos</th><th>OVR</th><th>POT</th><th>Form</th><th>Morale</th><th>Injury</th><th>Value</th></tr></thead><tbody>{players.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.position}</td><td>{p.overall.toFixed(1)}</td><td>{p.potential.toFixed(1)}</td><td>{p.form.toFixed(1)}</td><td>{p.morale.toFixed(1)}</td><td>{p.injuryStatus}</td><td>${p.marketValue.toFixed(0)}</td></tr>)}</tbody></table></div>;
}
