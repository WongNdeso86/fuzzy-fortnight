import { prisma } from "@/lib/prisma";
import { ProgramPicker } from "@/components/ProgramPicker";

export default async function AgencyPage() {
  const [agency, staff, players, programs] = await Promise.all([
    prisma.agency.findUnique({ where: { id: 1 } }),
    prisma.staff.findMany(),
    prisma.player.findMany({ where: { isManagedByAgent: true }, take: 25 }),
    prisma.supportProgram.findMany()
  ]);
  return <div className="space-y-4">
    <div className="card">Cash ${agency?.cash.toFixed(0)} | Rep {agency?.reputation.toFixed(1)} | Weekly Costs ${agency?.weeklyCosts.toFixed(0)}</div>
    <div className="card"><h2 className="font-semibold">Staff</h2>{staff.map(s=><div key={s.id}>{s.role} skill {s.skill.toFixed(1)} salary ${s.salary.toFixed(0)}</div>)}</div>
    <ProgramPicker players={players} active={programs} />
  </div>;
}
