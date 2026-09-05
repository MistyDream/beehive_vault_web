<template>
  <BHSurface
    as="section"
    class="current-month-summary"
    :aria-labelledby="titleId"
  >
    <header class="current-month-summary__header">
      <div>
        <p>{{ monthLabel }}</p>
        <h2 :id="titleId">
          {{ t('overview.current_month.title') }}
        </h2>
      </div>

      <NuxtLink :to="reportTo" class="current-month-summary__report-link">
        {{ t('overview.current_month.view_report') }}
        <LucideArrowRight :size="16" aria-hidden="true" />
      </NuxtLink>
    </header>

    <dl class="current-month-summary__totals">
      <div class="current-month-summary__metric">
        <dt>{{ t('overview.current_month.income') }}</dt>
        <dd>
          <NuxtLink
            :to="{
              path: transactionsTo,
              query: {
                dateFrom: report.dateFrom,
                dateTo: report.dateTo,
                nature: 'income',
              },
            }"
          >
            <BHCurrencyDisplay
              :amount="report.income.total"
              :currency="report.currency"
            />
          </NuxtLink>
        </dd>
      </div>

      <div class="current-month-summary__metric">
        <dt>{{ t('overview.current_month.expenses') }}</dt>
        <dd>
          <NuxtLink
            :to="{
              path: transactionsTo,
              query: {
                dateFrom: report.dateFrom,
                dateTo: report.dateTo,
                nature: 'expense',
              },
            }"
          >
            <BHCurrencyDisplay
              :amount="report.expenses.total"
              :currency="report.currency"
            />
          </NuxtLink>
        </dd>
      </div>

      <div
        class="current-month-summary__metric current-month-summary__metric--net"
      >
        <dt>{{ t('overview.current_month.net_flow') }}</dt>
        <dd>
          <BHCurrencyDisplay
            :amount="report.netFlow"
            :currency="report.currency"
            show-sign
          />
        </dd>
      </div>
    </dl>

    <div
      v-if="leadingExpenseCategories.length > 0"
      class="current-month-summary__categories"
    >
      <h3>{{ t('overview.current_month.top_expenses') }}</h3>

      <ul>
        <li
          v-for="category in leadingExpenseCategories"
          :key="category.categoryId ?? 'uncategorized'"
          class="current-month-summary__category"
        >
          <NuxtLink :to="categoryTransactionsTo(category)">
            <span>
              {{
                category.categoryName ??
                t('overview.current_month.uncategorized')
              }}
            </span>

            <BHCurrencyDisplay
              :amount="category.amount"
              :currency="report.currency"
            />

            <LucideChevronRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </div>

    <p v-else class="current-month-summary__empty">
      {{
        hasFlow
          ? t('overview.current_month.no_expenses')
          : t('overview.current_month.empty')
      }}
    </p>
  </BHSurface>
</template>

<script setup lang="ts">
import type { MonthlyFlowCategory, MonthlyFlowReport } from '~/types/report';

interface Props {
  report: MonthlyFlowReport;
  reportTo: string;
  transactionsTo: string;
}

const props = defineProps<Props>();

const { t, locale } = useI18n();
const titleId = useId();

const monthLabel = computed(() => {
  const [yearValue, monthValue] = props.report.month.split('-');
  const year = Number(yearValue);
  const month = Number(monthValue);

  return new Intl.DateTimeFormat(locale.value, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
});

const hasFlow = computed(
  () =>
    props.report.income.transactionCount > 0 ||
    props.report.expenses.transactionCount > 0,
);

const leadingExpenseCategories = computed(() =>
  props.report.expenses.categories.slice(0, 3),
);

const categoryTransactionsTo = (category: MonthlyFlowCategory) => ({
  path: props.transactionsTo,
  query: {
    dateFrom: props.report.dateFrom,
    dateTo: props.report.dateTo,
    nature: 'expense',
    ...(category.categoryId
      ? { categoryId: category.categoryId }
      : { uncategorized: 'true' }),
  },
});
</script>

<style lang="css" scoped>
.current-month-summary {
  @apply overflow-hidden p-5 md:p-6;
}

.current-month-summary__header {
  @apply flex items-start justify-between gap-4;
}

.current-month-summary__header p {
  @apply text-xs font-medium capitalize text-theme-text-muted;
}

.current-month-summary__header h2 {
  @apply mt-1 font-poppins text-lg font-semibold text-theme-text-primary md:text-xl;
}

.current-month-summary__report-link {
  @apply inline-flex shrink-0 items-center gap-1 rounded-md;
  @apply text-sm font-medium text-theme-accent-primary-strong no-underline;
  @apply hover:text-theme-accent-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.current-month-summary__totals {
  @apply mt-5 grid grid-cols-2 gap-2;
}

.current-month-summary__metric {
  @apply rounded-control bg-theme-bg-elevated px-3 py-3;
}

.current-month-summary__metric--net {
  @apply col-span-2 border border-theme-border-secondary bg-theme-bg-card;
}

.current-month-summary__metric dt {
  @apply text-xs text-theme-text-muted;
}

.current-month-summary__metric dd {
  @apply mt-1;
}

.current-month-summary__metric dd > a {
  @apply inline-flex rounded-md text-theme-text-primary no-underline;
  @apply hover:text-theme-accent-primary-strong;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.current-month-summary__metric :deep(.bh-currency-display) {
  @apply text-lg font-semibold;
}

.current-month-summary__categories {
  @apply mt-5 border-t border-theme-border-secondary pt-4;
}

.current-month-summary__categories h3 {
  @apply text-sm font-medium text-theme-text-primary;
}

.current-month-summary__categories ul {
  @apply mt-2 divide-y divide-theme-border-secondary;
}

.current-month-summary__category a {
  @apply -mx-2 flex min-h-11 items-center gap-3 rounded-control px-2 py-2;
  @apply text-sm text-theme-text-primary no-underline;
  @apply hover:bg-theme-bg-elevated;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.current-month-summary__category a > span:first-child {
  @apply min-w-0 flex-1 truncate;
}

.current-month-summary__category :deep(.bh-currency-display) {
  @apply shrink-0 text-sm font-medium;
}

.current-month-summary__category svg {
  @apply shrink-0 text-theme-text-muted;
}

.current-month-summary__empty {
  @apply mt-5 rounded-control bg-theme-bg-elevated px-4 py-6;
  @apply text-center text-sm text-theme-text-secondary;
}

@media (max-width: 479px) {
  .current-month-summary__header {
    @apply flex-col;
  }
}
</style>
