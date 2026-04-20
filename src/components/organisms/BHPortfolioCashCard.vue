<template>
  <section class="bh-cash-card">
    <header class="bh-cash-card__header">
      <h2 class="bh-cash-card__title">
        {{ t('portfolios.detail.resume.cash.title') }}
      </h2>
    </header>

    <div class="bh-cash-card__balance">
      <span v-if="summaryLoading" class="bh-cash-card__skel-balance bh-skeleton" />
      <BHCurrencyDisplay
        v-else-if="summaryData"
        :amount="summaryData.cash.balance"
        :currency="summaryData.cash.currency"
        size="lg"
      />
      <span v-else class="bh-cash-card__fallback">—</span>
    </div>

    <div class="bh-cash-card__flows">
      <div class="bh-cash-card__flow">
        <span class="bh-cash-card__flow-label">
          {{ t('portfolios.detail.resume.cash.deposits') }}
        </span>
        <span v-if="performanceLoading" class="bh-cash-card__skel-flow bh-skeleton" />
        <BHCurrencyDisplay
          v-else-if="performanceData"
          :amount="performanceData.total_deposited"
          :currency="performanceData.currency"
          size="sm"
        />
        <span v-else class="bh-cash-card__fallback">—</span>
      </div>
      <div class="bh-cash-card__flow">
        <span class="bh-cash-card__flow-label">
          {{ t('portfolios.detail.resume.cash.withdrawals') }}
        </span>
        <span v-if="performanceLoading" class="bh-cash-card__skel-flow bh-skeleton" />
        <BHCurrencyDisplay
          v-else-if="performanceData"
          :amount="performanceData.total_withdrawn"
          :currency="performanceData.currency"
          size="sm"
        />
        <span v-else class="bh-cash-card__fallback">—</span>
      </div>
    </div>

    <BHButton
      variant="ghost"
      size="sm"
      class="bh-cash-card__cta"
      @click="onAddDeposit"
    >
      <LucidePlus :size="14" aria-hidden="true" />
      {{ t('portfolios.detail.resume.cash.add_deposit') }}
    </BHButton>
  </section>
</template>

<script setup lang="ts">
import { LucidePlus } from '#components';

interface Props {
  portfolioId: number;
}

const props = defineProps<Props>();

const { t } = useI18n();
const toast = useToast();

const {
  summary: summaryData,
  performance: performanceData,
  summaryPending,
  performancePending,
} = usePortfolioDetail(() => props.portfolioId);

const summaryLoading = computed(() => summaryPending.value && !summaryData.value);
const performanceLoading = computed(() => performancePending.value && !performanceData.value);

function onAddDeposit() {
  toast.info(t('toast.coming_soon'));
}
</script>

<style lang="css" scoped>
.bh-cash-card {
  @apply flex flex-col gap-3;
  @apply bg-theme-bg-elevated rounded-2xl border border-theme-border-primary;
  @apply p-4 md:p-5;
}

.bh-cash-card__header {
  @apply flex items-baseline justify-between;
}

.bh-cash-card__title {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-cash-card__balance {
  @apply flex items-baseline;
  @apply min-h-[2.5rem];
}

.bh-cash-card__skel-balance {
  @apply block h-8 w-40 rounded;
}

.bh-cash-card__flows {
  @apply grid grid-cols-2 gap-3;
  @apply pt-3 border-t border-theme-border-secondary;
}

.bh-cash-card__flow {
  @apply flex flex-col gap-1;
}

.bh-cash-card__flow-label {
  @apply text-xs text-theme-text-muted uppercase tracking-wide;
}

.bh-cash-card__skel-flow {
  @apply block h-4 w-20 rounded;
}

.bh-cash-card__fallback {
  @apply text-theme-text-muted font-space;
}

.bh-cash-card__cta {
  @apply self-start;
}
</style>
