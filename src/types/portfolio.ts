export const PORTFOLIO_KINDS = ['real', 'virtual'] as const;
export type PortfolioKind = (typeof PORTFOLIO_KINDS)[number];

export type TransactionType =
  | 'buy'
  | 'sell'
  | 'dividend'
  | 'fee'
  | 'split'
  | 'deposit'
  | 'withdrawal';

export interface Portfolio {
  id: number;
  name: string;
  kind: PortfolioKind;
  currency: string;
  description: string | null;
  updated_at: string;
}

export interface Transaction {
  id: number;
  portfolio_id: number;
  stock_id: number | null;
  transaction_type: TransactionType;
  executed_at: string;
  quantity: number | null;
  unit_price: number | null;
  amount: number | null;
  fees: number;
  tax: number;
  split_from: number | null;
  split_to: number | null;
  currency: string;
  exchange_rate: number;
  notes: string | null;
}

export interface Position {
  stock_id: number;
  quantity: number;
  average_cost: number;
  total_cost: number;
  currency: string;
}

export interface CashBalance {
  currency: string;
  balance: number;
}

export interface PortfolioSummary {
  portfolio: Portfolio;
  positions: Position[];
  cash: CashBalance;
  total_invested: number;
}

export interface PerformanceReport {
  portfolio_id: number;
  currency: string;
  total_deposited: number;
  total_withdrawn: number;
  realized_pnl: number;
  dividends_received: number;
  fees_paid: number;
  taxes_paid: number;
  net_result: number;
}

export interface StockScore {
  stock_id: number;
  symbol: string;
  name: string;
  weight: number;
  global_score: number | null;
  scored_at: string | null;
}

export interface PortfolioScoring {
  portfolio_id: number;
  stock_scores: StockScore[];
  weighted_score: number | null;
}

export interface CreatePortfolioPayload {
  name: string;
  kind: PortfolioKind;
  currency?: string;
  description?: string;
}

export type UpdatePortfolioPayload = CreatePortfolioPayload;

export interface CreateTransactionPayload {
  stock_id?: number;
  transaction_type: TransactionType;
  executed_at: string;
  quantity?: number;
  unit_price?: number;
  amount?: number;
  fees?: number;
  tax?: number;
  split_from?: number;
  split_to?: number;
  currency: string;
  exchange_rate?: number;
  notes?: string;
}

export type UpdateTransactionPayload = CreateTransactionPayload;

export interface TransactionFilters {
  transaction_type?: TransactionType;
  stock_id?: number;
  from_date?: string;
  to_date?: string;
}

export interface PerformanceFilters {
  from_date?: string;
  to_date?: string;
}
