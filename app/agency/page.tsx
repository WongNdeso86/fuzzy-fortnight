import { prisma } from "@/lib/prisma";
import { ProgramPicker } from "@/components/ProgramPicker";
import { YouthRecruitPanel } from "@/components/YouthRecruitPanel";

export default async function AgencyPage() {
  const [agency, staff, players, programs, state, prospects] = await Promise.all([
    prisma.agency.findUnique({ where: { id: 1 } }),
    prisma.staff.findMany(),
    prisma.player.findMany({ where: { isManagedByAgent: true }, take: 25, orderBy: { overall: "desc" } }),
    prisma.supportProgram.findMany(),
    prisma.gameState.findUnique({ where: { id: 1 } }),
    prisma.youthProspect.findMany({ where: { isClaimed: false }, orderBy: [{ potential: "desc" }, { overall: "desc" }], take: 12 })
  ]);

  const weekInSeason = (((state?.week ?? 1) - 1) % 52) + 1;

  return <div className="space-y-4">
    <div className="card bg-gradient-to-r from-indigo-900/40 to-emerald-900/40">Cash ${agency?.cash.toFixed(0)} | Rep {agency?.reputation.toFixed(1)} | Weekly Costs ${agency?.weeklyCosts.toFixed(0)} | WeekInSeason {weekInSeason}</div>
    <div className="card"><h2 className="font-semibold">Staff</h2>{staff.map(s=><div key={s.id}>{s.role} skill {s.skill.toFixed(1)} salary ${s.salary.toFixed(0)}</div>)}</div>
    <YouthRecruitPanel prospects={prospects} />
    <ProgramPicker players={players} active={programs} />
  </div>;
}
