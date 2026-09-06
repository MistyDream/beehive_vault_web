import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import AccountForm from '~/components/accounts/AccountForm.vue';
import AccountCreationPage from '~/pages/accounts/new.vue';
import type { Account } from '~/types/account';
import type { Institution } from '~/types/institution';

const { navigateTo, toastSuccess } = vi.hoisted(() => ({
  navigateTo: vi.fn(),
  toastSuccess: vi.fn(),
}));

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

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
];

const createdAccount: Account = {
  id: 'account-checking',
  householdId: 'household-personal',
  institutionId: null,
  name: 'Checking account',
  kind: 'checking',
  currency: 'EUR',
  latestBalance: '1200.0000',
  balanceDate: '2026-09-05',
  calculatedBalance: '1200.0000',
  archivedAt: null,
  createdAt: '2026-09-05T08:00:00Z',
  updatedAt: '2026-09-05T08:00:00Z',
};

let responseStatus = 200;

registerEndpoint('/api/institutions', {
  method: 'GET',
  handler: () => {
    if (responseStatus === 500) {
      throw createError({ statusCode: 500, statusMessage: 'Request failed' });
    }

    return institutions;
  },
});

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useActiveHousehold', () => () => ({ activeHousehold }));
mockNuxtImport('getDateInTimeZone', () => () => '2026-09-05');
mockNuxtImport('useLocalePath', () => () => (path: string) => path);
mockNuxtImport('navigateTo', () => navigateTo);
mockNuxtImport('useToast', () => () => ({ success: toastSuccess }));

enableAutoUnmount(afterEach);

describe('AccountCreationPage', () => {
  beforeEach(() => {
    responseStatus = 200;
    navigateTo.mockReset();
    toastSuccess.mockReset();
    clearNuxtData();
  });

  it('loads institutions and configures the account form', async () => {
    const wrapper = await mountSuspended(AccountCreationPage);

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountForm).exists()).toBe(true);
    });

    expect(wrapper.getComponent(AccountForm).props()).toMatchObject({
      household: activeHousehold.value,
      institutions,
      currentDate: '2026-09-05',
    });
  });

  it('returns to accounts on cancellation', async () => {
    const wrapper = await mountSuspended(AccountCreationPage);

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountForm).exists()).toBe(true);
    });
    wrapper.getComponent(AccountForm).vm.$emit('cancel');

    expect(navigateTo).toHaveBeenCalledWith('/accounts');
  });

  it('opens the created account after submission', async () => {
    const wrapper = await mountSuspended(AccountCreationPage);

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountForm).exists()).toBe(true);
    });
    wrapper.getComponent(AccountForm).vm.$emit('created', createdAccount);

    expect(toastSuccess).toHaveBeenCalledWith('accounts.creation.success');
    expect(navigateTo).toHaveBeenCalledWith('/accounts/account-checking');
  });

  it('shows a recoverable error when institutions cannot be loaded', async () => {
    responseStatus = 500;
    const wrapper = await mountSuspended(AccountCreationPage);

    await vi.waitFor(() => {
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    responseStatus = 200;
    await wrapper.get('[role="alert"] button').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountForm).exists()).toBe(true);
    });
  });
});
