import { describe, expect, it } from 'vitest';

import { getAccountComposition } from '~/utils/get-account-composition';
import type { Account, AccountCollection, AccountKind } from '~/types/account';

describe('getAccountComposition utility', () => {
  it('classifies every account kind by financial role', () => {
    const collection: AccountCollection = {
      items: [
        createAccount('checking', 'Checking account'),
        createAccount('cash', 'Wallet'),
        createAccount('savings', 'Savings account'),
        createAccount('investment', 'Brokerage account'),
        createAccount('other_asset', 'Other asset'),
        createAccount('credit_card', 'Credit card'),
        createAccount('loan', 'Home loan'),
        createAccount('other_liability', 'Other liability'),
      ],
      totals: {
        daily: '3240.00',
        savings: '55180.00',
        liabilities: '15740.00',
      },
    };

    const groups = getAccountComposition(collection);

    expect(groups.map(({ key }) => key)).toEqual([
      'daily',
      'savings',
      'liabilities',
    ]);
    expect(groups[0]?.accounts).toHaveLength(2);
    expect(groups[1]?.accounts).toHaveLength(3);
    expect(groups[2]?.accounts).toHaveLength(3);
  });

  it('uses API totals unchanged and omits empty groups', () => {
    const collection: AccountCollection = {
      items: [createAccount('investment', 'Brokerage account')],
      totals: {
        daily: '0.0000',
        savings: '12345678901234567890.1234',
        liabilities: '0.0000',
      },
    };

    expect(getAccountComposition(collection)).toEqual([
      {
        key: 'savings',
        total: '12345678901234567890.1234',
        accounts: collection.items,
      },
    ]);
  });
});

function createAccount(kind: AccountKind, name: string): Account {
  return {
    id: `account-${kind}`,
    householdId: 'household-personal',
    institutionId: null,
    name,
    kind,
    currency: 'EUR',
    latestBalance: '0',
    balanceDate: '2026-09-04',
    calculatedBalance: '0',
    archivedAt: null,
    createdAt: '2026-09-04T08:00:00Z',
    updatedAt: '2026-09-04T08:00:00Z',
  };
}
