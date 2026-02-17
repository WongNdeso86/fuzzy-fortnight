import { prisma } from "@/lib/prisma";

export default async function ClubsPage() {
  const clubs = await prisma.club.findMany({ take: 200, orderBy: { points: "desc" } });
  return <div className="card"><h1 className="font-semibold mb-2">Clubs</h1><table className="table"><thead><tr><th>Club</th><th>Pos</th><th>P</th><th>Pts</th><th>Rep</th><th>Cash</th><th>Wage</th><th>Transfer</th></tr></thead><tbody>{clubs.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.leaguePosition}</td><td>{c.played}</td><td>{c.points}</td><td>{c.reputation.toFixed(1)}</td><td>${c.cash.toFixed(0)}</td><td>${c.wageBudget.toFixed(0)}</td><td>${c.transferBudget.toFixed(0)}</td></tr>)}</tbody></table></div>;
}
