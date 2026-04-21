<template>
  <div class="portfolio-transactions">
    <BHPortfolioTransactionsToolbar
      :transaction-types="transactionTypes"
      :stock-id="stockId"
      :from-date="fromDate"
      :to-date="toDate"
      :stock-options="stockOptions"
      @update:transaction-types="setTransactionTypes"
      @update:stock-id="setStockId"
      @update:from-date="setFromDate"
      @update:to-date="setToDate"
      @add="onAddTransaction"
      @reset="resetFilters"
    />
    <BHPortfolioTransactionsCard
      :portfolio-id="id"
      :filters="filters"
      :page="page"
      :sort-by="sortBy"
      :sort-dir="sortDir"
      @page-change="setPage"
      @sort-change="setSort"
    />
  </div>
</template>

<script setup lang="ts">
import type { SearchableOption } from '~/components/molecules/BHSearchableSelect.vue';
import {
  TRANSACTION_TYPES,
  type SortDirection,
  type TransactionFilters,
  type TransactionType,
  type TransactionsSortBy,
} from '~/types/portfolio';

const TX_SORT_BY: readonly TransactionsSortBy[] = [
  'executed_at',
  'amount',
  'transaction_type',
];
const SORT_DIR: readonly SortDirection[] = ['asc', 'desc'];

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const id = computed(() => Number(route.params.id));

function parseTypesCsv(raw: unknown): TransactionType[] {
  if (typeof raw !== 'string' || raw.length === 0) return [];
  return raw
    .split(',')
    .filter((s): s is TransactionType =>
      (TRANSACTION_TYPES as readonly string[]).includes(s),
    );
}

function parseStockId(raw: unknown): number | null {
  if (typeof raw !== 'string' || raw.length === 0) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseIsoDate(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length === 0) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}

function parsePage(raw: unknown): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function parseSortBy(raw: unknown): TransactionsSortBy {
  return typeof raw === 'string'
    && (TX_SORT_BY as readonly string[]).includes(raw)
    ? (raw as TransactionsSortBy)
    : 'executed_at';
}

function parseSortDir(raw: unknown): SortDirection {
  return typeof raw === 'string' && (SORT_DIR as readonly string[]).includes(raw)
    ? (raw as SortDirection)
    : 'desc';
}

const transactionTypes = ref<TransactionType[]>(parseTypesCsv(route.query.types));
const stockId = ref<number | null>(parseStockId(route.query.stock_id));
const fromDate = ref<string | null>(parseIsoDate(route.query.from));
const toDate = ref<string | null>(parseIsoDate(route.query.to));
const page = ref<number>(parsePage(route.query.page));
const sortBy = ref<TransactionsSortBy>(parseSortBy(route.query.sort_by));
const sortDir = ref<SortDirection>(parseSortDir(route.query.sort_dir));

const filters = computed<TransactionFilters>(() => ({
  transaction_types:
    transactionTypes.value.length > 0 ? transactionTypes.value : undefined,
  stock_id: stockId.value ?? undefined,
  from_date: fromDate.value ?? undefined,
  to_date: toDate.value ?? undefined,
}));

const { summary } = usePortfolioApi();
const { data: summaryData } = summary(() => id.value);

const stockOptions = computed<SearchableOption[]>(() => {
  const positions = summaryData.value?.positions ?? [];
  return positions.map((pos) => ({
    value: pos.stock.id,
    label: pos.stock.symbol,
    description: pos.stock.name,
  }));
});

function setTransactionTypes(value: TransactionType[]) {
  transactionTypes.value = value;
  page.value = 1;
}

function setStockId(value: number | null) {
  stockId.value = value;
  page.value = 1;
}

function setFromDate(value: string | null) {
  fromDate.value = value;
  page.value = 1;
}

function setToDate(value: string | null) {
  toDate.value = value;
  page.value = 1;
}

function setPage(value: number) {
  page.value = value;
}

function setSort(by: TransactionsSortBy, dir: SortDirection) {
  sortBy.value = by;
  sortDir.value = dir;
  page.value = 1;
}

function resetFilters() {
  transactionTypes.value = [];
  stockId.value = null;
  fromDate.value = null;
  toDate.value = null;
  page.value = 1;
}

function onAddTransaction() {
  toast.info(t('toast.coming_soon'));
}

watch(
  [transactionTypes, stockId, fromDate, toDate, page, sortBy, sortDir],
  () => {
    const q: Record<string, string> = {};
    if (transactionTypes.value.length > 0) {
      q.types = transactionTypes.value.join(',');
    }
    if (stockId.value !== null) q.stock_id = String(stockId.value);
    if (fromDate.value) q.from = fromDate.value;
    if (toDate.value) q.to = toDate.value;
    if (page.value > 1) q.page = String(page.value);
    if (sortBy.value !== 'executed_at') q.sort_by = sortBy.value;
    if (sortDir.value !== 'desc') q.sort_dir = sortDir.value;
    router.replace({ query: q });
  },
);
</script>

<style lang="css" scoped>
.portfolio-transactions {
  @apply flex flex-col gap-4 lg:gap-6;
}
</style>
