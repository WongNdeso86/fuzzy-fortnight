import { prisma } from "@/lib/prisma";

export default async function SeasonPage() {
  const tables = await prisma.club.findMany({ take: 100, orderBy: [{ leagueId: "asc" }, { points: "desc" }] });
  return <div className="card"><h1 className="font-semibold">Season Tables</h1>{tables.map(c=><div key={c.id}>L{c.leagueId} #{c.leaguePosition} {c.name} ({c.points} pts)</div>)}</div>;
}
