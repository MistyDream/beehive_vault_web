import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';
import { getQuery } from 'h3';

import AccountDetail from '~/components/accounts/AccountDetail.vue';
import AccountDetailPage from '~/pages/accounts/[accountId].vue';
import type { Account, Balance } from '~/types/account';
import type { OperationPage } from '~/types/operation';
import type { Institution } from '~/types/institution';

const activeHousehold = {
  __v_isRef: true,
  value: {
    id: 'household-personal',
    name: 'Personal household',
    baseCurrency: 'EUR',
    timezone: 'Europe/Paris',
    createdAt: '2026-09-04T08:00:00Z',
    updatedAt: '2026-09-04T08:00:00Z',
  },
};

const account: Account = {
  id: 'account-investment',
  householdId: 'household-personal',
  institutionId: 'institution-beehive-bank',
  name: 'Life insurance',
  kind: 'investment',
  currency: 'EUR',
  latestBalance: '14800.0000',
  balanceDate: '2026-09-01',
  calculatedBalance: '15025.5000',
  archivedAt: null,
  createdAt: '2026-08-01T08:00:00Z',
  updatedAt: '2026-09-05T08:00:00Z',
};

const balances: Balance[] = [
  {
    id: 'balance-latest',
    accountId: account.id,
    amount: account.latestBalance ?? '0',
    balanceDate: account.balanceDate ?? '2026-09-01',
    source: 'reconciliation',
    createdAt: '2026-09-01T08:00:00Z',
  },
];

const operations: OperationPage = {
  items: [],
  page: 1,
  limit: 5,
  total: 0,
};

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
];

let responseStatus = 200;
let requestBarrier: Promise<void> | undefined;
let receivedTransactionQuery: ReturnType<typeof getQuery>;

registerEndpoint(
  '/api/households/household-personal/accounts/account-investment',
  {
    method: 'GET',
    handler: async () => {
      await requestBarrier;
      ensureSuccessfulResponse();
      return account;
    },
  },
);

registerEndpoint(
  '/api/households/household-personal/accounts/account-investment/balances',
  {
    method: 'GET',
    handler: async () => {
      await requestBarrier;
      ensureSuccessfulResponse();
      return balances;
    },
  },
);

registerEndpoint('/api/households/household-personal/transactions', {
  method: 'GET',
  handler: async (event) => {
    await requestBarrier;
    ensureSuccessfulResponse();
    receivedTransactionQuery = getQuery(event);
    return operations;
  },
});

registerEndpoint('/api/institutions', {
  method: 'GET',
  handler: async () => {
    await requestBarrier;
    ensureSuccessfulResponse();
    return institutions;
  },
});

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useActiveHousehold', () => () => ({ activeHousehold }));
mockNuxtImport('useRoute', () => () => ({
  params: { accountId: 'account-investment' },
}));
mockNuxtImport('useLocalePath', () => () => (route: unknown) => {
  if (typeof route === 'string') return route;

  const location = route as { path: string; query?: Record<string, string> };
  const query = new URLSearchParams(location.query).toString();
  return query ? `${location.path}?${query}` : location.path;
});

enableAutoUnmount(afterEach);

describe('AccountDetailPage', () => {
  beforeEach(() => {
    responseStatus = 200;
    requestBarrier = undefined;
    receivedTransactionQuery = {};
    clearNuxtData();
  });

  it('announces loading while account data is pending', async () => {
    let releaseRequest = () => undefined;
    requestBarrier = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });

    const wrapper = await mountSuspended(AccountDetailPage);

    expect(wrapper.get('[role="status"]').text()).toContain(
      'accounts.detail.loading',
    );

    releaseRequest();
    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });
  });

  it('loads the account detail resources and localized routes', async () => {
    const wrapper = await mountSuspended(AccountDetailPage);

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });

    expect(receivedTransactionQuery).toEqual({
      accountId: 'account-investment',
      page: '1',
      limit: '5',
    });
    expect(wrapper.getComponent(AccountDetail).props()).toMatchObject({
      account,
      institutionName: 'Beehive Bank',
      balances,
      operations: [],
      accountsTo: '/accounts',
      transactionsTo: '/transactions?accountId=account-investment',
    });
  });

  it('shows a recoverable error when account data cannot be loaded', async () => {
    responseStatus = 500;
    const wrapper = await mountSuspended(AccountDetailPage);

    await vi.waitFor(() => {
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    responseStatus = 200;
    await wrapper.get('[role="alert"] button').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });
  });
});

function ensureSuccessfulResponse() {
  if (responseStatus === 500) {
    throw createError({ statusCode: 500, statusMessage: 'Request failed' });
  }
}
