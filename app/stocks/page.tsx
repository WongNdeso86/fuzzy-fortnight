import { prisma } from "@/lib/prisma";
import { StockChart } from "@/components/StockChart";
import { TradePanel } from "@/components/TradePanel";

export default async function StocksPage() {
  const [stocks, holdings] = await Promise.all([
    prisma.clubStock.findMany({ take: 30, include: { points: { take: 20, orderBy: { week: "asc" } } } }),
    prisma.portfolioHolding.findMany()
  ]);
  return <div className="space-y-4">
    <div className="card"><h1 className="font-semibold">Stock Market</h1><TradePanel /></div>
    <div className="card">Portfolio: {holdings.map(h=> <span key={h.id} className="mr-2">Club#{h.clubId} {h.shares.toFixed(2)} sh avg ${h.averageCost.toFixed(2)}</span>)}</div>
    {stocks.slice(0,6).map(s=><div key={s.id} className="card"><div>Club#{s.clubId} Price ${s.pricePerShare.toFixed(2)} Vol {s.volatility.toFixed(2)}</div><StockChart data={s.points.map(p=>({week:p.week,price:p.price}))} /></div>)}
  </div>;
}
