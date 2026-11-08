import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from '@nuxt/test-utils/runtime';
import { DOMWrapper, enableAutoUnmount, flushPromises } from '@vue/test-utils';
import { useNuxtData } from '#app';
import { getQuery, readBody, setResponseStatus } from 'h3';

import AccountBalanceForm from '~/components/accounts/AccountBalanceForm.vue';
import AccountDetail from '~/components/accounts/AccountDetail.vue';
import AccountEditForm from '~/components/accounts/AccountEditForm.vue';
import AccountDetailPage from '~/pages/accounts/[accountId].vue';
import type { Account, Balance, UpdateBalanceRequest } from '~/types/account';
import type { OperationPage } from '~/types/operation';
import type { Institution } from '~/types/institution';

const { toastSuccess, navigateTo } = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
  navigateTo: vi.fn(),
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
    amount: account.latestBalance ?? '0',
    balanceDate: account.balanceDate ?? '2026-09-01',
    source: 'reconciliation',
    createdAt: '2026-09-01T08:00:00Z',
  },
];

const historicalBalance: Balance = {
  id: 'balance-initial',
  accountId: account.id,
  amount: '14000.0000',
  balanceDate: '2026-08-01',
  source: 'manual',
  createdAt: '2026-08-01T08:00:00Z',
};

const operations: OperationPage = {
  items: [],
  page: 1,
  limit: 5,
  total: 0,
};

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
];

let responseStatus = 200;
let requestBarrier: Promise<void> | undefined;
let receivedTransactionQuery: ReturnType<typeof getQuery>;
let accountRequestCount = 0;
let accountResponse: Account = account;
let balancesResponse = balances;
let receivedBalanceCorrection: UpdateBalanceRequest | undefined;
let mutationStatus = 200;
let mutationBarrier: Promise<void> | undefined;
let archiveRequestCount = 0;
let restoreRequestCount = 0;
let completedMutationCount = 0;
let restoreResponse: Account = account;

registerEndpoint(
  '/api/households/household-personal/accounts/account-investment',
  {
    method: 'DELETE',
    handler: async (event) => {
      archiveRequestCount += 1;
      await mutationBarrier;
      completedMutationCount += 1;
      if (mutationStatus !== 200) {
        setResponseStatus(event, mutationStatus);
        return {
          type: 'urn:beehive-vault:problem:account-balance-not-zero',
          title: 'Untranslated title',
          status: mutationStatus,
          code:
            mutationStatus === 409
              ? 'account_balance_not_zero'
              : 'unexpected_error',
          detail: 'Untranslated server detail',
        };
      }
      setResponseStatus(event, 204);
      return null;
    },
  },
);

registerEndpoint(
  '/api/households/household-personal/accounts/account-investment/restore',
  {
    method: 'POST',
    handler: async () => {
      restoreRequestCount += 1;
      await mutationBarrier;
      completedMutationCount += 1;
      if (mutationStatus !== 200)
        throw createError({
          statusCode: mutationStatus,
          statusMessage: 'Untranslated server detail',
        });
      return restoreResponse;
    },
  },
);

registerEndpoint(
  '/api/households/household-personal/accounts/account-investment',
  {
    method: 'GET',
    handler: async () => {
      await requestBarrier;
      ensureSuccessfulResponse();
      accountRequestCount += 1;
      return accountResponse;
    },
  },
);

registerEndpoint(
  '/api/households/household-personal/accounts/account-investment/balances',
  {
    method: 'GET',
    handler: async () => {
      await requestBarrier;
      ensureSuccessfulResponse();
      return balancesResponse;
    },
  },
);

registerEndpoint(
  '/api/households/household-personal/accounts/account-investment/balances/balance-initial',
  {
    method: 'PATCH',
    handler: async (event) => {
      receivedBalanceCorrection = await readBody<UpdateBalanceRequest>(event);
      const corrected = { ...historicalBalance, ...receivedBalanceCorrection };
      balancesResponse = [corrected, ...balances];
      accountResponse = {
        ...account,
        latestBalance: corrected.amount,
        balanceDate: corrected.balanceDate,
        calculatedBalance: corrected.amount,
      };
      return corrected;
    },
  },
);

