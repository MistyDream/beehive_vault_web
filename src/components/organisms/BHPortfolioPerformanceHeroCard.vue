<template>
  <section class="bh-perf-hero">
    <span class="bh-perf-hero__label">
      {{ t('portfolios.detail.performance.hero.label') }}
      <template v-if="periodLabel"> {{ periodLabel }}</template>
    </span>

    <div class="bh-perf-hero__value" aria-live="polite">
      <span v-if="loading" class="bh-perf-hero__skel bh-skeleton" />
      <BHCurrencyDisplay
        v-else-if="performance"
        :amount="performance.net_result"
        :currency="performance.currency"
        :show-sign="true"
        size="lg"
        class="bh-perf-hero__currency"
      />
      <span v-else class="bh-perf-hero__fallback">—</span>
    </div>

    <div
      v-if="performance && pctValue !== null"
      class="bh-perf-hero__pill"
      :class="pillClass"
    >
      <BHPercentDisplay
        :value="pctValue"
        :show-sign="true"
        :color-coded="false"
        size="sm"
      />
    </div>

    <p class="bh-perf-hero__caption">
      {{ t('portfolios.detail.performance.hero.caption') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import type { PerformanceReport } from '~/types/portfolio';

interface Props {
  performance: PerformanceReport | null | undefined;
  loading?: boolean;
  periodLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  periodLabel: '',
});

const { t } = useI18n();

const pctValue = computed<number | null>(() => {
  const perf = props.performance;
  if (!perf || !perf.total_deposited) return null;
  return (perf.net_result / perf.total_deposited) * 100;
});

const pillClass = computed(() => {
  const v = props.performance?.net_result ?? 0;
  if (v > 0) return 'bh-perf-hero__pill--positive';
  if (v < 0) return 'bh-perf-hero__pill--negative';
  return 'bh-perf-hero__pill--neutral';
});
</script>

<style lang="css" scoped>
.bh-perf-hero {
  @apply flex flex-col items-center gap-3;
  @apply bg-theme-bg-elevated rounded-2xl border border-theme-border-primary;
  @apply p-6 md:p-8;
  @apply text-center;
}

.bh-perf-hero__label {
  @apply text-xs font-medium uppercase tracking-wide;
  @apply text-theme-text-muted;
}

.bh-perf-hero__value {
  @apply flex items-baseline justify-center;
  @apply min-h-[3.5rem];
}

.bh-perf-hero__currency {
  @apply text-4xl md:text-5xl;
}

.bh-perf-hero__skel {
  @apply block h-12 w-60 rounded;
}

.bh-perf-hero__fallback {
  @apply text-theme-text-muted font-space text-4xl;
}

.bh-perf-hero__pill {
  @apply inline-flex items-center;
  @apply rounded-full px-3 py-1;
  @apply border;
}

.bh-perf-hero__pill--positive {
  @apply bg-theme-status-success/15 border-theme-status-success/30;
  @apply text-theme-status-success;
}

.bh-perf-hero__pill--negative {
  @apply bg-theme-status-error/15 border-theme-status-error/30;
  @apply text-theme-status-error;
}

.bh-perf-hero__pill--neutral {
  @apply bg-theme-bg-card border-theme-border-secondary;
  @apply text-theme-text-muted;
}

.bh-perf-hero__caption {
  @apply text-xs text-theme-text-muted;
  @apply max-w-md;
}
</style>
