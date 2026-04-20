<template>
  <div class="bh-stock-drawer">
    <header class="bh-stock-drawer__header">
      <div class="bh-stock-drawer__title-row">
        <BHStockAvatar :symbol="stockSymbol" size="md" />
        <div class="bh-stock-drawer__title-text">
          <span class="bh-stock-drawer__symbol">{{ stockSymbol }}</span>
          <span v-if="total > 0" class="bh-stock-drawer__count">
            {{ t('portfolios.detail.resume.drawer.count', total) }}
          </span>
        </div>
      </div>
    </header>

    <div v-if="loading" class="bh-stock-drawer__loading">
      <div v-for="n in 5" :key="n" class="bh-stock-drawer__skel-row bh-skeleton" />
    </div>

    <div v-else-if="error" class="bh-stock-drawer__error" role="alert">
      {{ t('toast.error.generic') }}
    </div>

    <div v-else-if="items.length === 0" class="bh-stock-drawer__empty">
      {{ t('portfolios.detail.resume.drawer.empty') }}
    </div>

    <ul v-else class="bh-stock-drawer__list">
      <li v-for="tx in items" :key="tx.id" class="bh-stock-drawer__item">
        <span
          class="bh-stock-drawer__icon"
          :class="`bh-stock-drawer__icon--${tx.transaction_type}`"
        >
          <component :is="iconFor(tx.transaction_type)" :size="16" aria-hidden="true" />
        </span>
        <div class="bh-stock-drawer__content">
          <div class="bh-stock-drawer__row">
            <span class="bh-stock-drawer__type">
              {{ t(`portfolios.detail.resume.tx_type.${tx.transaction_type}`) }}
            </span>
            <BHCurrencyDisplay
              v-if="tx.amount !== null"
              :amount="tx.amount"
              :currency="tx.currency"
              size="sm"
            />
          </div>
          <div class="bh-stock-drawer__row bh-stock-drawer__row--meta">
            <span v-if="tx.quantity !== null && tx.unit_price !== null">
              {{ formatQuantity(tx.quantity) }} ×
              <BHCurrencyDisplay
                :amount="tx.unit_price"
                :currency="tx.currency"
                size="sm"
              />
            </span>
            <span v-else />
            <span class="bh-stock-drawer__date">{{ formatDate(tx.executed_at) }}</span>
          </div>
        </div>
      </li>
    </ul>

    <footer class="bh-stock-drawer__footer">
      <BHButton variant="primary" size="md" @click="onViewFull">
        {{ t('portfolios.detail.resume.drawer.view_full') }}
      </BHButton>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  LucideArrowDownToLine,
  LucideArrowUpFromLine,
  LucideCircleDollarSign,
  LucideReceipt,
  LucideSplit,
  LucideTrendingDown,
  LucideTrendingUp,
} from '#components';
import type { TransactionType } from '~/types/portfolio';

interface Props {
  portfolioId: number;
  stockId: number;
  stockSymbol: string;
}

const props = defineProps<Props>();

const { t, locale } = useI18n();
const router = useRouter();
const drawer = useDrawer();

const { list } = useTransactionApi();
const query = computed(() => ({
  stock_id: props.stockId,
  sort_by: 'executed_at' as const,
  sort_dir: 'desc' as const,
  limit: 100,
  page: 1,
}));
const { data, pending, error } = list(() => props.portfolioId, query);

const items = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);
const loading = computed(() => pending.value && !data.value);

function iconFor(type: TransactionType) {
  switch (type) {
    case 'buy': return LucideTrendingUp;
    case 'sell': return LucideTrendingDown;
    case 'dividend': return LucideCircleDollarSign;
    case 'fee': return LucideReceipt;
    case 'split': return LucideSplit;
    case 'deposit': return LucideArrowDownToLine;
    case 'withdrawal': return LucideArrowUpFromLine;
  }
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat(locale.value, { maximumFractionDigits: 4 }).format(value);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(locale.value, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

async function onViewFull() {
  await router.push({
    path: `/portfolios/${props.portfolioId}/transactions`,
    query: { stock_id: String(props.stockId) },
  });
  drawer.close();
}
</script>

<style lang="css" scoped>
.bh-stock-drawer {
  @apply flex flex-col gap-4;
  @apply h-full;
}

.bh-stock-drawer__header {
  @apply pb-3 border-b border-theme-border-secondary;
}

.bh-stock-drawer__title-row {
  @apply flex items-center gap-3;
}

.bh-stock-drawer__title-text {
  @apply flex flex-col;
}

.bh-stock-drawer__symbol {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-stock-drawer__count {
  @apply text-xs text-theme-text-muted;
}

.bh-stock-drawer__loading {
  @apply flex flex-col gap-2;
}

.bh-stock-drawer__skel-row {
  @apply h-12 rounded;
}

.bh-stock-drawer__error {
  @apply text-sm text-theme-status-error;
  @apply p-4 rounded-lg bg-theme-status-error/10 border border-theme-status-error/30;
}

.bh-stock-drawer__empty {
  @apply text-sm text-theme-text-muted italic text-center py-8;
}

.bh-stock-drawer__list {
  @apply flex flex-col gap-2 flex-1 overflow-y-auto;
  @apply list-none m-0 p-0;
}

.bh-stock-drawer__item {
  @apply flex items-center gap-3;
  @apply py-2 px-1;
  @apply border-b border-theme-border-secondary/60;
}

.bh-stock-drawer__icon {
  @apply flex items-center justify-center;
  @apply w-8 h-8 rounded-lg shrink-0;
  @apply bg-theme-bg-elevated text-theme-text-muted;
}

.bh-stock-drawer__icon--buy { @apply text-theme-status-success-strong; }
.bh-stock-drawer__icon--sell { @apply text-theme-status-error-strong; }
.bh-stock-drawer__icon--dividend { @apply text-theme-accent-primary-strong; }
.bh-stock-drawer__icon--fee { @apply text-theme-status-warning-strong; }
.bh-stock-drawer__icon--deposit { @apply text-theme-accent-secondary-strong; }
.bh-stock-drawer__icon--withdrawal { @apply text-theme-text-muted; }
.bh-stock-drawer__icon--split { @apply text-theme-text-muted; }

.bh-stock-drawer__content {
  @apply flex flex-col gap-0.5 flex-1 min-w-0;
}

.bh-stock-drawer__row {
  @apply flex items-baseline justify-between gap-2;
}

.bh-stock-drawer__row--meta {
  @apply text-xs text-theme-text-muted tabular-nums;
}

.bh-stock-drawer__type {
  @apply text-sm font-medium text-theme-text-primary capitalize;
}

.bh-stock-drawer__date {
  @apply tabular-nums;
}

.bh-stock-drawer__footer {
  @apply pt-3 border-t border-theme-border-secondary;
  @apply flex justify-end;
}
</style>