registerEndpoint('/api/households/household-personal/transactions', {
  method: 'GET',
  handler: async (event) => {
    await requestBarrier;
    ensureSuccessfulResponse();
    receivedTransactionQuery = getQuery(event);
    return operations;
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
mockNuxtImport('getDateInTimeZone', () => () => '2026-09-06');
mockNuxtImport('useToast', () => () => ({ success: toastSuccess }));
mockNuxtImport('navigateTo', () => navigateTo);
mockNuxtImport('useRoute', () => () => ({
  params: { accountId: 'account-investment' },
}));
mockNuxtImport('useLocalePath', () => () => (route: unknown) => {
  if (typeof route === 'string') return route;

  const location = route as { path: string; query?: Record<string, string> };
  const query = new URLSearchParams(location.query).toString();
  return query ? `${location.path}?${query}` : location.path;
});

enableAutoUnmount(afterEach);

describe('AccountDetailPage', () => {
  beforeEach(() => {
    responseStatus = 200;
    requestBarrier = undefined;
    receivedTransactionQuery = {};
    accountRequestCount = 0;
    accountResponse = account;
    balancesResponse = balances;
    receivedBalanceCorrection = undefined;
    mutationStatus = 200;
    mutationBarrier = undefined;
    archiveRequestCount = 0;
    restoreRequestCount = 0;
    completedMutationCount = 0;
    restoreResponse = account;
    toastSuccess.mockReset();
    navigateTo.mockReset();
    clearNuxtData();
  });

  it('announces loading while account data is pending', async () => {
    let releaseRequest = () => undefined;
    requestBarrier = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });

    const wrapper = await mountSuspended(AccountDetailPage);

    expect(wrapper.get('[role="status"]').text()).toContain(
      'accounts.detail.loading',
    );

    releaseRequest();
    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });
  });

  it('loads the account detail resources and localized routes', async () => {
    const wrapper = await mountSuspended(AccountDetailPage);

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });

    expect(receivedTransactionQuery).toEqual({
      accountId: 'account-investment',
      page: '1',
      limit: '5',
    });
    expect(wrapper.getComponent(AccountDetail).props()).toMatchObject({
      account,
      institutionName: 'Beehive Bank',
      balances,
      operations: [],
      accountsTo: '/accounts',
      transactionsTo: '/transactions?accountId=account-investment',
    });
  });

  it('shows a recoverable error when account data cannot be loaded', async () => {
    responseStatus = 500;
    const wrapper = await mountSuspended(AccountDetailPage);

    await vi.waitFor(() => {
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    responseStatus = 200;
    await wrapper.get('[role="alert"] button').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });
  });

  it('updates the balance in a modal and refreshes the account detail', async () => {
    const wrapper = await mountSuspended(AccountDetailPage, {
      attachTo: document.body,
    });

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });
    const updateButton = wrapper
      .getComponent(AccountDetail)
      .get<HTMLButtonElement>('.account-detail__update-balance');
    updateButton.element.focus();
    await updateButton.trigger('click');

    expect(wrapper.getComponent(AccountBalanceForm).props()).toMatchObject({
      account,
      currentDate: '2026-09-06',
    });

    wrapper.getComponent(AccountBalanceForm).vm.$emit('saved', balances[0]);

    await vi.waitFor(() => {
      expect(accountRequestCount).toBe(2);
      expect(toastSuccess).toHaveBeenCalledWith('accounts.balance.success');
      expect(wrapper.findComponent(AccountBalanceForm).exists()).toBe(false);
      expect(document.activeElement).toBe(updateButton.element);
    });
  });

  it('corrects an older history entry and refreshes its new reconciliation anchor', async () => {
    balancesResponse = [...balances, historicalBalance];
    const wrapper = await mountSuspended(AccountDetailPage, {
      attachTo: document.body,
    });
    await vi.waitFor(() =>
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true),
    );
    const summaryData = useNuxtData('overview:household-personal:2026-09').data;
    summaryData.value = { marker: 'Cached data' };
    const trigger = wrapper.findAll<HTMLButtonElement>(
      '.account-detail__correct-balance',
    )[1]!;
    trigger.element.focus();
    await trigger.trigger('click');

    const form = wrapper.getComponent(AccountBalanceForm);
    expect(form.props('balanceToCorrect')).toEqual(historicalBalance);
    await form.get('#account-balance-date').setValue('2026-09-05');
    await form.trigger('submit');

    await vi.waitFor(() => {
      const detail = wrapper.getComponent(AccountDetail);
      expect(receivedBalanceCorrection).toEqual({ balanceDate: '2026-09-05' });
      expect(accountRequestCount).toBe(2);
      expect(detail.props('balances')[0]).toMatchObject({
        id: historicalBalance.id,
        balanceDate: '2026-09-05',
        source: 'manual',
      });
      expect(detail.props('account')).toMatchObject({
        latestBalance: '14000.0000',
        balanceDate: '2026-09-05',
        calculatedBalance: '14000.0000',
      });
      expect(summaryData.value).toBeUndefined();
      expect(wrapper.findComponent(AccountBalanceForm).exists()).toBe(false);
      expect(document.activeElement).toBe(trigger.element);
      expect(toastSuccess).toHaveBeenCalledWith(
        'accounts.balance.correction.success',
      );
    });
  });

  it('edits the account in a modal and refreshes the account detail', async () => {
    const wrapper = await mountSuspended(AccountDetailPage, {
      attachTo: document.body,
    });

    await vi.waitFor(() => {
      expect(wrapper.findComponent(AccountDetail).exists()).toBe(true);
    });
    const editButton = wrapper
      .getComponent(AccountDetail)
      .get<HTMLButtonElement>('.account-detail__edit');
    editButton.element.focus();
    await editButton.trigger('click');

    expect(wrapper.getComponent(AccountEditForm).props()).toMatchObject({
      account,
      institutions,
    });

    const updatedAccount = { ...account, name: 'Updated account' };
    accountResponse = updatedAccount;
    wrapper.getComponent(AccountEditForm).vm.$emit('saved', updatedAccount);

    await vi.waitFor(() => {
      expect(accountRequestCount).toBe(2);
      expect(wrapper.getComponent(AccountDetail).props('account')).toEqual(
        updatedAccount,
      );
      expect(wrapper.getComponent(AccountDetail).get('h1').text()).toBe(
        'Updated account',
      );
      expect(toastSuccess).toHaveBeenCalledWith('accounts.edit.success');
      expect(wrapper.findComponent(AccountEditForm).exists()).toBe(false);
      expect(document.activeElement).toBe(editButton.element);
    });
  });

  it('confirms archiving and returns to the active collection after success', async () => {
    const wrapper = await mountLifecyclePage();
    const detail = wrapper.getComponent(AccountDetail);
    await detail.get('.account-detail__archive').trigger('click');

    expect(archiveDialog().text()).toContain('accounts.archive.conservation');
    expect(archiveDialog().attributes('aria-describedby')).toBe(
      archiveDialog()
        .get('.account-detail-page__archive-form p')
        .attributes('id'),
    );
    expect(archiveRequestCount).toBe(0);
    await archiveDialog()
      .get('.account-detail-page__archive-form')
      .trigger('submit');

    await vi.waitFor(() => {
      expect(navigateTo).toHaveBeenCalledWith('/accounts');
      expect(toastSuccess).toHaveBeenCalledWith('accounts.archive.success');
    });
    expect(archiveRequestCount).toBe(1);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('cancels archiving without a request and restores keyboard focus', async () => {
    const wrapper = await mountLifecyclePage();
    const archiveButton = wrapper.get('.account-detail__archive');
    (archiveButton.element as HTMLButtonElement).focus();
    await archiveButton.trigger('click');
    await archiveDialog()
      .get('.account-detail-page__archive-actions button[type="button"]')
      .trigger('click');

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(archiveRequestCount).toBe(0);
    expect(document.activeElement).toBe(archiveButton.element);
  });

  it.each([
    [409, 'accounts.archive.error.balance_not_zero'],
    [500, 'accounts.archive.error.generic'],
  ])(
    'keeps the confirmation open after error %s and allows retry',
    async (status, message) => {
      mutationStatus = status as number;
      const wrapper = await mountLifecyclePage();
      await wrapper.get('.account-detail__archive').trigger('click');
      await archiveDialog()
        .get('.account-detail-page__archive-form')
        .trigger('submit');

      await vi.waitFor(() =>
        expect(archiveDialog().get('[role="alert"]').text()).toBe(message),
      );
      expect(archiveDialog().text()).not.toContain('Untranslated');
      expect(navigateTo).not.toHaveBeenCalled();
      expect(toastSuccess).not.toHaveBeenCalled();
      expect(
        archiveDialog().get('[type="submit"]').attributes(),
      ).not.toHaveProperty('disabled');

      mutationStatus = 200;
      await archiveDialog()
        .get('.account-detail-page__archive-form')
        .trigger('submit');
      await vi.waitFor(() =>
        expect(navigateTo).toHaveBeenCalledWith('/accounts'),
      );
    },
  );

  it('prevents duplicate submissions and closing while archiving', async () => {
    let releaseMutation = () => undefined;
    mutationBarrier = new Promise<void>((resolve) => {
      releaseMutation = resolve;
    });
    const wrapper = await mountLifecyclePage();
    await wrapper.get('.account-detail__archive').trigger('click');
    await archiveDialog()
      .get('.account-detail-page__archive-form')
      .trigger('submit');
    await vi.waitFor(() => expect(archiveRequestCount).toBe(1));
    try {
      expect(
        archiveDialog().get('[type="submit"]').attributes('aria-busy'),
      ).toBe('true');
      await archiveDialog()
        .get('.account-detail-page__archive-form')
        .trigger('submit');
      await archiveDialog().get('.bh-modal__close').trigger('click');
      expect(document.querySelector('[role="dialog"]')).not.toBeNull();
      expect(archiveRequestCount).toBe(1);
    } finally {
      releaseMutation();
    }
    await vi.waitFor(() =>
      expect(navigateTo).toHaveBeenCalledWith('/accounts'),
    );
  });

  it('restores an archived account, updates its balance, and requests a balance check', async () => {
    const wrapper = await mountLifecyclePage(true);
    expect(wrapper.get('.account-detail__back').attributes('href')).toBe(
      '/accounts/archived',
    );
    expect(wrapper.get('.account-detail__back').text()).toBe(
      'accounts.archive_list.back',
    );
    expect(wrapper.findComponent(AccountEditForm).exists()).toBe(false);
    expect(wrapper.findComponent(AccountBalanceForm).exists()).toBe(false);
    expect(wrapper.find('.account-detail__correct-balance').exists()).toBe(
      false,
    );
    restoreResponse = { ...account, calculatedBalance: '42.1250' };
    await wrapper.get('.account-detail__restore').trigger('click');

    await vi.waitFor(() =>
      expect(wrapper.find('.account-detail__restore').exists()).toBe(false),
    );
    expect(restoreRequestCount).toBe(1);
    expect(wrapper.getComponent(AccountDetail).props('account')).toEqual(
      restoreResponse,
    );
    expect(wrapper.get('.account-detail__back').attributes('href')).toBe(
      '/accounts',
    );
    expect(wrapper.get('[role="status"]').text()).toBe(
      'accounts.restore.check_balance',
    );
    expect(wrapper.find('.account-detail__edit').exists()).toBe(true);
    expect(wrapper.find('.account-detail__update-balance').exists()).toBe(true);
    expect(document.activeElement).toBe(wrapper.get('h1').element);
    expect(toastSuccess).toHaveBeenCalledWith('accounts.restore.success');
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('keeps an archived account read-only after a restoration failure and allows retry', async () => {
    mutationStatus = 500;
    const wrapper = await mountLifecyclePage(true);
    await wrapper.get('.account-detail__restore').trigger('click');

    await vi.waitFor(() =>
      expect(wrapper.get('[role="alert"]').text()).toBe(
        'accounts.restore.error',
      ),
    );
    expect(wrapper.text()).not.toContain('Untranslated');
    expect(wrapper.find('.account-detail__edit').exists()).toBe(false);
    expect(wrapper.find('.account-detail__update-balance').exists()).toBe(
      false,
    );
    expect(
      wrapper.get('.account-detail__restore').attributes(),
    ).not.toHaveProperty('disabled');
    expect(toastSuccess).not.toHaveBeenCalled();

    mutationStatus = 200;
    await wrapper.get('.account-detail__restore').trigger('click');
    await vi.waitFor(() =>
      expect(wrapper.text()).toContain('accounts.restore.check_balance'),
    );
  });

  it('prevents duplicate restoration requests while the response is pending', async () => {
    let releaseMutation = () => undefined;
    mutationBarrier = new Promise<void>((resolve) => {
      releaseMutation = resolve;
    });
    const wrapper = await mountLifecyclePage(true);
    await wrapper.get('.account-detail__restore').trigger('click');
    await vi.waitFor(() => expect(restoreRequestCount).toBe(1));
    try {
      expect(
        wrapper.get('.account-detail__restore').attributes('aria-busy'),
      ).toBe('true');
      wrapper.getComponent(AccountDetail).vm.$emit('restore');
      expect(restoreRequestCount).toBe(1);
    } finally {
      releaseMutation();
    }
    await vi.waitFor(() =>
      expect(wrapper.find('.account-detail__restore').exists()).toBe(false),
    );
  });

  it.each(['archive', 'restore'])(
    'invalidates the current household collections after %s while preserving other households',
    async (action) => {
      const wrapper = await mountLifecyclePage(action === 'restore');
      const collectionData = [
        'accounts:household-personal:active',
        'accounts:household-personal:archived',
        'overview:household-personal:2026-09',
      ].map((key) => useNuxtData(key).data);
      const otherHouseholdData = useNuxtData(
        'accounts:household-other:active',
      ).data;
      for (const data of [...collectionData, otherHouseholdData])
        data.value = { marker: 'Cached data' };

      await wrapper.get(`.account-detail__${action}`).trigger('click');
      if (action === 'archive')
        await archiveDialog().get('form').trigger('submit');
      await vi.waitFor(() => expect(toastSuccess).toHaveBeenCalled());

      for (const data of collectionData) expect(data.value).toBeUndefined();
      expect(otherHouseholdData.value).toEqual({ marker: 'Cached data' });
    },
  );

  it.each(['archive', 'restore'])(
    'does not navigate or notify after leaving the account during %s',
    async (action) => {
      let releaseMutation = () => undefined;
      mutationBarrier = new Promise<void>((resolve) => {
        releaseMutation = resolve;
      });
      const wrapper = await mountLifecyclePage(action === 'restore');
      await wrapper.get(`.account-detail__${action}`).trigger('click');
      if (action === 'archive')
        await archiveDialog().get('form').trigger('submit');
      await vi.waitFor(() =>
        expect(archiveRequestCount + restoreRequestCount).toBe(1),
      );
      wrapper.unmount();
      releaseMutation();
      await vi.waitFor(() => expect(completedMutationCount).toBe(1));
      await flushPromises();

      expect(navigateTo).not.toHaveBeenCalled();
      expect(toastSuccess).not.toHaveBeenCalled();
    },
  );
});

async function mountLifecyclePage(archived = false) {
  accountResponse = {
    ...account,
    calculatedBalance: '0.0000',
    archivedAt: archived ? '2026-09-13T08:00:00Z' : null,
  };
  const wrapper = await mountSuspended(AccountDetailPage, {
    attachTo: document.body,
  });
  await vi.waitFor(() =>
    expect(wrapper.findComponent(AccountDetail).exists()).toBe(true),
  );
  return wrapper;
}

function archiveDialog() {
  const element = document.querySelector<HTMLElement>('[role="dialog"]');
  if (!element) throw new Error('Archive dialog is not open');
  return new DOMWrapper(element);
}

function ensureSuccessfulResponse() {
  if (responseStatus === 500) {
    throw createError({ statusCode: 500, statusMessage: 'Request failed' });
  }
}
