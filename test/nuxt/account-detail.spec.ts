import { ref } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import AccountDetail from '~/components/accounts/AccountDetail.vue';
import BHCurrencyDisplay from '~/components/atoms/BHCurrencyDisplay.vue';
import type { Account, Balance } from '~/types/account';
import type { Operation } from '~/types/operation';

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

enableAutoUnmount(afterEach);

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
    amount: '14800.0000',
    balanceDate: '2026-09-01',
    source: 'reconciliation',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'balance-initial',
    accountId: account.id,
    amount: '14000.0000',
    balanceDate: '2026-08-01',
    source: 'manual',
    createdAt: '2026-08-01T08:00:00Z',
  },
];

const operations: Operation[] = [
  {
    operationType: 'transaction',
    id: 'transaction-interest',
    householdId: 'household-personal',
    bookingDate: '2026-09-04',
    label: 'Interest payment',
    nature: 'income',
    amount: '225.5000',
    effect: 'standard',
    economicAmount: '225.5000',
    accountAmount: '225.5000',
    account: {
      id: account.id,
      name: account.name,
      kind: account.kind,
      archived: false,
    },
    category: null,
    origin: 'manual',
    note: null,
    createdAt: '2026-09-04T08:00:00Z',
    updatedAt: '2026-09-04T08:00:00Z',
  },
];

describe('AccountDetail', () => {
  it('explains the current balance and lists recent account data', async () => {
    const wrapper = await mountDetail();

    expect(wrapper.get('h1').text()).toBe('Life insurance');
    expect(wrapper.text()).toContain('Beehive Bank');
    expect(wrapper.text()).toContain('accounts.kinds.investment');
    expect(wrapper.text()).toContain('accounts.detail.current_value');
    expect(wrapper.text()).toContain('accounts.detail.balance_explanation');
    expect(wrapper.text()).toContain('Interest payment');
    expect(wrapper.text()).toContain('accounts.detail.uncategorized');
    expect(wrapper.text()).toContain('accounts.detail.sources.reconciliation');
    expect(wrapper.text()).toContain('accounts.detail.sources.manual');
    expect(wrapper.get('.account-detail__back').attributes('href')).toBe(
      '/accounts',
    );
    expect(
      wrapper.get('.account-detail__all-transactions').attributes('href'),
    ).toBe('/transactions?accountId=account-investment');

    expect(
      wrapper
        .get('.account-detail__current-balance')
        .getComponent(BHCurrencyDisplay)
        .props('amount'),
    ).toBe('15025.5000');
    expect(
      wrapper
        .get('.account-detail__latest-balance')
        .getComponent(BHCurrencyDisplay)
        .props('amount'),
    ).toBe('14800.0000');
    expect(
      wrapper
        .get('.account-detail__operation-amount')
        .getComponent(BHCurrencyDisplay)
        .props(),
    ).toMatchObject({ amount: '225.5000', showSign: true });
  });

  it('uses the matching transfer movement for its label, date, and amount', async () => {
    const transfer: Operation = {
      operationType: 'transfer',
      id: 'transfer-savings',
      householdId: 'household-personal',
      bookingDate: '2026-09-03',
      amount: '450.0000',
      source: {
        transactionId: 'transaction-source',
        bookingDate: '2026-09-03',
        label: 'Transfer to checking',
        accountAmount: '-450.0000',
        account: {
          id: account.id,
          name: account.name,
          kind: account.kind,
          archived: false,
        },
        note: null,
      },
      destination: {
        transactionId: 'transaction-destination',
        bookingDate: '2026-09-04',
        label: 'Transfer received',
        accountAmount: '450.0000',
        account: {
          id: 'account-checking',
          name: 'Checking account',
          kind: 'checking',
          archived: false,
        },
        note: null,
      },
      createdAt: '2026-09-03T08:00:00Z',
      updatedAt: '2026-09-04T08:00:00Z',
    };
    const wrapper = await mountDetail({ operations: [transfer] });

    expect(wrapper.text()).toContain('Transfer to checking');
    expect(wrapper.text()).toContain('accounts.detail.transfer');
    expect(
      wrapper
        .get('.account-detail__operation-amount')
        .getComponent(BHCurrencyDisplay)
        .props('amount'),
    ).toBe('-450.0000');
  });

  it('handles an account without a declared balance or activity', async () => {
    const wrapper = await mountDetail({
      account: {
        ...account,
        latestBalance: null,
        balanceDate: null,
      },
      balances: [],
      operations: [],
      institutionName: undefined,
    });

    expect(wrapper.text()).toContain('accounts.detail.no_declared_balance');
    expect(wrapper.text()).toContain('accounts.detail.no_transactions');
    expect(wrapper.text()).toContain('accounts.detail.no_balance_history');
    expect(wrapper.text()).not.toContain('Beehive Bank');
  });
});

function mountDetail(
  overrides: Partial<{
    account: Account;
    institutionName: string | undefined;
    balances: Balance[];
    operations: Operation[];
  }> = {},
) {
  return mountSuspended(AccountDetail, {
    props: {
      account,
      institutionName: 'Beehive Bank',
      balances,
      operations,
      accountsTo: '/accounts',
      transactionsTo: '/transactions?accountId=account-investment',
      ...overrides,
    },
  });
}
