import { gameConfig } from "@/config/gameConfig";

type Inputs = {
  recentForm: number;
  positionScore: number;
  financialHealth: number;
  squadQuality: number;
  sponsorshipStrength: number;
  volatility: number;
  wagePressure: number;
};

export function calculateStockPrice(currentPrice: number, input: Inputs) {
  const w = gameConfig.stockWeights;
  const shock = (Math.random() - 0.5) * 2;

  const score =
    input.recentForm * w.recentForm +
    input.positionScore * w.positionDelta +
    input.financialHealth * w.financialHealth +
    input.squadQuality * w.squadQuality +
    input.sponsorshipStrength * w.sponsorship +
    shock * w.newsShock -
    input.wagePressure * 0.12;

  const pctMove = Math.max(-0.18, Math.min(0.18, score * 0.018 * input.volatility));
  return {
    nextPrice: Math.max(0.5, currentPrice * (1 + pctMove)),
    reason: `form=${input.recentForm.toFixed(2)} pos=${input.positionScore.toFixed(2)} fin=${input.financialHealth.toFixed(2)} squad=${input.squadQuality.toFixed(2)} sponsor=${input.sponsorshipStrength.toFixed(2)} wageP=${input.wagePressure.toFixed(2)} shock=${shock.toFixed(2)} move=${(pctMove * 100).toFixed(2)}%`
  };
}
