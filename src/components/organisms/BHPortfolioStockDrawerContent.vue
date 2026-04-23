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
      <span>{{ t('toast.error.generic') }}</span>
      <BHButton variant="secondary" size="sm" @click="refresh()">
        {{ t('portfolios.detail.error.retry') }}
      </BHButton>
    </div>

    <div v-else-if="items.length === 0" class="bh-stock-drawer__empty">
      {{ t('portfolios.detail.resume.drawer.empty') }}
    </div>

    <ul v-else class="bh-stock-drawer__list">
      <li v-for="entry in entries" :key="entry.tx.id" class="bh-stock-drawer__item">
        <span
          class="bh-stock-drawer__icon"
          :class="`bh-stock-drawer__icon--${entry.tx.transaction_type}`"
        >
          <component :is="iconForTransaction(entry.tx.transaction_type)" :size="16" aria-hidden="true" />
        </span>
        <div class="bh-stock-drawer__content">
          <div class="bh-stock-drawer__row">
            <span class="bh-stock-drawer__type">
              {{ t(`portfolios.detail.resume.tx_type.${entry.tx.transaction_type}`) }}
            </span>
            <BHCurrencyDisplay
              v-if="entry.amount !== null"
              :amount="entry.amount"
              :currency="entry.tx.currency"
              size="sm"
            />
          </div>
          <div class="bh-stock-drawer__row bh-stock-drawer__row--meta">
            <span v-if="entry.tx.quantity !== null && entry.tx.unit_price !== null">
              {{ formatQuantity(entry.tx.quantity) }} ×
              <BHCurrencyDisplay
                :amount="entry.tx.unit_price"
                :currency="entry.tx.currency"
                size="sm"
              />
            </span>
            <span v-else />
            <span class="bh-stock-drawer__date">{{ formatDate(entry.tx.executed_at) }}</span>
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
import type { TransactionsQuery } from '~/types/portfolio';
import { displayAmount, iconForTransaction } from '~/utils/transaction';

interface Props {
  portfolioId: number;
  stockId: number;
  stockSymbol: string;
}

const props = defineProps<Props>();

const { t } = useI18n();
const { formatQuantity, formatDate } = useLocaleFormatters();
const router = useRouter();
const localePath = useLocalePath();
const drawer = useDrawer();

const { list } = useTransactionApi();
const query = computed<TransactionsQuery>(() => ({
  stock_id: props.stockId,
  sort_by: 'executed_at',
  sort_dir: 'desc',
  limit: 20,
  page: 1,
}));
const { data, pending, error, refresh } = list(() => props.portfolioId, query);

const items = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);
const loading = computed(() => pending.value && !data.value);

const entries = computed(() =>
  items.value.map((tx) => ({ tx, amount: displayAmount(tx) })),
);

async function onViewFull() {
  await router.push({
    path: localePath(`/portfolios/${props.portfolioId}/transactions`),
    query: { stock_id: String(props.stockId) },
  });
  drawer.close();
}
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

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
  @apply flex items-center justify-between gap-3;
  @apply text-sm text-theme-status-error-strong;
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

.bh-stock-drawer__item:last-child {
  @apply border-b-0;
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
  @apply text-sm font-medium text-theme-text-primary;
}

.bh-stock-drawer__date {
  @apply tabular-nums;
}

.bh-stock-drawer__footer {
  @apply pt-3 border-t border-theme-border-secondary;
  @apply flex justify-end;
}
</style>
