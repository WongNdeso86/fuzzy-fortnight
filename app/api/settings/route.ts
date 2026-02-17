import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  if (body.kind === "program") {
    await prisma.supportProgram.upsert({
      where: { playerId: body.playerId },
      create: { playerId: body.playerId, type: body.type, weeklyCost: 15000, intensity: 1 },
      update: { type: body.type, active: true }
    });
  }
  if (body.kind === "editor") {
    if (body.code === "IUNDERSTAND") {
      await prisma.gameState.update({ where: { id: 1 }, data: { editorEnabled: body.enabled, editorThresholdMode: body.thresholdMode ?? "CONTROL_51" } });
      await prisma.eventLog.create({ data: { week: 0, category: "[EDITOR]", message: `Editor ${body.enabled ? "enabled" : "disabled"}` } });
    }
  }

  if (body.kind === "import") {
    if (body.data?.agency) await prisma.agency.update({ where: { id: 1 }, data: body.data.agency });
    if (body.data?.company) await prisma.company.update({ where: { id: 1 }, data: body.data.company });
    if (body.data?.gameState) await prisma.gameState.update({ where: { id: 1 }, data: body.data.gameState });
    if (Array.isArray(body.data?.holdings)) {
      await prisma.portfolioHolding.deleteMany();
      await prisma.portfolioHolding.createMany({ data: body.data.holdings.map((h: {clubId:number;shares:number;averageCost:number})=>({ clubId:h.clubId, shares:h.shares, averageCost:h.averageCost })) });
    }
  }

  if (body.kind === "export") {
    const data = {
      agency: await prisma.agency.findUnique({ where: { id: 1 } }),
      company: await prisma.company.findUnique({ where: { id: 1 } }),
      gameState: await prisma.gameState.findUnique({ where: { id: 1 } }),
      holdings: await prisma.portfolioHolding.findMany()
    };
    return Response.json(data);
  }
  return Response.json({ ok: true });
}
