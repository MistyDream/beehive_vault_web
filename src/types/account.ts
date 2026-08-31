import type { CurrencyCode, HouseholdId } from '~/types/household';
import type { DateString, DateTimeString, DecimalString } from '~/types/http';
import type { InstitutionId } from '~/types/institution';

export type AccountId = string;
export type BalanceId = string;
export type AccountBalance = DecimalString;

export type AccountKind =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'investment'
  | 'credit_card'
  | 'loan'
  | 'other_asset'
  | 'other_liability';

export type AccountStatus = 'active' | 'archived';

export type BalanceSource =
  | 'manual'
  | 'import'
  | 'synchronization'
  | 'reconciliation';

export interface Account {
  id: AccountId;
  householdId: HouseholdId;
  institutionId: InstitutionId | null;
  name: string;
  kind: AccountKind;
  currency: CurrencyCode;
  latestBalance: AccountBalance | null;
  balanceDate: DateString | null;
  calculatedBalance: AccountBalance;
  archivedAt: DateTimeString | null;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface AccountTotals {
  daily: AccountBalance;
  savings: AccountBalance;
  liabilities: AccountBalance;
}

export interface AccountCollection {
  items: Account[];
  totals: AccountTotals;
}

export interface AccountListFilters {
  status?: AccountStatus;
}

export interface CreateAccountRequest {
  institutionId?: InstitutionId | null;
  name: string;
  kind: AccountKind;
  currency: CurrencyCode;
  initialBalance: AccountBalance;
  balanceDate: DateString;
}

export interface UpdateAccountRequest {
  name?: string;
  kind?: AccountKind;
  institutionId?: InstitutionId;
  removeInstitution?: boolean;
}

export interface Balance {
  id: BalanceId;
  accountId: AccountId;
  amount: AccountBalance;
  balanceDate: DateString;
  source: BalanceSource;
  createdAt: DateTimeString;
}

export interface CreateBalanceRequest {
  amount: AccountBalance;
  balanceDate: DateString;
  source?: BalanceSource | null;
}

export interface UpdateBalanceRequest {
  amount?: AccountBalance;
  balanceDate?: DateString;
}
