import { prisma } from "@/lib/prisma";
import { runOneWeekTick } from "@/lib/sim/tickEngine";

export async function POST(req: Request) {
  const b = await req.json();
  if (b.kind === "agency") await prisma.agency.update({ where: { id: 1 }, data: { [b.field]: b.value } as any });
  if (b.kind === "player") await prisma.player.update({ where: { id: Number(b.id) }, data: { [b.field]: b.value } as any });
  if (b.kind === "club") await prisma.club.update({ where: { id: Number(b.id) }, data: { [b.field]: b.value } as any });
  if (b.kind === "stock") await prisma.clubStock.update({ where: { clubId: Number(b.id) }, data: { [b.field]: b.value } as any });
  if (b.kind === "sponsorship") await prisma.sponsorshipContract.update({ where: { id: Number(b.id) }, data: { [b.field]: b.value } as any });
  if (b.kind === "world") for (let i = 0; i < Number(b.value); i++) await runOneWeekTick();
  const gs = await prisma.gameState.findUnique({ where: { id: 1 } });
  await prisma.eventLog.create({ data: { week: gs?.week ?? 0, category: "[EDITOR]", message: `${b.kind} id=${b.id} ${b.field}=${b.value}` } });
  return Response.json({ ok: true });
}
