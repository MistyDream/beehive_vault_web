<template>
  <div class="bh-kpi-strip" aria-live="polite">
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
