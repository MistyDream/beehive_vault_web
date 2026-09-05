import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';

import AccountForm from '~/components/accounts/AccountForm.vue';
import { ApiError } from '~/types/api';
import type { Account } from '~/types/account';
import type { Household } from '~/types/household';
import type { Institution } from '~/types/institution';

const create = vi.fn();

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useAccountApi', () => () => ({ create }));

enableAutoUnmount(afterEach);

const household: Household = {
  id: 'household-personal',
  name: 'Personal household',
  baseCurrency: 'EUR',
  timezone: 'Europe/Paris',
  createdAt: '2026-09-04T08:00:00Z',
  updatedAt: '2026-09-04T08:00:00Z',
};

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
];

const createdAccount: Account = {
  id: 'account-checking',
  householdId: household.id,
  institutionId: institutions[0]?.id ?? null,
  name: 'Checking account',
  kind: 'checking',
  currency: 'EUR',
  latestBalance: '1200.5000',
  balanceDate: '2026-09-05',
  calculatedBalance: '1200.5000',
  archivedAt: null,
  createdAt: '2026-09-05T08:00:00Z',
  updatedAt: '2026-09-05T08:00:00Z',
};

describe('AccountForm', () => {
  beforeEach(() => {
    create.mockReset();
  });

  it('prefills the household currency and current household date', async () => {
    const wrapper = await mountForm();

    expect(
      wrapper.get('#account-initial-balance + .bh-text-input__suffix').text(),
    ).toBe('€');
    expect(wrapper.get('#account-currency').element).toHaveProperty(
      'value',
      'EUR',
    );
    expect(wrapper.get('#account-balance-date').element).toHaveProperty(
      'value',
      '2026-09-05',
    );
    expect(wrapper.get('#account-balance-date').attributes('max')).toBe(
      '2026-09-05',
    );
  });

  it('creates an account with normalized values and no monetary conversion', async () => {
    create.mockResolvedValue(createdAccount);
    const wrapper = await mountForm();

    await wrapper.get('#account-name').setValue('  Checking account  ');
    await wrapper.get('#account-kind').setValue('checking');
    await wrapper
      .get('#account-institution')
      .setValue('institution-beehive-bank');
    await wrapper.get('#account-initial-balance').setValue('1200,5000');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(create).toHaveBeenCalledWith(household.id, {
      institutionId: 'institution-beehive-bank',
      name: 'Checking account',
      kind: 'checking',
      currency: 'EUR',
      initialBalance: '1200.5000',
      balanceDate: '2026-09-05',
    });
    expect(wrapper.emitted('created')).toEqual([[createdAccount]]);
  });

  it('prevents submission and focuses the first invalid field', async () => {
    const focus = vi
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);
    const wrapper = await mountForm();

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(create).not.toHaveBeenCalled();
    expect(wrapper.get('#account-name-error').text()).toBe(
      'accounts.creation.error.name_required',
    );
    expect(wrapper.get('#account-initial-balance-error').text()).toBe(
      'accounts.creation.error.balance_required',
    );
    expect(focus.mock.instances.at(-1)).toBe(
      wrapper.get('#account-name').element,
    );

    focus.mockRestore();
  });

  it('rejects an invalid decimal string without coercing it', async () => {
    const wrapper = await mountForm();

    await wrapper.get('#account-name').setValue('Checking account');
    await wrapper.get('#account-initial-balance').setValue('1,200.50');
    await wrapper.get('form').trigger('submit');

    expect(create).not.toHaveBeenCalled();
    expect(wrapper.get('#account-initial-balance-error').text()).toBe(
      'accounts.creation.error.balance_invalid',
    );
  });

  it('maps stable API field codes without displaying API details', async () => {
    create.mockRejectedValue(
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
            code: 'balance_date_in_future',
            detail: 'Untranslated field detail',
          },
        ],
      }),
    );
    const wrapper = await mountForm();

    await wrapper.get('#account-name').setValue('Checking account');
    await wrapper.get('#account-initial-balance').setValue('1200');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('#account-balance-date-error').text()).toBe(
      'accounts.creation.error.date_future',
    );
    expect(wrapper.text()).not.toContain('Untranslated');
  });

  it('emits cancellation without submitting', async () => {
    const wrapper = await mountForm();

    await wrapper.get('button[type="button"]').trigger('click');

    expect(create).not.toHaveBeenCalled();
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});

function mountForm() {
  return mountSuspended(AccountForm, {
    props: {
      household,
      institutions,
      currentDate: '2026-09-05',
    },
  });
}
