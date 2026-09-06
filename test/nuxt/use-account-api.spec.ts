import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { readBody } from 'h3';

import { useAccountApi } from '~/composables/useAccountApi';
import type {
  Account,
  AccountCollection,
  Balance,
  CreateAccountRequest,
} from '~/types/account';

const collection: AccountCollection = {
  items: [],
  totals: {
    daily: '0',
    savings: '0',
    liabilities: '0',
  },
};

registerEndpoint(
  '/api/households/household-personal/accounts',
  () => collection,
);

const createRequest: CreateAccountRequest = {
  institutionId: 'institution-beehive-bank',
  name: 'Checking account',
  kind: 'checking',
  currency: 'EUR',
  initialBalance: '1200.0000',
  balanceDate: '2026-09-05',
};

const createdAccount: Account = {
  id: 'account-checking',
  householdId: 'household-personal',
  institutionId: createRequest.institutionId ?? null,
  name: createRequest.name,
  kind: createRequest.kind,
  currency: createRequest.currency,
  latestBalance: createRequest.initialBalance,
  balanceDate: createRequest.balanceDate,
  calculatedBalance: createRequest.initialBalance,
  archivedAt: null,
  createdAt: '2026-09-05T08:00:00Z',
  updatedAt: '2026-09-05T08:00:00Z',
};

let receivedCreateRequest: unknown;

registerEndpoint('/api/households/household-personal/accounts', {
  method: 'POST',
  handler: async (event) => {
    receivedCreateRequest = await readBody(event);
    return createdAccount;
  },
});

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking',
  () => createdAccount,
);

const balances: Balance[] = [
  {
    id: 'balance-initial',
    accountId: createdAccount.id,
    amount: '1200.0000',
    balanceDate: '2026-09-05',
    source: 'manual',
    createdAt: '2026-09-05T08:00:00Z',
  },
];

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking/balances',
  () => balances,
);

describe('useAccountApi', () => {
  it('loads the active accounts for a household', async () => {
    const result = await useAccountApi().list('household-personal');

    expect(result).toEqual(collection);
  });

  it('creates an account with its initial balance', async () => {
    const result = await useAccountApi().create(
      'household-personal',
      createRequest,
    );

    expect(receivedCreateRequest).toEqual(createRequest);
    expect(result).toEqual(createdAccount);
  });

  it('loads one account and its balance history', async () => {
    const api = useAccountApi();

    await expect(
      api.get('household-personal', 'account-checking'),
    ).resolves.toEqual(createdAccount);
    await expect(
      api.listBalances('household-personal', 'account-checking'),
    ).resolves.toEqual(balances);
  });
});
