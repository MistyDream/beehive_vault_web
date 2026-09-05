import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';

import { useReportApi } from '~/composables/useReportApi';
import type { MonthlyFlowReport, NetWorthSummary } from '~/types/report';

const summary: NetWorthSummary = {
  currency: 'EUR',
  assets: '58420.00',
  liabilities: '15740.00',
  netWorth: '42680.00',
};

registerEndpoint('/api/households/household-personal/summary', () => summary);

const monthlyFlow: MonthlyFlowReport = {
  month: '2026-09',
  dateFrom: '2026-09-01',
  dateTo: '2026-09-30',
  currency: 'EUR',
  income: { total: '4250.00', transactionCount: 2, categories: [] },
  expenses: { total: '2840.00', transactionCount: 8, categories: [] },
  netFlow: '1410.00',
};

registerEndpoint(
  '/api/households/household-personal/monthly-flows/2026-09',
  () => monthlyFlow,
);

describe('useReportApi', () => {
  it('loads the net worth summary for a household', async () => {
    const result =
      await useReportApi().getNetWorthSummary('household-personal');

    expect(result).toEqual(summary);
  });

  it('loads a monthly flow report for a household and calendar month', async () => {
    const result = await useReportApi().getMonthlyFlowReport(
      'household-personal',
      '2026-09',
    );

    expect(result).toEqual(monthlyFlow);
  });
});
