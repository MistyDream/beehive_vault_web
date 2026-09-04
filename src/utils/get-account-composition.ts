import type {
  Account,
  AccountCollection,
  AccountKind,
  AccountBalance,
} from '~/types/account';

export type AccountCompositionKey = 'daily' | 'savings' | 'liabilities';

export interface AccountCompositionGroup {
  key: AccountCompositionKey;
  total: AccountBalance;
  accounts: Account[];
}

const GROUP_BY_ACCOUNT_KIND: Record<AccountKind, AccountCompositionKey> = {
  checking: 'daily',
  cash: 'daily',
  savings: 'savings',
  investment: 'savings',
  other_asset: 'savings',
  credit_card: 'liabilities',
  loan: 'liabilities',
  other_liability: 'liabilities',
};

export function getAccountComposition(
  collection: AccountCollection,
): AccountCompositionGroup[] {
  const accountsByGroup: Record<AccountCompositionKey, Account[]> = {
    daily: [],
    savings: [],
    liabilities: [],
  };

  for (const account of collection.items) {
    accountsByGroup[GROUP_BY_ACCOUNT_KIND[account.kind]].push(account);
  }

  return (Object.keys(accountsByGroup) as AccountCompositionKey[]).flatMap(
    (key) => {
      const accounts = accountsByGroup[key];

      return accounts.length > 0
        ? [{ key, total: collection.totals[key], accounts }]
        : [];
    },
  );
}
