import { prisma } from "@/lib/prisma";

export default async function SeasonPage() {
  const tables = await prisma.club.findMany({ take: 120, orderBy: [{ leagueId: "asc" }, { points: "desc" }] });
  return <div className="card"><h1 className="font-semibold mb-2">Season Tables</h1><table className="table"><thead><tr><th>League</th><th>Pos</th><th>Club</th><th>P</th><th>Pts</th><th>PPG</th></tr></thead><tbody>{tables.map(c=><tr key={c.id}><td>{c.leagueId}</td><td>{c.leaguePosition}</td><td>{c.name}</td><td>{c.played}</td><td>{c.points}</td><td>{c.played>0?(c.points/c.played).toFixed(2):"0.00"}</td></tr>)}</tbody></table></div>;
}
