import { prisma } from "@/lib/prisma";
import { TickControls } from "@/components/TickControls";

export default async function Dashboard() {
  const [state, agency, company, logs, nextClub, prospects] = await Promise.all([
    prisma.gameState.findUnique({ where: { id: 1 } }),
    prisma.agency.findUnique({ where: { id: 1 } }),
    prisma.company.findUnique({ where: { id: 1 } }),
    prisma.eventLog.findMany({ orderBy: { id: "desc" }, take: 12 }),
    prisma.club.findFirst({ orderBy: { points: "desc" } }),
    prisma.youthProspect.count({ where: { isClaimed: false } })
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Football Agent Web (Original)</h1>
      <div className="grid gap-3 md:grid-cols-5">
        <div className="card bg-indigo-900/30">Week {state?.week}</div>
        <div className="card bg-emerald-900/30">Agency Cash ${agency?.cash.toFixed(0)}</div>
        <div className="card bg-cyan-900/30">Company Cash ${company?.cash.toFixed(0)}</div>
        <div className="card bg-purple-900/30">Top Club {nextClub?.name}</div>
        <div className="card bg-amber-900/30">Youth Prospects {prospects}</div>
      </div>
      <TickControls />
      <div className="card">
        <h2 className="mb-2 font-semibold">News Feed</h2>
        {logs.map((l) => <div key={l.id} className="text-sm">W{l.week} [{l.category}] {l.message}</div>)}
      </div>
    </div>
  );
}
