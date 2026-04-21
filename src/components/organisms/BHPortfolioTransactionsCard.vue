<template>
  <section class="bh-tx-card">
    <header class="bh-tx-card__header">
      <h2 class="bh-tx-card__title">
        {{ t('portfolios.detail.transactions.title') }}
      </h2>
      <p
        v-if="statsAvailable"
        class="bh-tx-card__summary"
        aria-live="polite"
      >
        <span class="bh-tx-card__summary-total">
          {{
            statsTotal === 0
              ? t('portfolios.detail.transactions.summary.total_zero')
              : t('portfolios.detail.transactions.summary.total', statsTotal)
          }}
        </span>
        <template v-for="chunk in summaryBreakdown" :key="chunk.type">
          <span class="bh-tx-card__summary-sep" aria-hidden="true">·</span>
          <span class="bh-tx-card__summary-item">
            <span class="bh-tx-card__summary-count">{{ chunk.count }}</span>
            {{ t(`portfolios.detail.resume.tx_type.${chunk.type}`) }}
          </span>
        </template>
      </p>
    </header>

    <div v-if="loading" class="bh-tx-card__state bh-tx-card__state--loading">
      <div
        v-for="n in 8"
        :key="n"
        class="bh-tx-card__skel-row bh-skeleton"
      />
    </div>

    <div
      v-else-if="hasError"
      class="bh-tx-card__state bh-tx-card__state--error"
    >
      <h3 class="bh-tx-card__state-title">
        {{ t('portfolios.detail.transactions.error_title') }}
      </h3>
      <p class="bh-tx-card__state-description">
        {{ t('portfolios.detail.transactions.error_description') }}
      </p>
      <BHButton variant="secondary" @click="refresh()">
        {{ t('portfolios.detail.transactions.error_retry') }}
      </BHButton>
    </div>

    <div
      v-else-if="isEmpty"
      class="bh-tx-card__state bh-tx-card__state--empty"
    >
      <div class="bh-tx-card__empty-pattern bh-hex-pattern" aria-hidden="true" />
      <div class="bh-tx-card__empty-inner">
        <LucideHexagon
          :size="48"
          class="bh-tx-card__empty-icon"
          aria-hidden="true"
        />
        <p class="bh-tx-card__empty-title">
          {{
            hasActiveFilters
              ? t('portfolios.detail.transactions.empty_filtered_title')
              : t('portfolios.detail.transactions.empty_title')
          }}
        </p>
        <p class="bh-tx-card__empty-description">
          {{
            hasActiveFilters
              ? t('portfolios.detail.transactions.empty_filtered_description')
              : t('portfolios.detail.transactions.empty_description')
          }}
        </p>
      </div>
    </div>

    <BHTable
      v-else
      :data="items"
      :total="total"
      :columns="columns"
      :page="page"
      :items-per-page="limit"
      :sort-by="sortBy"
      :sort-direction="sortDir"
      @sort-change="onSortChange"
      @page-change="onPageChange"
    >
      <template #rows="{ sortedData }">
        <template v-for="tx in sortedData as Transaction[]" :key="tx.id">
          <tr
            class="bh-tx-card__row"
            :class="{ 'bh-tx-card__row--expanded': expandedId === tx.id }"
            @click="toggleExpanded(tx.id)"
          >
            <td class="bh-tx-card__cell bh-tx-card__cell--date">
              {{ formatDate(tx.executed_at) }}
            </td>
            <td class="bh-tx-card__cell">
              <span
                class="bh-tx-card__type"
                :class="`bh-tx-card__type--${tx.transaction_type}`"
              >
                <component
                  :is="iconForTransaction(tx.transaction_type)"
                  :size="12"
                  aria-hidden="true"
                />
                {{ t(`portfolios.detail.resume.tx_type.${tx.transaction_type}`) }}
              </span>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--action">
              <div v-if="tx.stock" class="bh-tx-card__action">
                <BHStockAvatar :symbol="tx.stock.symbol" size="sm" />
                <span class="bh-tx-card__action-body">
                  <span class="bh-tx-card__action-symbol">{{ tx.stock.symbol }}</span>
                  <span class="bh-tx-card__action-name">{{ tx.stock.name }}</span>
                </span>
              </div>
              <span v-else class="bh-tx-card__action-none">
                {{ t('portfolios.detail.transactions.row.no_action') }}
              </span>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--num">
              <template v-if="tx.transaction_type === 'split'">
                {{
                  t('portfolios.detail.transactions.row.split_display', {
                    from: tx.split_from ?? '',
                    to: tx.split_to ?? '',
                  })
                }}
              </template>
              <template v-else-if="tx.quantity !== null">
                {{ formatQuantity(tx.quantity) }}
              </template>
              <template v-else>—</template>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--num">
              <BHCurrencyDisplay
                v-if="tx.unit_price !== null"
                :amount="tx.unit_price"
                :currency="tx.currency"
                size="sm"
              />
              <span v-else>—</span>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--num">
              <BHCurrencyDisplay
                v-if="signedAmount(tx) !== null"
                :amount="signedAmount(tx)!"
                :currency="tx.currency"
                show-sign
                size="sm"
              />
              <span v-else>—</span>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--num">
              <BHCurrencyDisplay
                v-if="tx.fees > 0"
                :amount="tx.fees"
                :currency="tx.currency"
                size="sm"
              />
              <span v-else class="bh-tx-card__dash">—</span>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--num">
              <BHCurrencyDisplay
                v-if="tx.tax > 0"
                :amount="tx.tax"
                :currency="tx.currency"
                size="sm"
              />
              <span v-else class="bh-tx-card__dash">—</span>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--currency">
              {{ tx.currency }}
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--notes">
              <span
                v-if="tx.notes"
                role="img"
                :aria-label="t('portfolios.detail.transactions.row.has_notes')"
                class="bh-tx-card__notes-icon"
              >
                <LucideStickyNote :size="16" aria-hidden="true" />
              </span>
            </td>
            <td class="bh-tx-card__cell bh-tx-card__cell--chevron">
              <button
                type="button"
                class="bh-tx-card__row-action"
                :aria-expanded="expandedId === tx.id"
                :aria-controls="`tx-details-${tx.id}`"
                :aria-label="
                  expandedId === tx.id
                    ? t('portfolios.detail.transactions.row.collapse')
                    : t('portfolios.detail.transactions.row.expand')
                "
                @click.stop="toggleExpanded(tx.id)"
              >
                <LucideChevronDown
                  :size="16"
                  class="bh-tx-card__chevron"
                  :class="{ 'bh-tx-card__chevron--open': expandedId === tx.id }"
                  aria-hidden="true"
                />
              </button>
            </td>
          </tr>
          <tr
            v-if="expandedId === tx.id"
            :id="`tx-details-${tx.id}`"
            class="bh-tx-card__details-row"
          >
            <td :colspan="columns.length" class="bh-tx-card__details-cell">
              <div
                class="bh-tx-card__details"
                role="region"
                :aria-label="t('portfolios.detail.transactions.detail.region_label', { date: formatDate(tx.executed_at) })"
              >
                <dl class="bh-tx-card__details-grid">
                  <div class="bh-tx-card__details-field">
                    <dt class="bh-tx-card__details-label">
                      {{ t('portfolios.detail.transactions.detail.notes_label') }}
                    </dt>
                    <dd class="bh-tx-card__details-value">
                      {{
                        tx.notes
                          || t('portfolios.detail.transactions.detail.no_notes')
                      }}
                    </dd>
                  </div>
                  <div class="bh-tx-card__details-field">
                    <dt class="bh-tx-card__details-label">
                      {{
                        t(
                          'portfolios.detail.transactions.detail.exchange_rate_label',
                        )
                      }}
                    </dt>
                    <dd class="bh-tx-card__details-value">
                      {{ formatQuantity(tx.exchange_rate) }}
                    </dd>
                  </div>
                </dl>
                <div class="bh-tx-card__details-actions">
                  <BHButton variant="ghost" @click.stop="onEdit(tx)">
                    <LucidePencil :size="14" aria-hidden="true" />
                    {{ t('portfolios.detail.transactions.detail.edit') }}
                  </BHButton>
                  <BHButton variant="ghost" @click.stop="onDuplicate(tx)">
                    <LucideCopy :size="14" aria-hidden="true" />
                    {{ t('portfolios.detail.transactions.detail.duplicate') }}
                  </BHButton>
                  <BHButton variant="ghost" @click.stop="onDelete(tx)">
                    <LucideTrash2
                      :size="14"
                      class="bh-tx-card__delete-icon"
                      aria-hidden="true"
                    />
                    {{ t('portfolios.detail.transactions.detail.delete') }}
                  </BHButton>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </template>
    </BHTable>
  </section>
