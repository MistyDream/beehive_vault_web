import type { AccountId, AccountKind } from '~/types/account';
import type { CategoryId, CategoryKind } from '~/types/category';
import type { HouseholdId } from '~/types/household';
import type {
  DateString,
  DateTimeString,
  DecimalString,
  PaginationParams,
} from '~/types/http';

export type TransactionId = string;
export type TransactionNature = 'income' | 'expense' | 'transfer';
export type RegularTransactionNature = Exclude<TransactionNature, 'transfer'>;
export type TransactionEffect = 'standard' | 'reversal';
export type TransactionOrigin = 'manual' | 'import';

export interface AccountSummary {
  id: AccountId;
  name: string;
  kind: AccountKind;
  archived: boolean;
}

export interface CategorySummary {
  id: CategoryId;
  name: string;
  kind: CategoryKind;
  archived: boolean;
}

export interface TransactionOperation {
  operationType: 'transaction';
  id: TransactionId;
  householdId: HouseholdId;
  bookingDate: DateString;
  label: string;
  nature: RegularTransactionNature;
  amount: DecimalString;
  effect: TransactionEffect;
  economicAmount: DecimalString;
  accountAmount: DecimalString;
  account: AccountSummary;
  category: CategorySummary | null;
  origin: TransactionOrigin;
  note: string | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface TransactionListFilters extends PaginationParams {
  accountId?: AccountId;
  dateFrom?: DateString;
  dateTo?: DateString;
  nature?: TransactionNature;
  categoryId?: CategoryId;
  uncategorized?: boolean;
  source?: TransactionOrigin;
  search?: string;
}

export interface CreateTransactionRequest {
  accountId: AccountId;
  bookingDate: DateString;
  label: string;
  amount: DecimalString;
  effect: TransactionEffect;
  nature: RegularTransactionNature;
  categoryId?: CategoryId | null;
  note?: string | null;
}

export interface UpdateTransactionRequest {
  accountId?: AccountId;
  bookingDate?: DateString;
  label?: string;
  amount?: DecimalString;
  effect?: TransactionEffect;
  nature?: RegularTransactionNature;
  categoryId?: CategoryId | null;
  note?: string | null;
}
