import { PrismaClient, Position } from "@prisma/client";

const prisma = new PrismaClient();

const syllables = ["al", "bar", "cor", "den", "el", "far", "gan", "hal", "ir", "jor", "kel", "lor", "mar", "nor", "or", "pra", "quil", "ran", "sor", "tor", "ul", "vor", "wen", "xer", "yor", "zen"];
const nations = ["Averon", "Bristan", "Caldor", "Dramia", "Eldora", "Fesnia", "Gorath", "Helvia", "Istran", "Jorvik"];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const nameGen = (parts = 2) => Array.from({ length: parts }, () => pick(syllables)).join("").replace(/^./, (c) => c.toUpperCase());

async function main() {
  await prisma.stockPricePoint.deleteMany();
  await prisma.stockTransaction.deleteMany();
  await prisma.portfolioHolding.deleteMany();
  await prisma.clubStock.deleteMany();
  await prisma.supportProgram.deleteMany();
  await prisma.player.deleteMany();
  await prisma.sponsorshipContract.deleteMany();
  await prisma.company.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.club.deleteMany();
  await prisma.league.deleteMany();
  await prisma.eventLog.deleteMany();
  await prisma.presidency.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.gameState.deleteMany();

  const leagues = Array.from({ length: 150 }).map((_, i) => ({
    name: `${nameGen(2)} League ${i + 1}`,
    region: `Region-${(i % 15) + 1}`,
    tier: (i % 5) + 1,
    reputation: 30 + (5 - (i % 5)) * 8 + Math.random() * 10
  }));
  await prisma.league.createMany({ data: leagues });
  const leagueRows = await prisma.league.findMany();

  const clubs = Array.from({ length: 720 }).map((_, i) => {
    const league = leagueRows[i % leagueRows.length];
    return {
      name: `${nameGen(2)} ${nameGen(1)} FC`,
      reputation: 20 + Math.random() * 70,
      cash: 1_000_000 + Math.random() * 20_000_000,
      wageBudget: 100_000 + Math.random() * 1_500_000,
      transferBudget: 50_000 + Math.random() * 8_000_000,
      facilitiesLevel: 1 + Math.random() * 9,
      coachQuality: 1 + Math.random() * 9,
      morale: 40 + Math.random() * 40,
      leagueId: league.id,
      leaguePosition: (i % 20) + 1
    };
  });
  await prisma.club.createMany({ data: clubs });
  const clubRows = await prisma.club.findMany();

  const players: any[] = [];
  for (let i = 0; i < 14000; i++) {
    const club = clubRows[i % clubRows.length];
    const ov = 40 + Math.random() * 50;
    players.push({
      name: `${nameGen(2)} ${nameGen(2)}`,
      nationality: pick(nations),
      age: 16 + Math.floor(Math.random() * 20),
      position: pick([Position.GK, Position.DF, Position.MF, Position.FW]),
      overall: ov,
      potential: Math.min(99, ov + Math.random() * 20),
      form: 40 + Math.random() * 50,
      morale: 40 + Math.random() * 50,
      injuryRisk: 2 + Math.random() * 12,
      professionalism: 40 + Math.random() * 55,
      marketValue: ov * 12000 + Math.random() * 400000,
      clubId: club.id,
      isManagedByAgent: i < 25
    });
  }
  for (let i = 0; i < players.length; i += 1000) {
    await prisma.player.createMany({ data: players.slice(i, i + 1000) });
  }

  await prisma.agency.create({ data: { id: 1, name: "Aurora Agency", cash: 5_000_000, reputation: 35, weeklyCosts: 120000, scoutingNetwork: 3 } });
  await prisma.company.create({ data: { id: 1, agencyId: 1, name: "Nova Holdings", cash: 8_000_000, revenueBase: 500000, brandReputation: 25, industryType: "Tech" } });
  await prisma.gameState.create({ data: { id: 1 } });
  await prisma.presidency.create({ data: { id: 1 } });
  await prisma.staff.createMany({ data: [{ role: "Scout", skill: 62, salary: 15000, agencyId: 1 }, { role: "Lawyer", skill: 58, salary: 18000, agencyId: 1 }, { role: "Analyst", skill: 65, salary: 17000, agencyId: 1 }] });

  const stocks = clubRows.map((club) => ({ clubId: club.id, sharesOutstanding: 1_000_000 + Math.random() * 5_000_000, floatPercent: 0.45 + Math.random() * 0.45, pricePerShare: 2 + Math.random() * 20, volatility: 0.8 + Math.random() * 1.4 }));
  for (let i = 0; i < stocks.length; i += 300) await prisma.clubStock.createMany({ data: stocks.slice(i, i + 300) });

  const topClub = clubRows[0];
  await prisma.sponsorshipContract.create({ data: { companyId: 1, clubId: topClub.id, weeklyAmount: 120000, durationWeeks: 30, remainingWeeks: 30, performanceBonus: 25000, brandLift: 2.5 } });
  await prisma.eventLog.create({ data: { week: 1, category: "Seed", message: `Seed completed: ${leagueRows.length} leagues, ${clubRows.length} clubs, ${players.length} players` } });

  console.log("Seed done", { leagues: leagueRows.length, clubs: clubRows.length, players: players.length });
}

main().finally(() => prisma.$disconnect());
