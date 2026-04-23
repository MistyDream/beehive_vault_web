<template>
  <section class="bh-recent-card">
    <header class="bh-recent-card__header">
      <h2 class="bh-recent-card__title">
        {{ t('portfolios.detail.resume.recent.title') }}
      </h2>
      <NuxtLink
        :to="localePath(`/portfolios/${portfolioId}/transactions`)"
        class="bh-recent-card__view-all"
      >
        {{ t('portfolios.detail.resume.recent.view_all') }}
        <LucideArrowRight :size="12" aria-hidden="true" />
      </NuxtLink>
    </header>

    <ul v-if="loading" class="bh-recent-card__list">
      <li v-for="n in 5" :key="n" class="bh-recent-card__item">
        <span class="bh-recent-card__skel-icon bh-skeleton" />
        <div class="bh-recent-card__skel-content">
          <span class="bh-recent-card__skel-line bh-skeleton" />
          <span class="bh-recent-card__skel-line bh-skeleton bh-recent-card__skel-line--short" />
        </div>
      </li>
    </ul>

    <div v-else-if="hasError" class="bh-recent-card__error" role="alert">
      <span class="bh-recent-card__error-text">
        {{ t('toast.error.generic') }}
      </span>
      <BHButton variant="ghost" size="sm" @click="refresh()">
        {{ t('portfolios.detail.error.retry') }}
      </BHButton>
    </div>

    <div v-else-if="items.length === 0" class="bh-recent-card__empty">
      <div class="bh-recent-card__empty-pattern bh-hex-pattern" aria-hidden="true" />
      <div class="bh-recent-card__empty-inner">
        <LucideReceipt :size="40" class="bh-recent-card__empty-icon" aria-hidden="true" />
        <p class="bh-recent-card__empty-title">
          {{ t('portfolios.detail.resume.recent.empty_title') }}
        </p>
        <p class="bh-recent-card__empty-description">
          {{ t('portfolios.detail.resume.recent.empty_description') }}
        </p>
      </div>
    </div>

    <ul v-else class="bh-recent-card__list">
      <li
        v-for="entry in entries"
        :key="entry.tx.id"
        class="bh-recent-card__item"
      >
        <span
          class="bh-recent-card__icon"
          :class="`bh-recent-card__icon--${entry.tx.transaction_type}`"
        >
          <component :is="iconForTransaction(entry.tx.transaction_type)" :size="16" aria-hidden="true" />
        </span>
        <div class="bh-recent-card__content">
          <div class="bh-recent-card__row">
            <span class="bh-recent-card__label">
              {{ labelFor(entry.tx) }}
            </span>
            <BHCurrencyDisplay
              v-if="entry.amount !== null"
              :amount="entry.amount"
              :currency="entry.tx.currency"
              size="sm"
            />
          </div>
          <div class="bh-recent-card__row bh-recent-card__row--meta">
            <span class="bh-recent-card__type">
              {{ t(`portfolios.detail.resume.tx_type.${entry.tx.transaction_type}`) }}
            </span>
            <span class="bh-recent-card__date">
              {{ formatDate(entry.tx.executed_at) }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { LucideArrowRight, LucideReceipt } from '#components';
import type { Transaction, TransactionsQuery } from '~/types/portfolio';
import { displayAmount, iconForTransaction } from '~/utils/transaction';

interface Props {
  portfolioId: number;
}

const props = defineProps<Props>();

const { t } = useI18n();
const localePath = useLocalePath();
const { formatDate } = useLocaleFormatters();

const { list } = useTransactionApi();
const query = computed<TransactionsQuery>(() => ({
  sort_by: 'executed_at',
  sort_dir: 'desc',
  limit: 5,
  page: 1,
}));
const { data, pending, error, refresh } = list(() => props.portfolioId, query);

const items = computed(() => data.value?.items ?? []);
const loading = computed(() => pending.value && !data.value);
const hasError = computed(() => !loading.value && !data.value && !!error.value);

const entries = computed(() =>
  items.value.map((tx) => ({ tx, amount: displayAmount(tx) })),
);

function labelFor(tx: Transaction): string {
  if (tx.stock) return tx.stock.symbol;
  return t(`portfolios.detail.resume.tx_type.${tx.transaction_type}`);
}
</script>

<style lang="css" scoped>
.bh-recent-card {
  @apply flex flex-col gap-3;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply p-4 md:p-5;
}

.bh-recent-card__header {
  @apply flex items-baseline justify-between gap-3;
}

.bh-recent-card__title {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-recent-card__view-all {
  @apply inline-flex items-center gap-1;
  @apply text-xs font-medium text-theme-accent-primary-strong;
  @apply underline underline-offset-2;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:rounded-md;
  @apply hover:text-theme-text-primary;
}

.bh-recent-card__list {
  @apply flex flex-col gap-2;
  @apply list-none m-0 p-0;
}

.bh-recent-card__item {
  @apply flex items-center gap-3;
  @apply py-2.5;
}

.bh-recent-card__icon {
  @apply flex items-center justify-center;
  @apply w-8 h-8 rounded-lg shrink-0;
  @apply bg-theme-bg-elevated text-theme-text-muted;
}

.bh-recent-card__icon--buy { @apply text-theme-status-success-strong; }
.bh-recent-card__icon--sell { @apply text-theme-status-error-strong; }
.bh-recent-card__icon--dividend { @apply text-theme-accent-primary-strong; }
.bh-recent-card__icon--fee { @apply text-theme-status-warning-strong; }
.bh-recent-card__icon--deposit { @apply text-theme-accent-secondary-strong; }
.bh-recent-card__icon--withdrawal { @apply text-theme-text-muted; }
.bh-recent-card__icon--split { @apply text-theme-text-muted; }

.bh-recent-card__content {
  @apply flex flex-col gap-0.5 flex-1 min-w-0;
}

.bh-recent-card__row {
  @apply flex items-baseline justify-between gap-2;
}

.bh-recent-card__row--meta {
  @apply text-xs text-theme-text-muted;
}

.bh-recent-card__label {
  @apply text-sm font-medium text-theme-text-primary truncate;
}

.bh-recent-card__date {
  @apply tabular-nums;
}

.bh-recent-card__empty {
  @apply relative overflow-hidden rounded-2xl;
}

.bh-recent-card__empty-pattern {
  @apply pointer-events-none absolute inset-0 opacity-[0.08];
}

.bh-recent-card__empty-inner {
  @apply relative flex flex-col items-center gap-2;
  @apply py-8 px-4 text-center;
}

.bh-recent-card__empty-icon {
  @apply text-theme-accent-primary/60;
}

.bh-recent-card__empty-title {
  @apply font-poppins text-base font-semibold text-theme-text-primary;
}

.bh-recent-card__empty-description {
  @apply text-sm text-theme-text-secondary max-w-xs;
}

.bh-recent-card__skel-icon {
  @apply block w-8 h-8 rounded-lg shrink-0;
}

.bh-recent-card__skel-content {
  @apply flex flex-col gap-1 flex-1;
}

.bh-recent-card__skel-line {
  @apply block h-3 w-full rounded;
}

.bh-recent-card__skel-line--short {
  @apply w-1/2;
}

.bh-recent-card__error {
  @apply flex items-center justify-between gap-3;
  @apply py-3;
}

.bh-recent-card__error-text {
  @apply text-sm text-theme-status-error;
}
</style>
