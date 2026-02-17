import { prisma } from "@/lib/prisma";
import { StockChart } from "@/components/StockChart";
import { TradePanel } from "@/components/TradePanel";

export default async function StocksPage() {
  const [agency, stocks, holdings] = await Promise.all([
    prisma.agency.findUnique({ where: { id: 1 } }),
    prisma.clubStock.findMany({ include: { club: true, points: { take: 20, orderBy: { week: "asc" } } }, take: 30, orderBy: { pricePerShare: "desc" } }),
    prisma.portfolioHolding.findMany()
  ]);

  const holdingsMap = new Map(holdings.map((h) => [h.clubId, h]));

  const portfolio = holdings.map((h) => {
    const stock = stocks.find((s) => s.clubId === h.clubId);
    const marketValue = (stock?.pricePerShare ?? 0) * h.shares;
    const cost = h.averageCost * h.shares;
    return { ...h, marketValue, pnl: marketValue - cost, clubName: stock?.club.name ?? `Club#${h.clubId}` };
  });

  const stockLite = stocks.map((s) => {
    const own = holdingsMap.get(s.clubId)?.shares ?? 0;
    const tradableShares = Math.floor(s.sharesOutstanding * s.floatPercent);
    const availableShares = Math.max(0, tradableShares - own);
    return { clubId: s.clubId, clubName: s.club.name, price: s.pricePerShare, tradableShares, availableShares };
  });

  return <div className="space-y-4">
    <div className="card">
      <h1 className="font-semibold">Stock Market</h1>
      <p className="text-sm text-slate-300 mb-2">Cash ${agency?.cash.toFixed(0)}</p>
      <TradePanel stocks={stockLite} />
    </div>

    <div className="card">
      <h2 className="font-semibold mb-2">Portfolio Summary</h2>
      {portfolio.length === 0 && <div className="text-sm text-slate-400">Belum ada kepemilikan saham.</div>}
      {portfolio.map((h) => (
        <div key={h.id} className="text-sm">
          {h.clubName}: {h.shares.toFixed(0)} sh | Avg ${h.averageCost.toFixed(2)} | MV ${h.marketValue.toFixed(2)} | P/L <span className={h.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>{h.pnl >= 0 ? "+" : ""}{h.pnl.toFixed(2)}</span>
        </div>
      ))}
    </div>

    {stocks.slice(0, 8).map((s) => (
      <div key={s.id} className="card">
        <div className="font-medium">{s.club.name} • Price ${s.pricePerShare.toFixed(2)} • Vol {s.volatility.toFixed(2)}</div>
        <div className="text-xs text-slate-300">Outstanding {Math.floor(s.sharesOutstanding).toLocaleString()} • Float {(s.floatPercent * 100).toFixed(1)}% • Latest reason: {s.points.at(-1)?.reasonLog ?? "n/a"}</div>
        <StockChart data={s.points.map((p) => ({ week: p.week, price: p.price }))} />
      </div>
    ))}
  </div>;
}
