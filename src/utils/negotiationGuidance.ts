export function computeSystemGuidance(params: {
  marketLow: number;
  marketHigh: number;
  marketMedian: number;
}): number {
  const { marketLow, marketHigh, marketMedian } = params;
  const base = marketMedian;
  if (!Number.isFinite(base)) return marketMedian;
  return Math.min(Math.max(base, marketLow), marketHigh);
}

