import { prisma } from "@/lib/prisma";
import { negotiateOffer } from "@/lib/sim/negotiation";
import { gameConfig } from "@/config/gameConfig";

export default async function MarketPage() {
  const candidates = await prisma.player.findMany({ where: { isManagedByAgent: true }, take: 20 });
  const offers = candidates.map((p)=> ({ player: p, offer: negotiateOffer(p.marketValue, p.negotiationPower, gameConfig.aiAggressiveness) }));
  return <div className="card"><h1 className="font-semibold mb-2">Transfer & Negotiation (AI offers)</h1>{offers.map(({player,offer})=><div key={player.id} className="mb-2 rounded border border-slate-800 p-2">{player.name}: fee ${offer.transferFee.toFixed(0)} wage ${offer.wage.toFixed(0)}y duration {offer.duration}yr commission ${offer.agentCommission.toFixed(0)}</div>)}</div>;
}
