import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';

import AccountEditForm from '~/components/accounts/AccountEditForm.vue';
import { ApiError } from '~/types/api';
import type { Account } from '~/types/account';
import type { Institution } from '~/types/institution';

const update = vi.fn();

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
}));
mockNuxtImport('useAccountApi', () => () => ({ update }));

enableAutoUnmount(afterEach);

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
  { id: 'institution-honey-credit', name: 'Honey Credit' },
];

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

describe('AccountEditForm', () => {
  beforeEach(() => {
    update.mockReset();
  });

  it('prefills the account and limits types to its economic family', async () => {
    const wrapper = await mountForm();

    expect(wrapper.get('#account-edit-name').element).toHaveProperty(
      'value',
      'Life insurance',
    );
    expect(wrapper.get('#account-edit-kind').element).toHaveProperty(
      'value',
      'investment',
    );
    expect(wrapper.get('#account-edit-institution').element).toHaveProperty(
      'value',
      'institution-beehive-bank',
    );
    expect(
      wrapper
        .findAll<HTMLSelectElement>('#account-edit-kind option')
        .map(({ element }) => element.value),
    ).toEqual(['checking', 'savings', 'cash', 'investment', 'other_asset']);
    expect(wrapper.get('button[type="submit"]').attributes()).toHaveProperty(
      'disabled',
    );
  });

  it('updates the editable account fields', async () => {
    const updatedAccount: Account = {
      ...account,
      institutionId: 'institution-honey-credit',
      name: 'Long-term investments',
      kind: 'savings',
    };
    update.mockResolvedValue(updatedAccount);
    const wrapper = await mountForm();

    await wrapper
      .get('#account-edit-name')
      .setValue('  Long-term investments  ');
    await wrapper.get('#account-edit-kind').setValue('savings');
    await wrapper
      .get('#account-edit-institution')
      .setValue('institution-honey-credit');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(update).toHaveBeenCalledWith(
      'household-personal',
      'account-investment',
      {
        name: 'Long-term investments',
        kind: 'savings',
        institutionId: 'institution-honey-credit',
      },
    );
    expect(wrapper.emitted('saved')).toEqual([[updatedAccount]]);
  });

  it('uses the explicit API flag when removing an institution', async () => {
    update.mockResolvedValue({ ...account, institutionId: null });
    const wrapper = await mountForm();

    await wrapper.get('#account-edit-institution').setValue('');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(update).toHaveBeenCalledWith(
      'household-personal',
      'account-investment',
      {
        name: 'Life insurance',
        kind: 'investment',
        removeInstitution: true,
      },
    );
  });

  it('prevents submission and focuses an invalid name', async () => {
    const focus = vi
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);
    const wrapper = await mountForm();

    await wrapper.get('#account-edit-name').setValue('   ');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(update).not.toHaveBeenCalled();
    expect(wrapper.get('#account-edit-name-error').text()).toBe(
      'accounts.edit.error.name_required',
    );
    expect(focus.mock.instances.at(-1)).toBe(
      wrapper.get('#account-edit-name').element,
    );

    focus.mockRestore();
  });

  it('maps stable API field codes without displaying API details', async () => {
    update.mockRejectedValue(
      new ApiError({
        type: 'urn:beehive-vault:problem:validation-error',
        title: 'Request validation failed',
        status: 422,
        code: 'validation_error',
        detail: 'Untranslated API detail',
        errors: [
          {
            location: 'body',
            pointer: '#/institutionId',
            code: 'invalid_institution',
            detail: 'Untranslated field detail',
          },
        ],
      }),
    );
    const wrapper = await mountForm();

    await wrapper.get('#account-edit-name').setValue('Updated account');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('#account-edit-institution-error').text()).toBe(
      'accounts.edit.error.institution_invalid',
    );
    expect(wrapper.text()).not.toContain('Untranslated');
  });

  it('keeps values and allows retry after a network failure', async () => {
    const updatedAccount = { ...account, name: 'Updated account' };
    update
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce(updatedAccount);
    const wrapper = await mountForm();

    await wrapper.get('#account-edit-name').setValue('Updated account');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toBe(
      'accounts.edit.error.generic',
    );
    expect(wrapper.get('#account-edit-name').element).toHaveProperty(
      'value',
      'Updated account',
    );
    expect(
      wrapper.get('button[type="submit"]').attributes(),
    ).not.toHaveProperty('disabled');

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(update).toHaveBeenCalledTimes(2);
    expect(wrapper.emitted('saved')).toEqual([[updatedAccount]]);
  });

  it('keeps liability accounts within liability types', async () => {
    const wrapper = await mountForm({
      ...account,
      kind: 'loan',
      name: 'Mortgage',
    });

    expect(
      wrapper
        .findAll<HTMLSelectElement>('#account-edit-kind option')
        .map(({ element }) => element.value),
    ).toEqual(['credit_card', 'loan', 'other_liability']);
  });

  it('emits cancellation without submitting', async () => {
    const wrapper = await mountForm();

    await wrapper.get('button[type="button"]').trigger('click');

    expect(update).not.toHaveBeenCalled();
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});

function mountForm(accountOverride: Account = account) {
  return mountSuspended(AccountEditForm, {
    props: {
      account: accountOverride,
      institutions,
    },
  });
}
