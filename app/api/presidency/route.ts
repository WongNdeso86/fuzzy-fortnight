import { prisma } from "@/lib/prisma";
import { gameConfig } from "@/config/gameConfig";

export async function POST(req: Request) {
  const b = await req.json();
  const clubId = Number(b.clubId);
  const holding = await prisma.portfolioHolding.findUnique({ where: { clubId } });
  const stock = await prisma.clubStock.findUnique({ where: { clubId } });
  const agency = await prisma.agency.findUnique({ where: { id: 1 } });
  if (!holding || !stock || !agency) return Response.json({ ok: false });

  const ownershipPercent = holding.shares / stock.sharesOutstanding;
  const state = await prisma.gameState.findUnique({ where: { id: 1 } });
  const threshold = state?.editorThresholdMode === "FULL_100" ? 1 : gameConfig.president.ownershipThreshold;
  const canBePresident = ownershipPercent >= threshold && agency.cash >= gameConfig.president.minCashReserve && agency.reputation >= gameConfig.president.minReputation;

  await prisma.presidency.update({
    where: { id: 1 },
    data: {
      clubId,
      ownershipPercent,
      isPresident: canBePresident,
      wageBudgetRatio: Number(b.wageRatio),
      facilitiesSpend: Number(b.facilitiesSpend),
      youthSpend: Number(b.youthSpend)
    }
  });

  if (canBePresident) {
    await prisma.club.update({
      where: { id: clubId },
      data: {
        wageBudget: { increment: Number(b.facilitiesSpend) * Number(b.wageRatio) },
        facilitiesLevel: { increment: Number(b.facilitiesSpend) / 1_000_000 },
        youthSpend: Number(b.youthSpend),
        coachQuality: { increment: 0.1 }
      }
    });
  }

  return Response.json({ ok: true, canBePresident, ownershipPercent });
}