</template>

<script setup lang="ts">
import {
  LucideChevronDown,
  LucideCopy,
  LucideHexagon,
  LucidePencil,
  LucideStickyNote,
  LucideTrash2,
} from '#components';
import type {
  SortDirection,
  Transaction,
  TransactionFilters,
  TransactionsQuery,
  TransactionsSortBy,
} from '~/types/portfolio';
import { iconForTransaction, signedAmount } from '~/utils/transaction';

interface Props {
  portfolioId: number;
  filters: TransactionFilters;
  page: number;
  sortBy: TransactionsSortBy;
  sortDir: SortDirection;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 25,
});

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'sort-change', sortBy: TransactionsSortBy, direction: SortDirection): void;
}>();

const { t } = useI18n();
const toast = useToast();
const { formatDate, formatQuantity } = useLocaleFormatters();

const limit = computed(() => props.itemsPerPage);
const expandedId = ref<number | null>(null);

const columns = computed(() => [
  {
    key: 'executed_at',
    label: t('portfolios.detail.transactions.columns.date'),
    sortable: true,
  },
  {
    key: 'transaction_type',
    label: t('portfolios.detail.transactions.columns.type'),
    sortable: true,
  },
  {
    key: 'action',
    label: t('portfolios.detail.transactions.columns.action'),
    sortable: false,
  },
  {
    key: 'quantity',
    label: t('portfolios.detail.transactions.columns.quantity'),
    sortable: false,
  },
  {
    key: 'unit_price',
    label: t('portfolios.detail.transactions.columns.unit_price'),
    sortable: false,
  },
  {
    key: 'amount',
    label: t('portfolios.detail.transactions.columns.amount'),
    sortable: true,
  },
  {
    key: 'fees',
    label: t('portfolios.detail.transactions.columns.fees'),
    sortable: false,
  },
  {
    key: 'tax',
    label: t('portfolios.detail.transactions.columns.tax'),
    sortable: false,
  },
  {
    key: 'currency',
    label: t('portfolios.detail.transactions.columns.currency'),
    sortable: false,
  },
  {
    key: '_notes',
    label: '',
    sortable: false,
  },
  {
    key: '_chevron',
    label: '',
    sortable: false,
  },
]);

