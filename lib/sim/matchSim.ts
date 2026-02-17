import { Club, Player } from "@prisma/client";

export function calculateTeamStrength(club: Club, players: Player[]) {
  const xi = players.sort((a, b) => b.overall - a.overall).slice(0, 11);
  const avg = xi.reduce((s, p) => s + p.overall + p.form * 0.2 + p.morale * 0.1 - p.fatigue * 0.2, 0) / Math.max(1, xi.length);
  return avg + club.coachQuality * 8 + club.facilitiesLevel * 5 + club.morale * 0.1;
}

export function simulateMatch(homeStrength: number, awayStrength: number) {
  const homeExpected = Math.max(0.2, (homeStrength / (awayStrength + 1)) * 1.4);
  const awayExpected = Math.max(0.2, (awayStrength / (homeStrength + 1)) * 1.1);
  const homeGoals = poisson(homeExpected);
  const awayGoals = poisson(awayExpected);
  const result = homeGoals > awayGoals ? "HOME" : awayGoals > homeGoals ? "AWAY" : "DRAW";
  return { homeGoals, awayGoals, result };
}

function poisson(lambda: number) {
  const l = Math.exp(-lambda);
  let p = 1;
  let k = 0;
  do {
    k++;
    p *= Math.random();
  } while (p > l);
  return k - 1;
}
