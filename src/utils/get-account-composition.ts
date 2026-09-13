import type {
  Account,
  AccountCollection,
  AccountBalance,
} from '~/types/account';
import {
  ACCOUNT_COMPOSITION_BY_KIND,
  ACCOUNT_COMPOSITION_KEYS,
  type AccountCompositionKey,
} from '~/constants/account';

export type { AccountCompositionKey } from '~/constants/account';

export interface AccountCompositionGroup {
  key: AccountCompositionKey;
  total: AccountBalance;
  accounts: Account[];
}

export function getAccountComposition(
  collection: AccountCollection,
): AccountCompositionGroup[] {
  const accountsByGroup: Record<AccountCompositionKey, Account[]> = {
    daily: [],
    savings: [],
    liabilities: [],
  };

  for (const account of collection.items) {
    accountsByGroup[ACCOUNT_COMPOSITION_BY_KIND[account.kind]].push(account);
  }

  return ACCOUNT_COMPOSITION_KEYS.flatMap((key) => {
    const accounts = accountsByGroup[key];

    return accounts.length > 0
      ? [{ key, total: collection.totals[key], accounts }]
      : [];
  });
}
