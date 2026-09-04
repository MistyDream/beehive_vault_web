import { ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHCurrencyDisplay } from '#components';
import NetWorthSummary from '~/components/overview/NetWorthSummary.vue';
import type { NetWorthSummary as NetWorthSummaryData } from '~/types/report';

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

const summary: NetWorthSummaryData = {
  currency: 'EUR',
  assets: '58420.00',
  liabilities: '15740.00',
  netWorth: '42680.00',
};

describe('NetWorthSummary', () => {
  it('exposes a labelled current net worth section', async () => {
    const wrapper = await mountSummary();
    const section = wrapper.get('section');
    const heading = wrapper.get('h2');

    expect(section.attributes('aria-labelledby')).toBe(
      heading.attributes('id'),
    );
    expect(heading.text()).toBe('overview.net_worth.title');
  });

  it('shows the exact net worth, asset and liability amounts', async () => {
    const wrapper = await mountSummary();
    const amounts = wrapper.findAllComponents(BHCurrencyDisplay);

    expect(amounts).toHaveLength(3);
    expect(amounts.map((amount) => amount.props('amount'))).toEqual([
      summary.netWorth,
      summary.assets,
      summary.liabilities,
    ]);
    expect(amounts.every((amount) => amount.props('currency') === 'EUR')).toBe(
      true,
    );
    expect(wrapper.text()).toContain('overview.net_worth.net');
    expect(wrapper.text()).toContain('overview.net_worth.assets');
    expect(wrapper.text()).toContain('overview.net_worth.liabilities');
  });
});

function mountSummary() {
  return mountSuspended(NetWorthSummary, {
    props: { summary },
  });
}
