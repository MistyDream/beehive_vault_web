import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';

import { useReportApi } from '~/composables/useReportApi';
import type { NetWorthSummary } from '~/types/report';

const summary: NetWorthSummary = {
  currency: 'EUR',
  assets: '58420.00',
  liabilities: '15740.00',
  netWorth: '42680.00',
};

registerEndpoint('/api/households/household-personal/summary', () => summary);

describe('useReportApi', () => {
  it('loads the net worth summary for a household', async () => {
    const result =
      await useReportApi().getNetWorthSummary('household-personal');

    expect(result).toEqual(summary);
  });
});
