import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';
import { getQuery } from 'h3';

import AccountList from '~/components/accounts/AccountList.vue';
import AccountsPage from '~/pages/accounts/index.vue';
import ArchivedAccountsPage from '~/pages/accounts/archived.vue';
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
let receivedQuery: ReturnType<typeof getQuery>;

registerEndpoint('/api/households/household-personal/accounts', {
  method: 'GET',
  handler: async (event) => {
    await requestBarrier;
    ensureSuccessfulResponse();
    receivedQuery = getQuery(event);
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

beforeEach(() => {
  accountsResponse = populatedAccounts;
  responseStatus = 200;
  requestBarrier = undefined;
  receivedQuery = {};
  clearNuxtData();
});

describe('AccountsPage', () => {
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
    expect(receivedQuery).toEqual({ status: 'active' });
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

describe('ArchivedAccountsPage', () => {
  beforeEach(() => {
    accountsResponse = {
      items: [
        createAccount({
          id: 'account-closed',
          name: 'Closed account',
          kind: 'checking',
          calculatedBalance: '0.0000',
          archivedAt: '2026-09-13T08:00:00Z',
        }),
      ],
      totals: { daily: '0', savings: '0', liabilities: '0' },
    };
  });

  it('requests archived accounts and keeps them separate from active totals and actions', async () => {
    const wrapper = await mountSuspended(ArchivedAccountsPage, {
      attachTo: document.body,
    });
    await vi.waitFor(() =>
      expect(wrapper.findComponent(AccountList).exists()).toBe(true),
    );

    expect(receivedQuery).toEqual({ status: 'archived' });
    expect(wrapper.get('h1').text()).toBe('accounts.archive_list.title');
    expect(wrapper.text()).toContain('Closed account');
    expect(wrapper.getComponent(AccountList).props('collection')).toEqual(
      accountsResponse,
    );
    expect(wrapper.get('.account-list__row').attributes('href')).toBe(
      '/accounts/account-closed',
    );
    expect(wrapper.get('.accounts-page__archived').attributes('href')).toBe(
      '/accounts',
    );
    expect(wrapper.find('.account-list__group-total').exists()).toBe(false);
    expect(wrapper.find('.accounts-page__add').exists()).toBe(false);
    expect(wrapper.find('button').exists()).toBe(false);
    expect(document.activeElement).toBe(wrapper.get('h1').element);
  });

  it('explains the empty archive without offering account creation', async () => {
    accountsResponse = {
      items: [],
      totals: { daily: '0', savings: '0', liabilities: '0' },
    };
    const wrapper = await mountSuspended(ArchivedAccountsPage);
    await vi.waitFor(() =>
      expect(wrapper.find('.accounts-page__empty').exists()).toBe(true),
    );

    expect(wrapper.get('.accounts-page__empty').text()).toContain(
      'accounts.archive_list.empty.title',
    );
    expect(wrapper.findComponent(AccountList).exists()).toBe(false);
    expect(wrapper.find('[href="/accounts/new"]').exists()).toBe(false);
  });

  it('announces loading and recovers from an archived collection error', async () => {
    let releaseRequest = () => undefined;
    requestBarrier = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });
    responseStatus = 500;
    const wrapper = await mountSuspended(ArchivedAccountsPage);
    expect(wrapper.get('[role="status"]').text()).toContain(
      'accounts.archive_list.loading',
    );
    releaseRequest();
    await vi.waitFor(() =>
      expect(wrapper.find('[role="alert"]').exists()).toBe(true),
    );
    expect(wrapper.get('[role="alert"]').text()).toContain(
      'accounts.archive_list.load_error_title',
    );
    responseStatus = 200;
    await wrapper.get('[role="alert"] button').trigger('click');
    await vi.waitFor(() => expect(wrapper.text()).toContain('Closed account'));
    expect(receivedQuery).toEqual({ status: 'archived' });
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
