import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { getQuery, readBody, setResponseStatus } from 'h3';

import { useAccountApi } from '~/composables/useAccountApi';
import type {
  Account,
  AccountCollection,
  Balance,
  CreateAccountRequest,
  CreateBalanceRequest,
  UpdateAccountRequest,
} from '~/types/account';

const collection: AccountCollection = {
  items: [],
  totals: {
    daily: '0',
    savings: '0',
    liabilities: '0',
  },
};

let receivedFilters: ReturnType<typeof getQuery>;
registerEndpoint('/api/households/household-personal/accounts', {
  method: 'GET',
  handler: (event) => {
    receivedFilters = getQuery(event);
    return collection;
  },
});

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
let receivedUpdateRequest: unknown;
let archiveRequestCount = 0;
let restoreRequestCount = 0;

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking',
  {
    method: 'DELETE',
    handler: (event) => {
      archiveRequestCount += 1;
      setResponseStatus(event, 204);
      return null;
    },
  },
);

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking/restore',
  {
    method: 'POST',
    handler: () => {
      restoreRequestCount += 1;
      return createdAccount;
    },
  },
);

registerEndpoint('/api/households/household-personal/accounts', {
  method: 'POST',
  handler: async (event) => {
    receivedCreateRequest = await readBody(event);
    return createdAccount;
  },
});

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking',
  { method: 'GET', handler: () => createdAccount },
);

const updateRequest: UpdateAccountRequest = {
  name: 'Everyday account',
  kind: 'checking',
  removeInstitution: true,
};
const updatedAccount: Account = {
  ...createdAccount,
  institutionId: null,
  name: 'Everyday account',
};

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking',
  {
    method: 'PATCH',
    handler: async (event) => {
      receivedUpdateRequest = await readBody(event);
      return updatedAccount;
    },
  },
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

const createBalanceRequest: CreateBalanceRequest = {
  amount: '1350.5000',
  balanceDate: '2026-09-06',
  source: 'reconciliation',
};

const createdBalance: Balance = {
  id: 'balance-reconciliation',
  accountId: createdAccount.id,
  amount: createBalanceRequest.amount,
  balanceDate: createBalanceRequest.balanceDate,
  source: 'reconciliation',
  createdAt: '2026-09-06T08:00:00Z',
};

let receivedCreateBalanceRequest: unknown;

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking/balances',
  () => balances,
);

registerEndpoint(
  '/api/households/household-personal/accounts/account-checking/balances',
  {
    method: 'POST',
    handler: async (event) => {
      receivedCreateBalanceRequest = await readBody(event);
      return createdBalance;
    },
  },
);

describe('useAccountApi', () => {
  it('loads the active accounts for a household', async () => {
    const result = await useAccountApi().list('household-personal');

    expect(result).toEqual(collection);
    expect(receivedFilters).toEqual({});
  });

  it('selects the archived collection explicitly', async () => {
    await expect(
      useAccountApi().list('household-personal', { status: 'archived' }),
    ).resolves.toEqual(collection);
    expect(receivedFilters).toEqual({ status: 'archived' });
  });

  it('archives an account with DELETE and accepts an empty response', async () => {
    await expect(
      useAccountApi().archive('household-personal', 'account-checking'),
    ).resolves.toBeUndefined();
    expect(archiveRequestCount).toBe(1);
  });

  it('restores an account with POST and returns the active account', async () => {
    await expect(
      useAccountApi().restore('household-personal', 'account-checking'),
    ).resolves.toEqual(createdAccount);
    expect(restoreRequestCount).toBe(1);
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

  it('updates an account with the PATCH contract', async () => {
    const result = await useAccountApi().update(
      'household-personal',
      'account-checking',
      updateRequest,
    );

    expect(receivedUpdateRequest).toEqual(updateRequest);
    expect(result).toEqual(updatedAccount);
  });

  it('adds a reconciliation balance without converting its amount', async () => {
    const result = await useAccountApi().createBalance(
      'household-personal',
      'account-checking',
      createBalanceRequest,
    );

    expect(receivedCreateBalanceRequest).toEqual(createBalanceRequest);
    expect(result).toEqual(createdBalance);
  });
});
