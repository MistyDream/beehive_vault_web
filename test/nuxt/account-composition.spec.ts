import { ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHCurrencyDisplay } from '#components';
import AccountComposition from '~/components/overview/AccountComposition.vue';
import type { Account, AccountCollection } from '~/types/account';

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

const checkingAccount = createAccount(
  'account-checking',
  'Checking account',
  'checking',
);
const creditCardAccount = createAccount(
  'account-credit-card',
  'Credit card',
  'credit_card',
);

describe('AccountComposition', () => {
  it('renders labelled non-empty groups with exact API totals', async () => {
    const collection: AccountCollection = {
      items: [checkingAccount, creditCardAccount],
      totals: {
        daily: '3240.00',
        savings: '0.00',
        liabilities: '15740.00',
      },
    };
    const wrapper = await mountComposition(collection);
    const section = wrapper.get('section');
    const heading = wrapper.get('h2');
    const rows = wrapper.findAll('.account-composition__row');
    const amounts = wrapper.findAllComponents(BHCurrencyDisplay);

    expect(section.attributes('aria-labelledby')).toBe(
      heading.attributes('id'),
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]?.text()).toContain('overview.composition.daily');
    expect(rows[0]?.text()).toContain(checkingAccount.name);
    expect(rows[1]?.text()).toContain('overview.composition.liabilities');
    expect(amounts.map((amount) => amount.props('amount'))).toEqual([
      collection.totals.daily,
      collection.totals.liabilities,
    ]);
    expect(
      wrapper.get('.account-composition__all-link').attributes('href'),
    ).toBe('/accounts');
  });

  it('explains when the household has no account', async () => {
    const wrapper = await mountComposition({
      items: [],
      totals: { daily: '0', savings: '0', liabilities: '0' },
    });

    expect(wrapper.get('.account-composition__empty').text()).toBe(
      'overview.composition.empty',
    );
    expect(wrapper.find('.account-composition__row').exists()).toBe(false);
  });
});

function mountComposition(collection: AccountCollection) {
  return mountSuspended(AccountComposition, {
    props: {
      collection,
      currency: 'EUR',
      accountsTo: '/accounts',
    },
  });
}

function createAccount(
  id: string,
  name: string,
  kind: Account['kind'],
): Account {
  return {
    id,
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
