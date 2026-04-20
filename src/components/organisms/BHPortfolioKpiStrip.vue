<template>
  <div class="bh-kpi-strip">
    <BHKpiTile
      :label="t('portfolios.detail.kpi.invested')"
      :icon="LucideBanknote"
      :loading="summaryPending"
    >
      <BHCurrencyDisplay
        v-if="summary"
        :amount="summary.total_invested"
        :currency="currency"
        size="md"
      />
    </BHKpiTile>

    <BHKpiTile
      :label="t('portfolios.detail.kpi.cash')"
      :icon="LucideWallet"
      :loading="summaryPending"
    >
      <BHCurrencyDisplay
        v-if="summary"
        :amount="summary.cash.balance"
        :currency="summary.cash.currency"
        size="md"
      />
    </BHKpiTile>

    <BHKpiTile
      :label="t('portfolios.detail.kpi.net_result')"
      :icon="LucideTrendingUp"
      :loading="performancePending"
    >
      <template v-if="performance">
        <BHCurrencyDisplay
          :amount="performance.net_result"
          :currency="performance.currency"
          size="md"
        />
        <BHPercentDisplay
          v-if="netResultPercent !== null"
          :value="netResultPercent"
          size="sm"
        />
      </template>
    </BHKpiTile>

    <BHKpiTile
      :label="t('portfolios.detail.kpi.positions_count')"
      :icon="LucideLayers"
      :loading="summaryPending"
    >
      <span v-if="summary" class="bh-kpi-strip__count">
        {{ summary.positions.length }}
      </span>
    </BHKpiTile>
  </div>
</template>

<script setup lang="ts">
import {
  LucideBanknote,
  LucideWallet,
  LucideTrendingUp,
  LucideLayers,
} from '#components';
import type { PerformanceReport, PortfolioSummary } from '~/types/portfolio';

interface Props {
  summary: PortfolioSummary | null;
  performance: PerformanceReport | null;
  summaryPending?: boolean;
  performancePending?: boolean;
  currency: string;
}

const props = withDefaults(defineProps<Props>(), {
  summaryPending: false,
  performancePending: false,
});

const { t } = useI18n();

const netResultPercent = computed(() => {
  if (!props.performance || !props.summary) return null;
  const base = props.summary.total_invested;
  if (!base) return null;
  return (props.performance.net_result / base) * 100;
});
</script>

<style lang="css" scoped>
.bh-kpi-strip {
  @apply grid gap-3;
  @apply grid-cols-1 md:grid-cols-2 xl:grid-cols-4;
}

.bh-kpi-strip__count {
  @apply font-poppins text-2xl font-semibold text-theme-text-primary;
  @apply tabular-nums;
}
</style>
