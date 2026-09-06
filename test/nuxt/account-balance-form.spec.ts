import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';

import AccountBalanceForm from '~/components/accounts/AccountBalanceForm.vue';
import { ApiError } from '~/types/api';
import type { Account, Balance } from '~/types/account';

const createBalance = vi.fn();

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useAccountApi', () => () => ({ createBalance }));

enableAutoUnmount(afterEach);

const account: Account = {
  id: 'account-checking',
  householdId: 'household-personal',
  institutionId: 'institution-beehive-bank',
  name: 'Checking account',
  kind: 'checking',
  currency: 'EUR',
  latestBalance: '1200.0000',
  balanceDate: '2026-09-01',
  calculatedBalance: '1240.0000',
  archivedAt: null,
  createdAt: '2026-08-01T08:00:00Z',
  updatedAt: '2026-09-05T08:00:00Z',
};

const createdBalance: Balance = {
  id: 'balance-reconciliation',
  accountId: account.id,
  amount: '1350.5000',
  balanceDate: '2026-09-06',
  source: 'reconciliation',
  createdAt: '2026-09-06T08:00:00Z',
};

describe('AccountBalanceForm', () => {
  beforeEach(() => {
    createBalance.mockReset();
  });

  it('prefills the household date and displays the account currency', async () => {
    const wrapper = await mountForm();

    expect(wrapper.get('#account-balance-date').element).toHaveProperty(
      'value',
      '2026-09-06',
    );
    expect(wrapper.get('#account-balance-date').attributes('max')).toBe(
      '2026-09-06',
    );
    expect(wrapper.get('#account-balance-currency').element).toHaveProperty(
      'value',
      'EUR',
    );
    expect(
      wrapper.get('#account-balance-amount + .bh-text-input__suffix').text(),
    ).toBe('€');
  });

  it('adds a normalized reconciliation balance without monetary conversion', async () => {
    createBalance.mockResolvedValue(createdBalance);
    const wrapper = await mountForm();

    await wrapper.get('#account-balance-amount').setValue('1350,5000');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(createBalance).toHaveBeenCalledWith(
      account.householdId,
      account.id,
      {
        amount: '1350.5000',
        balanceDate: '2026-09-06',
        source: 'reconciliation',
      },
    );
    expect(wrapper.emitted('saved')).toEqual([[createdBalance]]);
  });

  it('rejects an invalid decimal and focuses the amount field', async () => {
    const focus = vi
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);
    const wrapper = await mountForm();

    await wrapper.get('#account-balance-amount').setValue('1,350.50');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(createBalance).not.toHaveBeenCalled();
    expect(wrapper.get('#account-balance-amount-error').text()).toBe(
      'accounts.balance.error.amount_invalid',
    );
    expect(focus.mock.instances.at(-1)).toBe(
      wrapper.get('#account-balance-amount').element,
    );

    focus.mockRestore();
  });

  it('requires a date strictly after the latest balance and not in the future', async () => {
    const wrapper = await mountForm();

    await wrapper.get('#account-balance-amount').setValue('1350');
    await wrapper.get('#account-balance-date').setValue('2026-09-01');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.get('#account-balance-date-error').text()).toBe(
      'accounts.balance.error.date_not_after_latest',
    );

    await wrapper.get('#account-balance-date').setValue('2026-09-07');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.get('#account-balance-date-error').text()).toBe(
      'accounts.balance.error.date_future',
    );
    expect(createBalance).not.toHaveBeenCalled();
  });

  it('maps stable API date codes without displaying API details', async () => {
    createBalance.mockRejectedValue(
      new ApiError({
        type: 'urn:beehive-vault:problem:validation-error',
        title: 'Request validation failed',
        status: 422,
        code: 'validation_error',
        detail: 'Untranslated API detail',
        errors: [
          {
            location: 'body',
            pointer: '#/balanceDate',
            code: 'balance_date_not_after_latest',
            detail: 'Untranslated field detail',
          },
        ],
      }),
    );
    const wrapper = await mountForm();

    await wrapper.get('#account-balance-amount').setValue('1350');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('#account-balance-date-error').text()).toBe(
      'accounts.balance.error.date_not_after_latest',
    );
    expect(wrapper.text()).not.toContain('Untranslated');
  });

  it('emits cancellation without adding a balance', async () => {
    const wrapper = await mountForm();

    await wrapper.get('button[type="button"]').trigger('click');

    expect(createBalance).not.toHaveBeenCalled();
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});

function mountForm() {
  return mountSuspended(AccountBalanceForm, {
    props: {
      account,
      currentDate: '2026-09-06',
    },
  });
}
