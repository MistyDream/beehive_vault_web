<template>
  <div class="portfolio-performance">
    <header class="portfolio-performance__toolbar">
      <h2 class="portfolio-performance__title">
        {{ t('portfolios.detail.performance.title') }}
      </h2>
      <BHPortfolioPeriodPicker
        :model-value="periodState"
        @update:model-value="setPeriodState"
      />
    </header>

    <div v-if="hasError" class="portfolio-performance__error" role="alert">
      <h2 class="portfolio-performance__error-title">
        {{ t('portfolios.detail.performance.error_title') }}
      </h2>
      <p class="portfolio-performance__error-description">
        {{ t('portfolios.detail.performance.error_description') }}
      </p>
      <BHButton variant="secondary" size="md" @click="() => refresh()">
        {{ t('portfolios.detail.performance.error_retry') }}
      </BHButton>
    </div>

    <template v-else>
      <BHPortfolioPerformanceHeroCard
        :performance="performance"
        :loading="loading"
        :period-label="periodLabel"
      />

      <BHPortfolioPerformanceWaterfallCard :performance="performance" />

      <BHPortfolioPerformanceBreakdownCard
        :performance="performance"
        :loading="loading"
      />

      <BHPortfolioPerformanceFormulaCard />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  DEFAULT_PERIOD_STATE,
  isPeriodPreset,
  toPerformanceFilters,
  type PeriodState,
} from '~/utils/performance-period';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const id = computed(() => Number(route.params.id));

function parseIsoDate(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.length === 0) return undefined;
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined;
}

function parseInitialState(): PeriodState {
  const preset = route.query.period;
  if (!isPeriodPreset(preset)) return DEFAULT_PERIOD_STATE;
  if (preset === 'custom') {
    return {
      preset,
      from: parseIsoDate(route.query.from),
      to: parseIsoDate(route.query.to),
    };
  }
  return { preset };
}

const periodState = ref<PeriodState>(parseInitialState());

function setPeriodState(value: PeriodState) {
  periodState.value = value;
}

const filters = computed(() => toPerformanceFilters(periodState.value));

const periodLabel = computed(() =>
  t(`portfolios.detail.performance.period.preset_${periodState.value.preset}`),
);

const { performance: performanceFn } = usePortfolioApi();
const {
  data: performance,
  pending,
  error,
  refresh,
} = performanceFn(id, filters);

const loading = computed(() => pending.value && !performance.value);
const hasError = computed(() => !!error.value && !performance.value);

watch(
  periodState,
  (state) => {
    const q: Record<string, string> = {};
    if (state.preset !== DEFAULT_PERIOD_STATE.preset) {
      q.period = state.preset;
    }
    if (state.preset === 'custom') {
      if (state.from) q.from = state.from;
      if (state.to) q.to = state.to;
    }
    router.replace({ query: q });
  },
  { deep: true },
);
</script>

<style lang="css" scoped>
.portfolio-performance {
  @apply flex flex-col gap-4 lg:gap-6;
}

.portfolio-performance__toolbar {
  @apply flex flex-col gap-3;
  @apply sm:flex-row sm:items-start sm:justify-between;
}

.portfolio-performance__title {
  @apply font-poppins text-xl font-semibold text-theme-text-primary;
}

.portfolio-performance__error {
  @apply flex flex-col items-start gap-3;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply p-5 md:p-6;
}

.portfolio-performance__error-title {
  @apply font-poppins text-base font-semibold text-theme-status-error-strong;
}

.portfolio-performance__error-description {
  @apply text-sm text-theme-text-secondary;
}
</style>
