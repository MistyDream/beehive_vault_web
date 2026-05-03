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
      ref="cardRef"
      :portfolio-id="id"
      :filters="filters"
      :page="page"
      :sort-by="sortBy"
      :sort-dir="sortDir"
      @page-change="setPage"
      @sort-change="setSort"
      @edit="openEdit"
      @duplicate="openDuplicate"
      @delete="openDelete"
    />

    <BHModal
      v-model="formModalOpen"
      :title="formModalTitle"
      size="lg"
      :close-on-overlay-click="!submitting"
      :close-on-escape="!submitting"
    >
      <BHTransactionForm
        :initial-value="formInitialValue"
        :portfolio-currency="portfolioCurrency"
        :default-date="formDefaultDate"
        :loading="submitting"
        :api-errors="apiErrors"
        @submit="onFormSubmit"
        @cancel="closeModal"
      />
    </BHModal>

    <BHModal
      v-model="deleteModalOpen"
      :title="t('portfolios.detail.transactions.delete_confirm.title')"
      size="md"
      role="alertdialog"
      :close-on-overlay-click="!submitting"
      :close-on-escape="!submitting"
    >
      <BHTransactionDeleteConfirm
        v-if="modal?.kind === 'delete'"
        :transaction="modal.tx"
        :loading="submitting"
        @confirm="onDeleteConfirm"
        @cancel="closeModal"
      />
    </BHModal>
  </div>
</template>

<script setup lang="ts">
import type { SearchableOption } from '~/components/molecules/BHSearchableSelect.vue';
import { ApiError } from '~/types/api';
import {
  TRANSACTION_TYPES,
  type CreateTransactionPayload,
  type SortDirection,
  type Transaction,
  type TransactionFilters,
  type TransactionType,
  type TransactionsSortBy,
  type UpdateTransactionPayload,
} from '~/types/portfolio';

type TxModal =
  | null
  | { kind: 'create' }
  | { kind: 'edit'; tx: Transaction }
  | { kind: 'duplicate'; tx: Transaction }
  | { kind: 'delete'; tx: Transaction };

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

const id = computed(() => String(route.params.id));

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

const transactionApi = useTransactionApi();
const cardRef = ref<{ refresh: () => Promise<void> } | null>(null);

const modal = ref<TxModal>(null);
const submitting = ref(false);
const apiErrors = ref<Record<string, string>>({});

const portfolioCurrency = computed(
  () => summaryData.value?.portfolio.currency ?? 'EUR',
);

const formModalOpen = computed({
  get: () => modal.value !== null && modal.value.kind !== 'delete',
  set: (value: boolean) => {
    if (!value) modal.value = null;
  },
});

const deleteModalOpen = computed({
  get: () => modal.value?.kind === 'delete',
  set: (value: boolean) => {
    if (!value) modal.value = null;
  },
});

const formInitialValue = computed<Transaction | null>(() => {
  if (!modal.value) return null;
  if (modal.value.kind === 'edit' || modal.value.kind === 'duplicate') {
    return modal.value.tx;
  }
  return null;
});

const formDefaultDate = computed(() => {
  if (modal.value?.kind === 'duplicate') {
    return new Date().toISOString().slice(0, 10);
  }
  return '';
});

const formModalTitle = computed(() => {
  if (modal.value?.kind === 'edit') {
    return t('portfolios.detail.transactions.form.edit_title');
  }
  if (modal.value?.kind === 'duplicate') {
    return t('portfolios.detail.transactions.form.duplicate_title');
  }
  return t('portfolios.detail.transactions.form.create_title');
});

function onAddTransaction() {
  apiErrors.value = {};
  modal.value = { kind: 'create' };
}

onMounted(() => {
  if (route.query.action === 'create') {
    apiErrors.value = {};
    modal.value = { kind: 'create' };
    const { action: _action, ...rest } = route.query;
    router.replace({ query: rest });
  }
});

function openEdit(tx: Transaction) {
  apiErrors.value = {};
  modal.value = { kind: 'edit', tx };
}

function openDuplicate(tx: Transaction) {
  apiErrors.value = {};
  modal.value = { kind: 'duplicate', tx };
}

function openDelete(tx: Transaction) {
  modal.value = { kind: 'delete', tx };
}

function closeModal() {
  modal.value = null;
}

function extractFieldErrors(err: ApiError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const fieldErr of err.errors ?? []) {
    out[fieldErr.field] = fieldErr.message;
  }
  return out;
}

async function runMutation(
  op: () => Promise<unknown>,
  successKey: string,
  failKey: string,
  onValidationError?: (err: ApiError) => void,
): Promise<void> {
  submitting.value = true;
  let mutated = false;
  try {
    await op();
    mutated = true;
  } catch (err) {
    if (
      onValidationError
      && err instanceof ApiError
      && err.status === 422
      && err.errors?.length
    ) {
      onValidationError(err);
    } else {
      toast.error(t(failKey));
    }
  } finally {
    submitting.value = false;
  }
  if (!mutated) return;
  toast.success(t(successKey));
  modal.value = null;
  // Refresh outside the mutation try/catch so a refetch failure does not
  // surface as the mutation-failed toast after we already announced success.
  await cardRef.value?.refresh().catch(() => undefined);
}

async function onFormSubmit(payload: CreateTransactionPayload) {
  const current = modal.value;
  if (!current || current.kind === 'delete') return;
  apiErrors.value = {};

  const onValidationError = (err: ApiError) => {
    apiErrors.value = extractFieldErrors(err);
  };

  if (current.kind === 'edit') {
    await runMutation(
      () => transactionApi.update(
        id.value,
        current.tx.id,
        payload as UpdateTransactionPayload,
      ),
      'portfolios.detail.transactions.toast.updated',
      'portfolios.detail.transactions.toast.update_failed',
      onValidationError,
    );
    return;
  }

  await runMutation(
    () => transactionApi.create(id.value, payload),
    current.kind === 'duplicate'
      ? 'portfolios.detail.transactions.toast.duplicated'
      : 'portfolios.detail.transactions.toast.created',
    'portfolios.detail.transactions.toast.create_failed',
    onValidationError,
  );
}

async function onDeleteConfirm() {
  const current = modal.value;
  if (current?.kind !== 'delete') return;
  await runMutation(
    () => transactionApi.remove(id.value, current.tx.id),
    'portfolios.detail.transactions.toast.deleted',
    'portfolios.detail.transactions.toast.delete_failed',
  );
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
@reference "~/assets/css/main.css";

.portfolio-transactions {
  @apply flex flex-col gap-4 lg:gap-6;
}
</style>
