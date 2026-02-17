import { gameConfig } from "@/config/gameConfig";

export function applySponsorshipToBudgets(amount: number) {
  return {
    wageBudget: amount * gameConfig.sponsorshipImpact.wageBudgetWeight,
    transferBudget: amount * gameConfig.sponsorshipImpact.transferBudgetWeight,
    facilities: amount * gameConfig.sponsorshipImpact.facilitiesWeight,
    reserve: amount * gameConfig.sponsorshipImpact.reserveWeight
  };
}

export function agencyWeeklyBalance(income: number, costs: number, debt: number) {
  const debtCost = debt > 0 ? debt * gameConfig.debtInterestRate : 0;
  return income - costs - debtCost;
}
