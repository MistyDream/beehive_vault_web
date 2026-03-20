// Generic metric score shape aligned with backend MetricScoreView
export interface MetricScore {
  score: number;
  historicScore: number;
  sectorScore: number;
  boundsScore?: number;
  trendScore?: number;
}

export interface ValuationScore {
  perScore: MetricScore;
  evEbitdaScore: MetricScore;
  pfcfScore: MetricScore;
  pegScore: MetricScore;
  psScore: MetricScore;
  pbScore: MetricScore;
}

export interface SolidityScore {
  interestCoverageScore: MetricScore;
  debtToEbitdaScore: MetricScore;
  quickRatioScore: MetricScore;
  cashToDebtScore: MetricScore;
  equityToAssetScore: MetricScore;
  zScore: number;
  fScore: number;
}

export interface ShareholderReturnScore {
  dividendYieldScore: MetricScore;
  buybackYieldScore: MetricScore;
  dividendGrowthScore: MetricScore;
  payoutRatioScore: MetricScore;
  netShareholderYieldScore: MetricScore;
}

export interface GrowthScore {
  revenueScore: MetricScore;
  ebitdaScore: MetricScore;
  epsScore: MetricScore;
  fcfScore: MetricScore;
  bookValueScore: MetricScore;
}

export interface ProfitabilityScore {
  roicScore: MetricScore;
  opMarginScore: MetricScore;
  fcfMarginScore: MetricScore;
  roaScore: MetricScore;
  netMarginScore: MetricScore;
}

export interface InvestmentScore {
  valuation: number;
  profitability: number;
  growth: number;
  solidity: number;
  shareholderReturn: number;
  total: number;
  createdAt: string;
  valuationScore: ValuationScore;
  solidityScore: SolidityScore;
  shareholderReturnScore: ShareholderReturnScore;
  growthScore: GrowthScore;
  profitabilityScore: ProfitabilityScore;
}
