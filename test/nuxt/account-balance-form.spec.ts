import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';

import AccountBalanceForm from '~/components/accounts/AccountBalanceForm.vue';
import { ApiError } from '~/types/api';
import type { Account, Balance } from '~/types/account';

const createBalance = vi.fn();
const updateBalance = vi.fn();

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useAccountApi', () => () => ({ createBalance, updateBalance }));

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

const historicalBalance: Balance = {
  ...createdBalance,
  id: 'balance-initial',
  amount: '1000.0000',
  balanceDate: '2026-08-01',
  source: 'manual',
};

describe('AccountBalanceForm', () => {
  beforeEach(() => {
    createBalance.mockReset();
    updateBalance.mockReset();
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

  it('patches only the date of an older balance and ignores equivalent decimal formatting', async () => {
    const wrapper = await mountForm(historicalBalance);
    const corrected = { ...historicalBalance, balanceDate: '2026-08-02' };
    updateBalance.mockResolvedValue(corrected);
    expect(wrapper.get('#account-balance-amount').element).toHaveProperty(
      'value',
      '1000.0000',
    );
    expect(wrapper.get('#account-balance-date').element).toHaveProperty(
      'value',
      '2026-08-01',
    );
    expect(wrapper.get('[type="submit"]').attributes('disabled')).toBeDefined();

    await wrapper.get('#account-balance-amount').setValue('01000,0');
    await wrapper.get('form').trigger('submit');
    expect(updateBalance).not.toHaveBeenCalled();

    await wrapper.get('#account-balance-date').setValue('2026-08-02');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(updateBalance).toHaveBeenCalledWith(
      account.householdId,
      account.id,
      historicalBalance.id,
      {
        balanceDate: '2026-08-02',
      },
    );
    expect(createBalance).not.toHaveBeenCalled();
    expect(wrapper.emitted('saved')).toEqual([[corrected]]);
  });

  it('patches only an edited amount without losing precision or replacing its source', async () => {
    const wrapper = await mountForm(historicalBalance);
    const corrected = { ...historicalBalance, amount: '9007199254740991.1234' };
    updateBalance.mockResolvedValue(corrected);

    await wrapper
      .get('#account-balance-amount')
      .setValue('9007199254740991,1234');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(updateBalance).toHaveBeenCalledWith(
      account.householdId,
      account.id,
      historicalBalance.id,
      {
        amount: '9007199254740991.1234',
      },
    );
    expect(wrapper.emitted('saved')).toEqual([[corrected]]);
  });

  it('rejects a future correction date and retains the edited values on a date conflict', async () => {
    const wrapper = await mountForm(historicalBalance);
    updateBalance.mockRejectedValue(
      new ApiError({
        type: 'urn:beehive-vault:problem:duplicate-balance-date',
        title: 'Untranslated API title',
        status: 409,
        code: 'duplicate_balance_date',
      }),
    );

    await wrapper.get('#account-balance-amount').setValue('1250,25');
    await wrapper.get('#account-balance-date').setValue('2026-09-07');
    await wrapper.get('form').trigger('submit');
    expect(wrapper.get('#account-balance-date-error').text()).toBe(
      'accounts.balance.error.date_future',
    );
    expect(updateBalance).not.toHaveBeenCalled();

    await wrapper.get('#account-balance-date').setValue('2026-09-01');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('#account-balance-date-error').text()).toBe(
      'accounts.balance.error.duplicate_date',
    );
    expect(wrapper.get('#account-balance-amount').element).toHaveProperty(
      'value',
      '1250,25',
    );
    expect(wrapper.get('#account-balance-date').element).toHaveProperty(
      'value',
      '2026-09-01',
    );
    expect(
      wrapper.get('[type="submit"]').attributes('disabled'),
    ).toBeUndefined();
    expect(wrapper.text()).not.toContain('Untranslated');
    expect(wrapper.emitted('saved')).toBeUndefined();
  });
});

function mountForm(balanceToCorrect?: Balance) {
  return mountSuspended(AccountBalanceForm, {
    props: {
      account,
      currentDate: '2026-09-06',
      balanceToCorrect,
    },
  });
}
