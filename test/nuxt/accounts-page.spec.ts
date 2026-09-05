import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import AccountList from '~/components/accounts/AccountList.vue';
import AccountsPage from '~/pages/accounts/index.vue';
import type { Account, AccountCollection, AccountId } from '~/types/account';
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

const populatedAccounts: AccountCollection = {
  items: [
    createAccount({
      id: 'account-checking',
      institutionId: 'institution-beehive-bank',
      name: 'Checking account',
      kind: 'checking',
      calculatedBalance: '3240.0000',
    }),
  ],
  totals: {
    daily: '3240.0000',
    savings: '0.0000',
    liabilities: '0.0000',
  },
};

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
];

let accountsResponse = populatedAccounts;
let responseStatus = 200;
let requestBarrier: Promise<void> | undefined;

registerEndpoint('/api/households/household-personal/accounts', {
  method: 'GET',
  handler: async () => {
    await requestBarrier;
    ensureSuccessfulResponse();
    return accountsResponse;
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

enableAutoUnmount(afterEach);

describe('AccountsPage', () => {
  beforeEach(() => {
    accountsResponse = populatedAccounts;
    responseStatus = 200;
    requestBarrier = undefined;
    clearNuxtData();
  });

  it('announces loading while account data is pending', async () => {
    let releaseRequest = () => undefined;
    requestBarrier = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });

    const wrapper = await mountSuspended(AccountsPage);

    expect(wrapper.get('[role="status"]').text()).toContain('accounts.loading');

    releaseRequest();
    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountList).exists()).toBe(true);
    });
  });

  it('loads accounts and institutions with localized routes', async () => {
    const wrapper = await mountSuspended(AccountsPage);

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountList).exists()).toBe(true);
    });

    expect(wrapper.get('h1').text()).toBe('accounts.title');
    expect(wrapper.find('.net-worth-summary').exists()).toBe(false);

    const accountList = wrapper.getComponent(AccountList);
    expect(accountList.props('collection')).toEqual(populatedAccounts);
    expect(accountList.props('institutions')).toEqual(institutions);
    expect(
      (accountList.props('accountTo') as (accountId: AccountId) => string)(
        'account-checking',
      ),
    ).toBe('/accounts/account-checking');
    expect(wrapper.get('.accounts-page__add').attributes('href')).toBe(
      '/accounts/new',
    );
    expect(wrapper.get('.accounts-page__archived').attributes('href')).toBe(
      '/accounts/archived',
    );
  });

  it('explains how to start when the household has no account', async () => {
    accountsResponse = {
      items: [],
      totals: { daily: '0', savings: '0', liabilities: '0' },
    };

    const wrapper = await mountSuspended(AccountsPage);

    await vi.waitFor(() => {
      expect(wrapper.find('.accounts-page__empty').exists()).toBe(true);
    });

    expect(wrapper.get('.accounts-page__empty').text()).toContain(
      'accounts.empty.title',
    );
    expect(wrapper.findComponent(AccountList).exists()).toBe(false);
  });

  it('shows a recoverable error when account data cannot be loaded', async () => {
    responseStatus = 500;
    const wrapper = await mountSuspended(AccountsPage);

    await vi.waitFor(() => {
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    expect(wrapper.get('[role="alert"]').text()).toContain(
      'accounts.load_error_title',
    );

    responseStatus = 200;
    await wrapper.get('[role="alert"] button').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountList).exists()).toBe(true);
    });
  });
});

function ensureSuccessfulResponse() {
  if (responseStatus === 500) {
    throw createError({ statusCode: 500, statusMessage: 'Request failed' });
  }
}

function createAccount(
  overrides: Pick<Account, 'id' | 'name' | 'kind' | 'calculatedBalance'> &
    Partial<Account>,
): Account {
  return {
    householdId: 'household-personal',
    institutionId: null,
    currency: 'EUR',
    latestBalance: '0',
    balanceDate: '2026-09-04',
    archivedAt: null,
    createdAt: '2026-09-04T08:00:00Z',
    updatedAt: '2026-09-04T08:00:00Z',
    ...overrides,
  };
}
