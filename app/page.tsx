import { prisma } from "@/lib/prisma";
import { TickControls } from "@/components/TickControls";

export default async function Dashboard() {
  const [state, agency, company, logs, nextClub] = await Promise.all([
    prisma.gameState.findUnique({ where: { id: 1 } }),
    prisma.agency.findUnique({ where: { id: 1 } }),
    prisma.company.findUnique({ where: { id: 1 } }),
    prisma.eventLog.findMany({ orderBy: { id: "desc" }, take: 10 }),
    prisma.club.findFirst({ orderBy: { points: "desc" } })
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Football Agent Web (Original)</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="card">Week {state?.week}</div>
        <div className="card">Agency Cash ${agency?.cash.toFixed(0)}</div>
        <div className="card">Company Cash ${company?.cash.toFixed(0)}</div>
        <div className="card">Top Club {nextClub?.name}</div>
      </div>
      <TickControls />
      <div className="card">
        <h2 className="mb-2 font-semibold">News Feed</h2>
        {logs.map((l) => <div key={l.id} className="text-sm">W{l.week} [{l.category}] {l.message}</div>)}
      </div>
    </div>
  );
}
