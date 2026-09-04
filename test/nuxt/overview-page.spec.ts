import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import NetWorthSummary from '~/components/overview/NetWorthSummary.vue';
import AccountComposition from '~/components/overview/AccountComposition.vue';
import OverviewPage from '~/pages/index.vue';
import type { AccountCollection } from '~/types/account';
import type { NetWorthSummary as NetWorthSummaryData } from '~/types/report';

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

const summary: NetWorthSummaryData = {
  currency: 'EUR',
  assets: '58420.00',
  liabilities: '15740.00',
  netWorth: '42680.00',
};

const accounts: AccountCollection = {
  items: [],
  totals: { daily: '0', savings: '0', liabilities: '0' },
};

let responseStatus = 200;
let requestBarrier: Promise<void> | undefined;

registerEndpoint('/api/households/household-personal/summary', {
  method: 'GET',
  handler: async () => {
    await requestBarrier;

    if (responseStatus === 500) {
      throw createError({ statusCode: 500, statusMessage: 'Request failed' });
    }

    return summary;
  },
});

registerEndpoint('/api/households/household-personal/accounts', {
  method: 'GET',
  handler: async () => {
    await requestBarrier;

    if (responseStatus === 500) {
      throw createError({ statusCode: 500, statusMessage: 'Request failed' });
    }

    return accounts;
  },
});

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useActiveHousehold', () => () => ({ activeHousehold }));

enableAutoUnmount(afterEach);

describe('OverviewPage', () => {
  beforeEach(() => {
    responseStatus = 200;
    requestBarrier = undefined;
    clearNuxtData();
  });

  it('announces loading while the summary request is pending', async () => {
    let releaseRequest = () => undefined;
    requestBarrier = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });

    const wrapper = await mountSuspended(OverviewPage);

    expect(wrapper.get('[role="status"]').text()).toBe('overview.loading');

    releaseRequest();
    await vi.waitFor(() => {
      expect(wrapper.findComponent(NetWorthSummary).exists()).toBe(true);
    });
  });

  it('loads and displays the active household net worth', async () => {
    const wrapper = await mountSuspended(OverviewPage);

    await vi.waitFor(() => {
      expect(wrapper.findComponent(NetWorthSummary).exists()).toBe(true);
    });

    expect(wrapper.get('h1').text()).toBe('overview.title');
    expect(wrapper.getComponent(NetWorthSummary).props('summary')).toEqual(
      summary,
    );
    expect(
      wrapper.getComponent(AccountComposition).props('collection'),
    ).toEqual(accounts);
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it('shows a recoverable error when the summary cannot be loaded', async () => {
    responseStatus = 500;
    const wrapper = await mountSuspended(OverviewPage);

    await vi.waitFor(() => {
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    const error = wrapper.get('[role="alert"]');
    expect(error.text()).toContain('overview.load_error_title');
    expect(error.text()).toContain('overview.load_error_description');

    responseStatus = 200;
    await error.get('button').trigger('click');
    await vi.waitFor(() => {
      expect(wrapper.findComponent(NetWorthSummary).exists()).toBe(true);
    });

    expect(wrapper.getComponent(NetWorthSummary).props('summary')).toEqual(
      summary,
    );
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});
