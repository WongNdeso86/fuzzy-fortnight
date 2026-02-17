import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const prospect = await prisma.youthProspect.findUnique({ where: { id: Number(body.prospectId) } });
  if (!prospect || prospect.isClaimed) return Response.json({ ok: false }, { status: 400 });

  const fallbackClub = await prisma.club.findFirst({ orderBy: { id: "asc" } });
  if (!fallbackClub) return Response.json({ ok: false }, { status: 400 });

  await prisma.player.create({
    data: {
      name: prospect.name,
      nationality: prospect.nationality,
      age: prospect.age,
      position: prospect.position,
      overall: prospect.overall,
      potential: prospect.potential,
      form: 55,
      morale: prospect.morale,
      injuryRisk: 6,
      professionalism: 58,
      marketValue: prospect.overall * 11000,
      clubId: fallbackClub.id,
      isManagedByAgent: true
    }
  });

  await prisma.youthProspect.update({ where: { id: prospect.id }, data: { isClaimed: true } });
  const gs = await prisma.gameState.findUnique({ where: { id: 1 } });
  await prisma.eventLog.create({ data: { week: gs?.week ?? 1, category: "Youth", message: `Free youth recruited: ${prospect.name} (${prospect.overall.toFixed(1)}/${prospect.potential.toFixed(1)})` } });
  return Response.json({ ok: true });
}
