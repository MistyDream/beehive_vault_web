import type { InvestmentScore } from './score';

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
  score: InvestmentScore | null;
  updatedAt: string;
}

type sortOrder = 'ASC' | 'DESC';

export type StockFilters = {
  stock?: {
    name: sortOrder;
  };
  score?: {
    total: sortOrder;
  };
};

export interface CreateStockPayload {
  name: string;
  symbol: string;
  isin: string;
  currency: string;
  market: string;
  sector: string;
  industry: string;
  country: string;
  badges: string[];
  logo?: string;
  score?: Partial<InvestmentScore>;
}

export interface UpdateStockPayload {
  name?: string;
  currency?: string;
  market?: string;
  sector?: string;
  industry?: string;
  country?: string;
  badges?: string[];
}
