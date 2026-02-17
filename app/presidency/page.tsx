import { prisma } from "@/lib/prisma";
import { PresidencyPanel } from "@/components/PresidencyPanel";

export default async function PresidencyPage() {
  const [pres, clubs] = await Promise.all([prisma.presidency.findUnique({ where: { id: 1 } }), prisma.club.findMany({ take: 50 })]);
  if (!pres?.isPresident) return <div className="card">Belum menjadi president. Beli saham sampai threshold.</div>;
  return <div className="space-y-3"><div className="card">President of Club#{pres.clubId} ownership {Math.round(pres.ownershipPercent*100)}%</div><PresidencyPanel clubs={clubs.map(c=>({id:c.id,name:c.name}))} /></div>;
}
