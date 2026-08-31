import type { CategoryId } from '~/types/category';
import type { CurrencyCode } from '~/types/household';
import type { DateString, DecimalString, MonthString } from '~/types/http';

export interface NetWorthSummary {
  currency: CurrencyCode;
  assets: DecimalString;
  liabilities: DecimalString;
  netWorth: DecimalString;
}

export interface MonthlyFlowCategory {
  categoryId: CategoryId | null;
  categoryName: string | null;
  amount: DecimalString;
  transactionCount: number;
}

export interface MonthlyFlowSection {
  total: DecimalString;
  transactionCount: number;
  categories: MonthlyFlowCategory[];
}

export interface MonthlyFlowReport {
  month: MonthString;
  dateFrom: DateString;
  dateTo: DateString;
  currency: CurrencyCode;
  income: MonthlyFlowSection;
  expenses: MonthlyFlowSection;
  netFlow: DecimalString;
}
