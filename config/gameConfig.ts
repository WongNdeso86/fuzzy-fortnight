export const gameConfig = {
  growthRateBase: 0.03,
  injuryRateBase: 0.04,
  sponsorshipImpact: {
    wageBudgetWeight: 0.35,
    transferBudgetWeight: 0.35,
    facilitiesWeight: 0.2,
    reserveWeight: 0.1
  },
  stockWeights: {
    recentForm: 0.3,
    positionDelta: 0.2,
    financialHealth: 0.2,
    squadQuality: 0.15,
    sponsorship: 0.1,
    newsShock: 0.05
  },
  aiAggressiveness: 0.55,
  president: {
    ownershipThreshold: 0.51,
    minCashReserve: 2_000_000,
    minReputation: 40
  },
  debtInterestRate: 0.015
};
