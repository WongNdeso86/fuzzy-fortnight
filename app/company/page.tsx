import { prisma } from "@/lib/prisma";
import { SponsorForm } from "@/components/SponsorForm";

export default async function CompanyPage() {
  const [company, deals] = await Promise.all([prisma.company.findUnique({ where: { id: 1 } }), prisma.sponsorshipContract.findMany({ take: 20 })]);
  return <div className="space-y-4"><div className="card">{company?.name} | Cash ${company?.cash.toFixed(0)} | Brand {company?.brandReputation.toFixed(1)} | RevenueBase ${company?.revenueBase.toFixed(0)}</div>
  <SponsorForm />
  <div className="card"><h2 className="font-semibold">Deals</h2>{deals.map(d=><div key={d.id}>Club#{d.clubId} ${d.weeklyAmount}/week rem {d.remainingWeeks}</div>)}</div></div>;
}
