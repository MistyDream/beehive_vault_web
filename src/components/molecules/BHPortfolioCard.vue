<template>
  <NuxtLink :to="`/portfolios/${portfolio.id}`" class="bh-portfolio-card">
    <div class="bh-portfolio-card__pattern bh-hex-pattern" aria-hidden="true" />
    <div class="bh-portfolio-card__head">
      <div class="bh-portfolio-card__head-left">
        <h3 class="bh-portfolio-card__name">{{ portfolio.name }}</h3>
        <div class="bh-portfolio-card__meta">
          <BHBadge
            :variant="portfolio.kind === 'real' ? 'success' : 'info'"
            size="sm"
          >
            {{ kindLabel }}
          </BHBadge>
          <BHTag color="neutral">{{ portfolio.currency }}</BHTag>
        </div>
      </div>
    </div>

    <p v-if="portfolio.description" class="bh-portfolio-card__description">
      {{ portfolio.description }}
    </p>

    <div class="bh-portfolio-card__kpis">
      <div class="bh-portfolio-card__kpi">
        <span class="bh-portfolio-card__kpi-label">
          {{ t('portfolios.card.invested_label') }}
        </span>
        <span class="bh-portfolio-card__kpi-value">
          <span v-if="summaryPending" class="bh-portfolio-card__skeleton bh-skeleton" />
          <BHCurrencyDisplay
            v-else-if="summaryData"
            :amount="summaryData.total_invested"
            :currency="portfolio.currency"
            size="md"
          />
          <span v-else class="bh-portfolio-card__fallback">—</span>
        </span>
      </div>
      <div class="bh-portfolio-card__kpi">
        <span class="bh-portfolio-card__kpi-label">
          {{ t('portfolios.card.cash_label') }}
        </span>
        <span class="bh-portfolio-card__kpi-value">
          <span v-if="summaryPending" class="bh-portfolio-card__skeleton bh-skeleton" />
          <BHCurrencyDisplay
            v-else-if="summaryData"
            :amount="summaryData.cash.balance"
            :currency="summaryData.cash.currency"
            size="md"
          />
          <span v-else class="bh-portfolio-card__fallback">—</span>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Portfolio } from '~/types/portfolio';

interface Props {
  portfolio: Portfolio;
}

const props = defineProps<Props>();

const { t } = useI18n();

const kindLabel = computed(() =>
  props.portfolio.kind === 'real'
    ? t('portfolios.form.kind_real')
    : t('portfolios.form.kind_virtual'),
);

const { summary } = usePortfolioApi();
const { data: summaryData, pending: summaryPending } = summary(
  () => props.portfolio.id,
);
</script>

<style lang="css" scoped>
.bh-portfolio-card {
  @apply relative overflow-hidden;
  @apply flex flex-col gap-3;
  @apply p-4 md:p-5;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply transition-colors duration-300 ease-out;
  @apply hover:bg-theme-bg-elevated cursor-pointer;
}

/* Light mode: darker hover for better feedback on warm bg */
:root:not(.dark) .bh-portfolio-card:hover {
  background-color: rgb(225 220 209);
  @apply no-underline;
}

.bh-portfolio-card__pattern {
  @apply pointer-events-none absolute inset-0;
  @apply opacity-[0.05];
}

.bh-portfolio-card > *:not(.bh-portfolio-card__pattern) {
  @apply relative;
}

.bh-portfolio-card__head {
  @apply flex items-start justify-between gap-3;
}

.bh-portfolio-card__head-left {
  @apply flex flex-col gap-2 flex-1 min-w-0;
}

.bh-portfolio-card__name {
  @apply font-poppins text-lg md:text-xl font-semibold text-theme-text-primary;
  @apply truncate;
}

.bh-portfolio-card__meta {
  @apply flex items-center gap-2 flex-wrap;
}

.bh-portfolio-card__description {
  @apply text-sm text-theme-text-secondary;
  @apply line-clamp-1;
}

.bh-portfolio-card__kpis {
  @apply mt-1;
  @apply grid grid-cols-2 gap-4;
}

.bh-portfolio-card__kpi {
  @apply flex flex-col gap-1;
}

.bh-portfolio-card__kpi-label {
  @apply text-xs text-theme-text-muted uppercase tracking-wide;
}

.bh-portfolio-card__kpi-value {
  @apply flex items-center;
  @apply min-h-[1.5rem];
}

.bh-portfolio-card__skeleton {
  @apply block w-20 h-4 rounded;
}

.bh-portfolio-card__fallback {
  @apply text-theme-text-muted font-space;
}
</style>
