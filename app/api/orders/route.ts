import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const b = await req.json();
  const clubId = Number(b.clubId);
  const action = String(b.action);
  const shares = Math.max(1, Math.floor(Number(b.shares)));

  const [stock, agency, holding] = await Promise.all([
    prisma.clubStock.findUnique({ where: { clubId } }),
    prisma.agency.findUnique({ where: { id: 1 } }),
    prisma.portfolioHolding.findUnique({ where: { clubId } })
  ]);

  if (!stock || !agency) return Response.json({ ok: false, message: "stock/agency missing" }, { status: 400 });

  const price = stock.pricePerShare;
  const total = shares * price;
  const tradableShares = Math.floor(stock.sharesOutstanding * stock.floatPercent);
  const ownedShares = holding?.shares ?? 0;
  const marketFreeFloat = Math.max(0, tradableShares - ownedShares);

  if (action === "BUY") {
    if (shares > marketFreeFloat) return Response.json({ ok: false, message: "not enough market float" }, { status: 400 });
    if (agency.cash < total) return Response.json({ ok: false, message: "cash low" }, { status: 400 });

    const nextShares = ownedShares + shares;
    const nextAvg = holding ? ((holding.averageCost * holding.shares) + total) / nextShares : price;

    await prisma.agency.update({ where: { id: 1 }, data: { cash: { decrement: total } } });
    await prisma.portfolioHolding.upsert({
      where: { clubId },
      create: { clubId, shares, averageCost: price },
      update: { shares: nextShares, averageCost: nextAvg }
    });
  }

  if (action === "SELL") {
    if (!holding || holding.shares <= 0) return Response.json({ ok: false, message: "no holdings" }, { status: 400 });
    if (shares > holding.shares) return Response.json({ ok: false, message: "sell exceeds holdings" }, { status: 400 });

    const nextShares = holding.shares - shares;
    await prisma.agency.update({ where: { id: 1 }, data: { cash: { increment: total } } });
    if (nextShares <= 0) {
      await prisma.portfolioHolding.delete({ where: { clubId } });
    } else {
      await prisma.portfolioHolding.update({ where: { clubId }, data: { shares: nextShares } });
    }
  }

  const gs = await prisma.gameState.findUnique({ where: { id: 1 } });
  await prisma.stockTransaction.create({ data: { clubId, action, shares, price, total, week: gs?.week ?? 1 } });

  return Response.json({ ok: true, price, total });
}
