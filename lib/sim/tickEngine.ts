import { prisma } from "@/lib/prisma";
import { gameConfig } from "@/config/gameConfig";
import { applySponsorshipToBudgets, agencyWeeklyBalance } from "@/lib/sim/economy";
import { calculateStockPrice } from "@/lib/sim/stockPricing";
import { calculateTeamStrength, simulateMatch } from "@/lib/sim/matchSim";

const nations = ["Averon", "Bristan", "Caldor", "Dramia", "Eldora", "Fesnia", "Gorath", "Helvia", "Istran", "Jorvik"];
const syllables = ["al", "bar", "cor", "den", "el", "far", "gan", "hal", "ir", "jor", "kel", "lor", "mar", "nor", "or", "pra", "quil", "ran", "sor", "tor", "ul", "vor", "wen", "xer", "yor", "zen"];
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const nameGen = (parts = 2) => Array.from({ length: parts }, () => pick(syllables)).join("").replace(/^./, (c) => c.toUpperCase());

async function createYouthWindow(week: number, season: number, agencyRep: number) {
  const weekInSeason = ((week - 1) % 52) + 1;
  if (weekInSeason !== 1 && weekInSeason !== 26) return;
  const exists = await prisma.youthProspect.count({ where: { season, windowWeek: weekInSeason } });
  if (exists > 0) return;

  const base = Math.max(35, Math.min(78, agencyRep + 30));
  const data = Array.from({ length: 8 }).map(() => {
    const elite = Math.random() > 0.82;
    const overall = Math.max(35, Math.min(86, base + (Math.random() - 0.5) * 10));
    const potential = Math.min(99, overall + (elite ? 18 + Math.random() * 10 : 6 + Math.random() * 12));
    return {
      name: `${nameGen(2)} ${nameGen(2)}`,
      nationality: pick(nations),
      age: 16 + Math.floor(Math.random() * 3),
      position: pick(["GK", "DF", "MF", "FW"]),
      overall,
      potential,
      morale: 55 + Math.random() * 30,
      season,
      windowWeek: weekInSeason
    };
  });

  await prisma.youthProspect.createMany({ data });
  await prisma.eventLog.create({ data: { week, category: "Youth", message: `Youth intake window opened (${data.length} prospects).` } });
}

