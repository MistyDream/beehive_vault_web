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
        size="lg"
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
        size="lg"
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
          size="lg"
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

    <span class="sr-only" aria-live="polite">{{ srSummary }}</span>
  </div>
</template>

<script setup lang="ts">
import {
  LucideBanknote,
  LucideWallet,
  LucideTrendingUp,
  LucideLayers,
} from '#components';

interface Props {
  portfolioId: number;
  currency: string;
}

const props = defineProps<Props>();

const { t } = useI18n();

const { summary, performance, summaryPending, performancePending } =
  usePortfolioDetail(() => props.portfolioId);

const netResultPercent = computed(() => {
  if (!performance.value || !summary.value) return null;
  const base = summary.value.total_invested;
  if (!base) return null;
  return (performance.value.net_result / base) * 100;
});

const srSummary = computed(() => {
  if (summaryPending.value || performancePending.value) return '';
  if (!summary.value) return '';
  const parts = [
    `${t('portfolios.detail.kpi.invested')}: ${summary.value.total_invested} ${props.currency}`,
    `${t('portfolios.detail.kpi.cash')}: ${summary.value.cash.balance} ${summary.value.cash.currency}`,
  ];
  if (performance.value) {
    parts.push(
      `${t('portfolios.detail.kpi.net_result')}: ${performance.value.net_result} ${performance.value.currency}`,
    );
  }
  parts.push(
    `${t('portfolios.detail.kpi.positions_count')}: ${summary.value.positions.length}`,
  );
  return parts.join(', ');
});
</script>

<style lang="css" scoped>
.bh-kpi-strip {
  @apply grid gap-3;
  @apply grid-cols-1 md:grid-cols-2 xl:grid-cols-4;
}

.bh-kpi-strip__count {
  @apply font-space text-2xl font-semibold text-theme-text-primary;
  @apply tabular-nums;
}
</style>