const { list, stats } = useTransactionApi();

const query = computed<TransactionsQuery>(() => ({
  transaction_types: props.filters.transaction_types,
  stock_id: props.filters.stock_id,
  from_date: props.filters.from_date,
  to_date: props.filters.to_date,
  sort_by: props.sortBy,
  sort_dir: props.sortDir,
  page: props.page,
  limit: limit.value,
}));

const { data, pending, error, refresh } = list(() => props.portfolioId, query);

const { data: statsData } = stats(() => props.portfolioId);

const items = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);
const loading = computed(() => pending.value && !data.value);
const hasError = computed(() => !loading.value && !!error.value);
const hasActiveFilters = computed(
  () =>
    (props.filters.transaction_types?.length ?? 0) > 0
    || props.filters.stock_id !== undefined
    || !!props.filters.from_date
    || !!props.filters.to_date,
);
const isEmpty = computed(
  () => !loading.value && !hasError.value && items.value.length === 0,
);

const statsAvailable = computed(() => !!statsData.value);
const statsTotal = computed(() => statsData.value?.total ?? 0);

const summaryBreakdown = computed(() => {
  const by = statsData.value?.by_type;
  if (!by) return [];
  return (Object.entries(by) as Array<[keyof typeof by, number]>)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({ type, count }));
});

