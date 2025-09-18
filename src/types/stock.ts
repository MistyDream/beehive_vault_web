export interface InvestmentScore {
  valuation: number;
  profitability: number;
  growth: number;
  solidity: number;
  shareholderReturn: number;
  total: number;
  createdAt: string;
}

export interface Stock {
  name: string;
  symbol: string;
  isin: string;
  logo: string;
  currency: string;
  market: string;
  sector: string;
  industry: string;
  country: string;
  badges: string[];
  score: InvestmentScore;
  updatedAt: string;
}
