<template>
  <section class="bh-perf-breakdown">
    <header class="bh-perf-breakdown__header">
      <h2 class="bh-perf-breakdown__title">
        {{ t('portfolios.detail.performance.breakdown.title') }}
      </h2>
    </header>

    <div class="bh-perf-breakdown__grid">
      <BHKpiTile
        v-for="tile in tiles"
        :key="tile.key"
        :label="tile.label"
        :loading="loading"
        :icon="tile.icon"
        :icon-variant="tile.iconVariant"
      >
        <BHCurrencyDisplay
          v-if="performance"
          :amount="tile.amount(performance)"
          :currency="performance.currency"
          :show-sign="tile.showSign"
          size="md"
        />
      </BHKpiTile>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  LucideArrowDownToLine,
  LucideArrowUpFromLine,
  LucideCoins,
  LucideLandmark,
  LucideReceipt,
  LucideTrendingUp,
} from '#components';
import type { Component } from 'vue';
import type { PerformanceReport } from '~/types/portfolio';

interface Props {
  performance: PerformanceReport | null | undefined;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

type IconVariant = 'muted' | 'success' | 'error' | 'warning' | 'accent';

interface BreakdownTile {
  key: string;
  label: string;
  icon: Component;
  iconVariant: IconVariant;
  showSign: boolean;
  amount: (p: PerformanceReport) => number;
}

const tiles = computed<BreakdownTile[]>(() => [
  {
    key: 'total_deposited',
    label: t('portfolios.detail.performance.breakdown.total_deposited'),
    icon: LucideArrowDownToLine,
    iconVariant: 'success',
    showSign: false,
    amount: (p) => p.total_deposited,
  },
  {
    key: 'total_withdrawn',
    label: t('portfolios.detail.performance.breakdown.total_withdrawn'),
    icon: LucideArrowUpFromLine,
    iconVariant: 'warning',
    showSign: true,
    amount: (p) => -p.total_withdrawn,
  },
  {
    key: 'realized_pnl',
    label: t('portfolios.detail.performance.breakdown.realized_pnl'),
    icon: LucideTrendingUp,
    iconVariant: 'success',
    showSign: true,
    amount: (p) => p.realized_pnl,
  },
  {
    key: 'dividends',
    label: t('portfolios.detail.performance.breakdown.dividends'),
    icon: LucideCoins,
    iconVariant: 'success',
    showSign: false,
    amount: (p) => p.dividends_received,
  },
  {
    key: 'fees',
    label: t('portfolios.detail.performance.breakdown.fees'),
    icon: LucideReceipt,
    iconVariant: 'error',
    showSign: true,
    amount: (p) => -p.fees_paid,
  },
  {
    key: 'taxes',
    label: t('portfolios.detail.performance.breakdown.taxes'),
    icon: LucideLandmark,
    iconVariant: 'error',
    showSign: true,
    amount: (p) => -p.taxes_paid,
  },
]);
</script>

<style lang="css" scoped>
.bh-perf-breakdown {
  @apply flex flex-col gap-3;
}

.bh-perf-breakdown__header {
  @apply flex items-baseline justify-between;
}

.bh-perf-breakdown__title {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-perf-breakdown__grid {
  @apply grid gap-3;
  @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
}
</style>
