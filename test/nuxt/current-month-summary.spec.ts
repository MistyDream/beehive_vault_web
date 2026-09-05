import { ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHCurrencyDisplay } from '#components';
import CurrentMonthSummary from '~/components/overview/CurrentMonthSummary.vue';
import type { MonthlyFlowReport } from '~/types/report';

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en-US'),
  t: (key: string) => key,
}));

const report: MonthlyFlowReport = {
  month: '2026-09',
  dateFrom: '2026-09-01',
  dateTo: '2026-09-30',
  currency: 'EUR',
  income: {
    total: '4250.00',
    transactionCount: 2,
    categories: [],
  },
  expenses: {
    total: '2840.00',
    transactionCount: 8,
    categories: [
      {
        categoryId: 'category-housing',
        categoryName: 'Housing',
        amount: '1250.00',
        transactionCount: 1,
      },
      {
        categoryId: 'category-food',
        categoryName: 'Food',
        amount: '620.00',
        transactionCount: 3,
      },
      {
        categoryId: null,
        categoryName: null,
        amount: '380.00',
        transactionCount: 2,
      },
      {
        categoryId: 'category-leisure',
        categoryName: 'Leisure',
        amount: '240.00',
        transactionCount: 2,
      },
    ],
  },
  netFlow: '1410.00',
};

describe('CurrentMonthSummary', () => {
  it('renders a labelled report with its localized month', async () => {
    const wrapper = await mountSummary(report);
    const section = wrapper.get('section');
    const heading = wrapper.get('h2');

    expect(section.attributes('aria-labelledby')).toBe(
      heading.attributes('id'),
    );
    expect(heading.text()).toBe('overview.current_month.title');
    expect(wrapper.text()).toContain('September 2026');
    expect(
      wrapper.get('.current-month-summary__report-link').attributes('href'),
    ).toBe('/monthly-report/2026-09');
  });

  it('shows exact totals and the three leading expense categories', async () => {
    const wrapper = await mountSummary(report);
    const totals = wrapper.findAllComponents(BHCurrencyDisplay).slice(0, 3);
    const categories = wrapper.findAll('.current-month-summary__category');

    expect(totals.map((amount) => amount.props('amount'))).toEqual([
      report.income.total,
      report.expenses.total,
      report.netFlow,
    ]);
    expect(totals[2]?.props('showSign')).toBe(true);
    expect(categories).toHaveLength(3);
    expect(categories[0]?.text()).toContain('Housing');
    expect(categories[1]?.text()).toContain('Food');
    expect(categories[2]?.text()).toContain(
      'overview.current_month.uncategorized',
    );
    expect(wrapper.text()).not.toContain('Leisure');

    const housingUrl = new URL(
      categories[0]?.get('a').attributes('href') ?? '',
      'https://beehive-vault.test',
    );
    expect(housingUrl.pathname).toBe('/transactions');
    expect(Object.fromEntries(housingUrl.searchParams)).toEqual({
      dateFrom: report.dateFrom,
      dateTo: report.dateTo,
      nature: 'expense',
      categoryId: 'category-housing',
    });

    const uncategorizedUrl = new URL(
      categories[2]?.get('a').attributes('href') ?? '',
      'https://beehive-vault.test',
    );
    expect(uncategorizedUrl.searchParams.get('uncategorized')).toBe('true');
    expect(uncategorizedUrl.searchParams.has('categoryId')).toBe(false);
  });

  it('replaces the category list with an empty-month explanation', async () => {
    const wrapper = await mountSummary({
      ...report,
      income: { total: '0', transactionCount: 0, categories: [] },
      expenses: { total: '0', transactionCount: 0, categories: [] },
      netFlow: '0',
    });

    expect(wrapper.get('.current-month-summary__empty').text()).toBe(
      'overview.current_month.empty',
    );
    expect(wrapper.find('.current-month-summary__category').exists()).toBe(
      false,
    );
  });
});

function mountSummary(monthlyReport: MonthlyFlowReport) {
  return mountSuspended(CurrentMonthSummary, {
    props: {
      report: monthlyReport,
      reportTo: `/monthly-report/${monthlyReport.month}`,
      transactionsTo: '/transactions',
    },
  });
}
