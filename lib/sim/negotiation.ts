export function negotiateOffer(baseFee: number, negotiationPower: number, aiAggressiveness: number) {
  const swing = 1 + negotiationPower * 0.01 + (Math.random() - 0.5) * aiAggressiveness * 0.2;
  const transferFee = Math.max(baseFee * 0.8, baseFee * swing);
  return {
    transferFee,
    wage: transferFee * 0.0018,
    duration: 3 + Math.floor(Math.random() * 3),
    bonuses: transferFee * 0.05,
    releaseClause: transferFee * 1.8,
    agentCommission: transferFee * 0.08
  };
}