function toggleExpanded(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

watch(
  () => [props.page, props.sortBy, props.sortDir, props.filters],
  () => {
    expandedId.value = null;
  },
  { deep: true },
);

function onSortChange(by: string, direction: SortDirection) {
  emit('sort-change', by as TransactionsSortBy, direction);
}

function onPageChange(newPage: number) {
  emit('page-change', newPage);
}

function onEdit(_tx: Transaction) {
  toast.info(t('toast.coming_soon'));
}

function onDuplicate(_tx: Transaction) {
  toast.info(t('toast.coming_soon'));
}

function onDelete(_tx: Transaction) {
  toast.info(t('toast.coming_soon'));
}
</script>

<style lang="css" scoped>
.bh-tx-card {
  @apply flex flex-col gap-3;
}

.bh-tx-card__header {
  @apply flex flex-col gap-1 px-1;
}

.bh-tx-card__title {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-tx-card__summary {
  @apply flex flex-wrap items-baseline gap-x-2 gap-y-1;
  @apply text-xs text-theme-text-muted;
}

.bh-tx-card__summary-total {
  @apply font-medium text-theme-text-secondary;
}

.bh-tx-card__summary-sep {
  @apply text-theme-text-muted;
}

.bh-tx-card__summary-item {
  @apply inline-flex items-baseline gap-1;
}

.bh-tx-card__summary-count {
  @apply font-medium tabular-nums text-theme-text-secondary;
}

.bh-tx-card__state {
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
}

.bh-tx-card__state--loading {
  @apply flex flex-col gap-2 p-4;
}

.bh-tx-card__state--error {
  @apply flex flex-col items-start gap-3 p-6;
}

.bh-tx-card__state-title {
  @apply font-poppins text-base font-semibold text-theme-text-primary;
}

.bh-tx-card__state-description {
  @apply text-sm text-theme-text-secondary;
}

.bh-tx-card__skel-row {
  @apply h-10 rounded;
}

.bh-tx-card__state--empty {
  @apply relative overflow-hidden;
}

.bh-tx-card__empty-pattern {
  @apply pointer-events-none absolute inset-0 opacity-[0.08];
}

.bh-tx-card__empty-inner {
  @apply relative flex flex-col items-center gap-2 py-10 px-6 text-center;
}

.bh-tx-card__empty-icon {
  @apply text-theme-accent-primary/60;
}

.bh-tx-card__empty-title {
  @apply font-poppins text-base font-semibold text-theme-text-primary;
}

.bh-tx-card__empty-description {
  @apply text-sm text-theme-text-secondary max-w-md;
}

.bh-tx-card__row {
  @apply cursor-pointer transition-colors duration-150;
  @apply hover:bg-theme-bg-elevated;
}

.bh-tx-card__row--expanded {
  @apply bg-theme-bg-elevated/60;
}

.bh-tx-card__cell {
  @apply px-4 py-3 text-sm text-theme-text-primary;
  @apply border-b border-theme-border-secondary/60;
}

.bh-tx-card__cell--date {
  @apply whitespace-nowrap tabular-nums text-theme-text-secondary;
}

.bh-tx-card__cell--action {
  @apply max-w-[16rem];
}

.bh-tx-card__cell--num {
  @apply tabular-nums text-right;
}

.bh-tx-card__cell--currency {
  @apply text-xs text-theme-text-muted uppercase tracking-wide;
}

.bh-tx-card__cell--notes {
  @apply w-8 text-center;
}

.bh-tx-card__cell--chevron {
  @apply w-10 text-right;
}

.bh-tx-card__type {
  @apply inline-flex items-center gap-1 px-2 py-0.5 rounded;
  @apply text-xs font-medium;
  @apply bg-theme-bg-elevated text-theme-text-secondary;
}

.bh-tx-card__type--buy {
  @apply bg-theme-status-success/15 text-theme-status-success-strong;
}

.bh-tx-card__type--sell {
  @apply bg-theme-status-error/15 text-theme-status-error-strong;
}

.bh-tx-card__type--dividend {
  @apply bg-theme-accent-primary/15 text-theme-accent-primary-strong;
}

.bh-tx-card__type--fee {
  @apply bg-theme-status-warning/15 text-theme-status-warning-strong;
}

.bh-tx-card__type--deposit {
  @apply bg-theme-accent-secondary/15 text-theme-accent-secondary-strong;
}

.bh-tx-card__type--withdrawal {
  @apply bg-theme-bg-elevated text-theme-text-muted;
}

.bh-tx-card__type--split {
  @apply bg-theme-bg-elevated text-theme-text-muted;
}

.bh-tx-card__action {
  @apply flex items-center gap-2 min-w-0;
}

.bh-tx-card__action-body {
  @apply flex flex-col min-w-0 gap-0.5;
}

.bh-tx-card__action-symbol {
  @apply font-medium truncate;
}

.bh-tx-card__action-name {
  @apply text-xs text-theme-text-secondary truncate;
}

.bh-tx-card__action-none {
  @apply text-theme-text-muted;
}

.bh-tx-card__dash {
  @apply text-theme-text-muted;
}

.bh-tx-card__notes-icon {
  @apply text-theme-accent-primary-strong;
}

.bh-tx-card__row-action {
  @apply inline-flex items-center justify-center;
  @apply w-8 h-8 rounded-md;
  @apply text-theme-text-muted;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply transition-colors duration-150;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-tx-card__chevron {
  @apply transition-transform duration-150;
}

.bh-tx-card__chevron--open {
  @apply rotate-180;
}

.bh-tx-card__details-row {
  @apply bg-theme-bg-elevated/30;
}

.bh-tx-card__details-cell {
  @apply px-4 py-4;
  @apply border-b border-theme-border-secondary/60;
}

.bh-tx-card__details {
  @apply flex flex-col gap-4 md:flex-row md:items-start md:justify-between;
}

.bh-tx-card__details-grid {
  @apply grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 flex-1;
}

.bh-tx-card__details-field {
  @apply flex flex-col gap-0.5 min-w-0;
}

.bh-tx-card__details-label {
  @apply text-xs text-theme-text-muted uppercase tracking-wide;
}

.bh-tx-card__details-value {
  @apply text-sm text-theme-text-primary;
}

.bh-tx-card__details-actions {
  @apply flex flex-wrap items-center gap-1;
}

.bh-tx-card__delete-icon {
  @apply text-theme-status-error-strong;
}
</style>
