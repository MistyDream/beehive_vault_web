import { ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHCurrencyDisplay } from '#components';
import AccountList from '~/components/accounts/AccountList.vue';
import type { Account, AccountCollection, AccountId } from '~/types/account';
import type { Institution } from '~/types/institution';

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
];

const checkingAccount = createAccount({
  id: 'account-checking',
  institutionId: 'institution-beehive-bank',
  name: 'Checking account',
  kind: 'checking',
  calculatedBalance: '3240.0000',
});
const loanAccount = createAccount({
  id: 'account-home-loan',
  name: 'Home loan',
  kind: 'loan',
  calculatedBalance: '15740.0000',
});

const collection: AccountCollection = {
  items: [checkingAccount, loanAccount],
  totals: {
    daily: '3240.0000',
    savings: '0.0000',
    liabilities: '15740.0000',
  },
};

describe('AccountList', () => {
  it('renders non-empty financial groups with exact API totals', async () => {
    const wrapper = await mountList();
    const groups = wrapper.findAll('.account-list__group');
    const groupTotals = wrapper.findAll('.account-list__group-total');

    expect(groups).toHaveLength(2);
    expect(groups[0]?.get('h2').text()).toBe('accounts.groups.daily');
    expect(groups[1]?.get('h2').text()).toBe('accounts.groups.liabilities');
    expect(wrapper.text()).not.toContain('accounts.groups.savings');
    expect(
      groupTotals.map((total) =>
        total.getComponent(BHCurrencyDisplay).props('amount'),
      ),
    ).toEqual([collection.totals.daily, collection.totals.liabilities]);
  });

  it('links each account with its type, institution and calculated balance', async () => {
    const wrapper = await mountList();
    const rows = wrapper.findAll('.account-list__row');

    expect(rows).toHaveLength(2);
    expect(rows[0]?.attributes('href')).toBe('/accounts/account-checking');
    expect(rows[0]?.text()).toContain(checkingAccount.name);
    expect(rows[0]?.text()).toContain('accounts.kinds.checking');
    expect(rows[0]?.text()).toContain('Beehive Bank');
    expect(rows[0]?.getComponent(BHCurrencyDisplay).props('amount')).toBe(
      checkingAccount.calculatedBalance,
    );

    expect(rows[1]?.attributes('href')).toBe('/accounts/account-home-loan');
    expect(rows[1]?.text()).toContain(loanAccount.name);
    expect(rows[1]?.text()).toContain('accounts.kinds.loan');
    expect(rows[1]?.getComponent(BHCurrencyDisplay).props('amount')).toBe(
      loanAccount.calculatedBalance,
    );
  });
});

function mountList() {
  return mountSuspended(AccountList, {
    props: {
      collection,
      institutions,
      accountTo: (accountId: AccountId) => `/accounts/${accountId}`,
    },
  });
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
