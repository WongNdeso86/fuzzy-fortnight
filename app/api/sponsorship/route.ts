import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  await prisma.sponsorshipContract.create({ data: { companyId: 1, clubId: Number(body.clubId), weeklyAmount: Number(body.weeklyAmount), durationWeeks: Number(body.durationWeeks), remainingWeeks: Number(body.durationWeeks), performanceBonus: Number(body.performanceBonus), brandLift: Number(body.brandLift) } });
  return Response.json({ ok: true });
}
