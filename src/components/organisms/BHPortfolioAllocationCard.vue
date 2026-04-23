<template>
  <section v-if="!isHidden" class="bh-allocation-card">
    <header class="bh-allocation-card__header">
      <h2 class="bh-allocation-card__title">
        {{ t('portfolios.detail.resume.allocation.title') }}
      </h2>
    </header>

    <div v-if="loading" class="bh-allocation-card__loading">
      <div class="bh-allocation-card__skel-bar bh-skeleton" />
      <div class="bh-allocation-card__skel-legend">
        <div v-for="n in 5" :key="n" class="bh-allocation-card__skel-chip bh-skeleton" />
      </div>
    </div>

    <template v-else>
      <div class="bh-allocation-card__bar" role="img" :aria-label="barAriaLabel">
        <div
          v-for="segment in segments"
          :key="segment.key"
          class="bh-allocation-card__segment"
          :style="{ width: `${segment.percent}%`, backgroundColor: segment.color }"
          :title="`${segment.label} · ${formatPercent(segment.fraction)}`"
        />
      </div>

      <ul class="bh-allocation-card__legend">
        <li
          v-for="segment in segments"
          :key="segment.key"
          class="bh-allocation-card__legend-item"
        >
          <BHStockAvatar
            v-if="segment.symbol"
            :symbol="segment.symbol"
            size="sm"
          />
          <span
            v-else
            class="bh-allocation-card__legend-dot"
            :style="{ backgroundColor: segment.color }"
            aria-hidden="true"
          />
          <span class="bh-allocation-card__legend-label">{{ segment.label }}</span>
          <span class="bh-allocation-card__legend-value">
            {{ formatPercent(segment.fraction) }}
          </span>
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { Position } from '~/types/portfolio';
import { colorFromSymbol } from '~/utils/stringToColor';

interface Props {
  portfolioId: number;
}

const props = defineProps<Props>();

const { t } = useI18n();
const { formatPercent } = useLocaleFormatters();

const { summary: summaryData, summaryPending: pending } = usePortfolioDetail(
  () => props.portfolioId,
);

const loading = computed(() => pending.value && !summaryData.value);
const isHidden = computed(() => !loading.value && (summaryData.value?.positions.length ?? 0) === 0);

interface Segment {
  key: string;
  label: string;
  symbol: string | null;
  fraction: number;
  percent: number;
  color: string;
}

const segments = computed<Segment[]>(() => {
  const positions: Position[] = [...(summaryData.value?.positions ?? [])];
  if (positions.length === 0) return [];

  positions.sort((a, b) => b.total_cost - a.total_cost);
  const top = positions.slice(0, 5);
  const rest = positions.slice(5);

  const result: Segment[] = top.map((p) => ({
    key: `stock-${p.stock.id}`,
    label: p.stock.symbol,
    symbol: p.stock.symbol,
    fraction: p.weight,
    percent: p.weight * 100,
    color: colorFromSymbol(p.stock.symbol),
  }));

  if (rest.length > 0) {
    const othersWeight = rest.reduce((sum, p) => sum + p.weight, 0);
    result.push({
      key: 'others',
      label: t('portfolios.detail.resume.allocation.others'),
      symbol: null,
      fraction: othersWeight,
      percent: othersWeight * 100,
      color: 'rgb(var(--color-text-muted))',
    });
  }

  return result;
});

const barAriaLabel = computed(() =>
  segments.value
    .map((s) => `${s.label} ${formatPercent(s.fraction)}`)
    .join(', '),
);

</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-allocation-card {
  @apply flex flex-col gap-3;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply p-4 md:p-5;
}

.bh-allocation-card__header {
  @apply flex items-baseline justify-between;
}

.bh-allocation-card__title {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-allocation-card__bar {
  @apply flex h-4 w-full rounded-md overflow-hidden;
  @apply bg-theme-bg-elevated;
}

.bh-allocation-card__segment {
  @apply transition-[width] duration-300 ease-out;
  min-width: 6px;
}

.bh-allocation-card__legend {
  @apply flex flex-wrap gap-x-4 gap-y-2;
  @apply list-none m-0 p-0;
}

.bh-allocation-card__legend-item {
  @apply flex items-center gap-2;
  @apply text-sm text-theme-text-secondary;
}

.bh-allocation-card__legend-dot {
  @apply inline-block w-3 h-3 rounded-full;
}

.bh-allocation-card__legend-label {
  @apply font-medium text-theme-text-primary;
}

.bh-allocation-card__legend-value {
  @apply tabular-nums text-theme-text-muted;
}

.bh-allocation-card__loading {
  @apply flex flex-col gap-3;
}

.bh-allocation-card__skel-bar {
  @apply h-4 w-full rounded-md;
}

.bh-allocation-card__skel-legend {
  @apply flex flex-wrap gap-2;
}

.bh-allocation-card__skel-chip {
  @apply h-5 w-20 rounded-full;
}
</style>
