import { gameConfig } from "@/config/gameConfig";

type Inputs = {
  recentForm: number;
  positionDelta: number;
  financialHealth: number;
  squadQuality: number;
  sponsorshipStrength: number;
  volatility: number;
};

export function calculateStockPrice(currentPrice: number, input: Inputs) {
  const w = gameConfig.stockWeights;
  const shock = (Math.random() - 0.5) * 2;
  const score =
    input.recentForm * w.recentForm +
    input.positionDelta * w.positionDelta +
    input.financialHealth * w.financialHealth +
    input.squadQuality * w.squadQuality +
    input.sponsorshipStrength * w.sponsorship +
    shock * w.newsShock;

  const pctMove = Math.max(-0.25, Math.min(0.25, score * 0.02 * input.volatility));
  return {
    nextPrice: Math.max(0.5, currentPrice * (1 + pctMove)),
    reason: `form=${input.recentForm.toFixed(2)} pos=${input.positionDelta.toFixed(2)} fin=${input.financialHealth.toFixed(2)} squad=${input.squadQuality.toFixed(2)} sponsor=${input.sponsorshipStrength.toFixed(2)} shock=${shock.toFixed(2)}`
  };
}