export async function runOneWeekTick() {
  const state = await prisma.gameState.findUnique({ where: { id: 1 } });
  if (!state) return;
  const week = state.week + 1;
  const season = Math.floor((week - 1) / 52) + 1;

  const agency = await prisma.agency.findUnique({ where: { id: 1 } });
  const managedPlayers = await prisma.player.findMany({ where: { isManagedByAgent: true }, take: 60, orderBy: { overall: "desc" } });
  const programs = await prisma.supportProgram.findMany({ where: { active: true } });

  let supportCost = 0;
  for (const program of programs) {
    supportCost += program.weeklyCost;
    const player = managedPlayers.find((p) => p.id === program.playerId);
    if (!player) continue;
    const updates: Record<string, number> = {};
    if (program.type === "Training Camp") {
      updates.form = Math.min(100, player.form + 2 * program.intensity);
      updates.growthRate = player.growthRate + 0.0015;
    }
    if (program.type === "Rehab") {
      updates.injuryRisk = Math.max(1, player.injuryRisk - 0.5 * program.intensity);
      updates.injuryStatus = Math.max(0, player.injuryStatus - 1);
    }
    if (program.type === "Nutrition") updates.form = Math.min(100, player.form + 1.1 * program.intensity);
    if (program.type === "Mental Coach") updates.morale = Math.min(100, player.morale + 1.2 * program.intensity);
    if (program.type === "Analyst Pack") updates.negotiationPower = player.negotiationPower + 0.6 * program.intensity;
    await prisma.player.update({ where: { id: player.id }, data: updates as any });
  }

  const clubs = await prisma.club.findMany({
    include: {
      players: { take: 16, orderBy: { overall: "desc" } },
      stock: true
    }
  });
  const byLeague = new Map<number, typeof clubs>();
  clubs.forEach((c) => {
    if (!byLeague.has(c.leagueId)) byLeague.set(c.leagueId, []);
    byLeague.get(c.leagueId)!.push(c);
  });

  for (const [, leagueClubs] of byLeague.entries()) {
    const shuffled = [...leagueClubs].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      const home = shuffled[i];
      const away = shuffled[i + 1];
      const h = calculateTeamStrength(home, home.players);
      const a = calculateTeamStrength(away, away.players);
      const m = simulateMatch(h, a);
      const homePts = m.result === "HOME" ? 3 : m.result === "DRAW" ? 1 : 0;
      const awayPts = m.result === "AWAY" ? 3 : m.result === "DRAW" ? 1 : 0;
      await prisma.club.update({ where: { id: home.id }, data: { points: { increment: homePts }, last5Points: Math.max(0, Math.min(15, Math.round(home.last5Points * 0.75 + homePts))), morale: Math.min(100, home.morale + (homePts - 1) * 1.2) } });
      await prisma.club.update({ where: { id: away.id }, data: { points: { increment: awayPts }, last5Points: Math.max(0, Math.min(15, Math.round(away.last5Points * 0.75 + awayPts))), morale: Math.min(100, away.morale + (awayPts - 1) * 1.2) } });
    }
  }

  const sponsorships = await prisma.sponsorshipContract.findMany();
  for (const s of sponsorships) {
    if (s.remainingWeeks <= 0) continue;
    const bonus = Math.random() > 0.7 ? s.performanceBonus : 0;
    const inject = s.weeklyAmount + bonus;
    const budget = applySponsorshipToBudgets(inject);
    await prisma.club.update({ where: { id: s.clubId }, data: { cash: { increment: inject }, wageBudget: { increment: budget.wageBudget }, transferBudget: { increment: budget.transferBudget }, facilitiesLevel: { increment: budget.facilities / 1_000_000 }, sponsoredStrength: { increment: s.brandLift * 0.5 } } });
    await prisma.company.update({ where: { id: 1 }, data: { cash: { decrement: s.weeklyAmount }, brandReputation: { increment: s.brandLift * 0.1 } } });
    await prisma.sponsorshipContract.update({ where: { id: s.id }, data: { remainingWeeks: s.remainingWeeks - 1 } });
  }

  for (const c of clubs) {
    if (!c.stock) continue;
    const price = calculateStockPrice(c.stock.pricePerShare, {
      recentForm: c.last5Points / 15,
      positionDelta: (20 - c.leaguePosition) / 20,
      financialHealth: Math.max(0, Math.min(1, c.cash / (c.wageBudget + 1))),
      squadQuality: c.players.slice(0, 11).reduce((s, p) => s + p.overall, 0) / 1100,
      sponsorshipStrength: c.sponsoredStrength / 100,
      volatility: c.stock.volatility
    });
    await prisma.clubStock.update({ where: { id: c.stock.id }, data: { pricePerShare: price.nextPrice } });
    await prisma.stockPricePoint.create({ data: { clubStockId: c.stock.id, week, price: price.nextPrice, reasonLog: price.reason } });
  }

  if (agency) {
    const commissionIncome = managedPlayers.reduce((s, p) => s + p.marketValue * 0.00018, 0);
    const balance = agencyWeeklyBalance(commissionIncome, agency.weeklyCosts + supportCost, agency.debt);
    const minus = agency.cash + balance < 0;
    await prisma.agency.update({ where: { id: 1 }, data: { cash: { increment: balance }, ...(minus ? { debt: { increment: Math.abs(balance) * 0.4 }, reputation: { decrement: 1.5 } } : { reputation: { increment: 0.15 } }) } as any });
    await prisma.eventLog.create({ data: { week, category: "Agency", message: `Weekly balance ${balance >= 0 ? "+" : ""}${balance.toFixed(0)} (commission ${commissionIncome.toFixed(0)})` } });
    if (minus) {
      await prisma.supportProgram.updateMany({ where: { active: true }, data: { active: false } });
      await prisma.eventLog.create({ data: { week, category: "Agency", message: "Program dibatalkan karena cash minus." } });
    }
  }

  const sorted = await prisma.club.findMany({ orderBy: [{ leagueId: "asc" }, { points: "desc" }] });
  const positions = new Map<number, number>();
  for (const club of sorted) {
    const pos = (positions.get(club.leagueId) ?? 0) + 1;
    positions.set(club.leagueId, pos);
    await prisma.club.update({ where: { id: club.id }, data: { leaguePosition: pos } });
  }

  await createYouthWindow(week, season, agency?.reputation ?? 10);

  await prisma.eventLog.create({ data: { week, category: "Tick", message: `Week ${week} completed` } });
  await prisma.gameState.update({ where: { id: 1 }, data: { week, season } });
}
