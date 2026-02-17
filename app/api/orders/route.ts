import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const b = await req.json();
  const stock = await prisma.clubStock.findUnique({ where: { clubId: Number(b.clubId) } });
  const agency = await prisma.agency.findUnique({ where: { id: 1 } });
  if (!stock || !agency) return Response.json({ ok: false }, { status: 400 });
  const shares = Number(b.shares);
  const total = shares * stock.pricePerShare;
  const holding = await prisma.portfolioHolding.findFirst({ where: { clubId: Number(b.clubId) } });
  if (b.action === "BUY") {
    if (agency.cash < total) return Response.json({ ok: false, message: "cash low" }, { status: 400 });
    await prisma.agency.update({ where: { id: 1 }, data: { cash: { decrement: total } } });
    await prisma.portfolioHolding.upsert({ where: { clubId: Number(b.clubId) }, create: { clubId: Number(b.clubId), shares, averageCost: stock.pricePerShare }, update: { shares: { increment: shares }, averageCost: ((holding?.averageCost ?? stock.pricePerShare) + stock.pricePerShare)/2 } });
  } else if (holding) {
    await prisma.agency.update({ where: { id: 1 }, data: { cash: { increment: total } } });
    await prisma.portfolioHolding.update({ where: { id: holding.id }, data: { shares: Math.max(0, holding.shares - shares) } });
  }
  const gs = await prisma.gameState.findUnique({ where: { id: 1 } });
  await prisma.stockTransaction.create({ data: { clubId: Number(b.clubId), action: b.action, shares, price: stock.pricePerShare, total, week: gs?.week ?? 1 } });
  return Response.json({ ok: true });
}
