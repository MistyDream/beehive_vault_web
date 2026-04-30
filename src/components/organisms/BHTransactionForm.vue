<template>
  <form class="bh-tx-form" @submit.prevent="onSubmit">
    <BHBaseSelect
      v-model="form.transaction_type"
      :label="t('portfolios.detail.transactions.form.type_label')"
      :placeholder="t('portfolios.detail.transactions.form.type_placeholder')"
      :options="typeOptions"
    />

    <BHDateInput
      v-model="form.executed_at"
      :label="t('portfolios.detail.transactions.form.executed_at_label')"
      :error="errors.executed_at"
    />

    <BHSearchableSelect
      v-if="needsStock"
      v-model="stockValue"
      :label="t('portfolios.detail.transactions.form.stock_label')"
      :placeholder="t('portfolios.detail.transactions.form.stock_placeholder')"
      :search-placeholder="t('portfolios.detail.transactions.form.stock_search_placeholder')"
      :options="stockOptions"
      :error="errors.stock_id"
      remote
      :loading="stockLoading"
      :truncated="stockTruncated"
      :truncated-hint="t('portfolios.detail.transactions.form.stock_truncated')"
      :min-search-chars="2"
      :min-search-hint="t('portfolios.detail.transactions.form.stock_min_search')"
      :empty-text="t('portfolios.detail.transactions.form.stock_no_results')"
      @search="onStockSearch"
    />

    <div v-if="needsQuantityAndPrice" class="bh-tx-form__row">
      <BHNumberInput
        v-model="form.quantity"
        :label="t('portfolios.detail.transactions.form.quantity_label')"
        :min="0"
        :precision="6"
        :min-precision="0"
        :error="errors.quantity"
      />
      <BHNumberInput
        v-model="form.unit_price"
        :label="t('portfolios.detail.transactions.form.unit_price_label')"
        :min="0"
        :precision="2"
        :error="errors.unit_price"
      />
    </div>

    <BHNumberInput
      v-if="needsAmount"
      v-model="form.amount"
      :label="t('portfolios.detail.transactions.form.amount_label')"
      :min="0"
      :precision="2"
      :error="errors.amount"
    />

    <div v-if="isSplit" class="bh-tx-form__row">
      <BHNumberInput
        v-model="form.split_from"
        :label="t('portfolios.detail.transactions.form.split_from_label')"
        :min="1"
        :precision="0"
        :error="errors.split_from"
      />
      <BHNumberInput
        v-model="form.split_to"
        :label="t('portfolios.detail.transactions.form.split_to_label')"
        :min="1"
        :precision="0"
        :error="errors.split_to"
      />
    </div>

    <div v-if="needsFeesAndTax" class="bh-tx-form__row">
      <BHNumberInput
        v-model="form.fees"
        :label="t('portfolios.detail.transactions.form.fees_label')"
        :min="0"
        :precision="2"
        :error="errors.fees"
      />
      <BHNumberInput
        v-model="form.tax"
        :label="t('portfolios.detail.transactions.form.tax_label')"
        :min="0"
        :precision="2"
        :error="errors.tax"
      />
    </div>

    <div class="bh-tx-form__row">
      <BHSearchableSelect
        v-model="currencyValue"
        :label="t('portfolios.detail.transactions.form.currency_label')"
        :options="currencyOptions"
        :error="errors.currency"
        :clearable="false"
      />
      <BHNumberInput
        v-if="hasCustomCurrency"
        v-model="form.exchange_rate"
        :label="t('portfolios.detail.transactions.form.exchange_rate_label')"
        :min="0"
        :precision="4"
        :error="errors.exchange_rate"
      />
    </div>

    <BHTextarea
      v-model="form.notes"
      :label="t('portfolios.detail.transactions.form.notes_label')"
      :placeholder="t('portfolios.detail.transactions.form.notes_placeholder')"
      :max-length="500"
      :rows="2"
      :error="errors.notes"
    />

    <div class="bh-tx-form__footer">
      <BHButton
        variant="ghost"
        type="button"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ t('portfolios.detail.transactions.form.cancel') }}
      </BHButton>
      <BHButton variant="primary" type="submit" :loading="loading">
        {{ t('portfolios.detail.transactions.form.save') }}
      </BHButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SearchableOption } from '~/components/molecules/BHSearchableSelect.vue';
import {
  TRANSACTION_TYPES,
  type CreateTransactionPayload,
  type Transaction,
  type TransactionType,
} from '~/types/portfolio';

interface Props {
  initialValue?: Transaction | null;
  portfolioCurrency: string;
  defaultDate?: string;
  loading?: boolean;
  apiErrors?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: null,
  defaultDate: '',
  loading: false,
  apiErrors: () => ({}),
});

const emit = defineEmits<{
  (e: 'submit', payload: CreateTransactionPayload): void;
  (e: 'cancel'): void;
}>();

const { t, locale } = useI18n();
const toast = useToast();
const { search: searchStocks } = useStockApi();

const TYPES_NEEDING_STOCK: readonly TransactionType[] = [
  'buy',
  'sell',
  'dividend',
  'split',
];
const TYPES_NEEDING_QUANTITY_AND_PRICE: readonly TransactionType[] = ['buy', 'sell'];
const TYPES_NEEDING_AMOUNT: readonly TransactionType[] = [
  'dividend',
  'fee',
  'deposit',
  'withdrawal',
];
const TYPES_NEEDING_FEES_AND_TAX: readonly TransactionType[] = [
  'buy',
  'sell',
  'dividend',
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildInitialForm() {
  const init = props.initialValue;
  if (init) {
    return {
      transaction_type: init.transaction_type,
      executed_at: props.defaultDate || init.executed_at,
      stock_id: init.stock?.id ?? null,
      quantity: init.quantity,
      unit_price: init.unit_price,
      amount: init.amount,
      fees: init.fees,
      tax: init.tax,
      split_from: init.split_from,
      split_to: init.split_to,
      currency: init.currency,
      exchange_rate: init.exchange_rate as number | null,
      notes: init.notes ?? '',
    };
  }
  return {
    transaction_type: 'buy' as TransactionType,
    executed_at: props.defaultDate || todayIso(),
    stock_id: null as number | null,
    quantity: null as number | null,
    unit_price: null as number | null,
    amount: null as number | null,
    fees: 0,
    tax: 0,
    split_from: null as number | null,
    split_to: null as number | null,
    currency: props.portfolioCurrency,
    exchange_rate: 1 as number | null,
    notes: '',
  };
}

const form = reactive(buildInitialForm());

const errors = reactive({
  executed_at: '',
  stock_id: '',
  quantity: '',
  unit_price: '',
  amount: '',
  fees: '',
  tax: '',
  split_from: '',
  split_to: '',
  currency: '',
  exchange_rate: '',
  notes: '',
});

const typeOptions = computed(() =>
  TRANSACTION_TYPES.map((type) => ({
    value: type,
    label: t(`portfolios.detail.resume.tx_type.${type}`),
  })),
);

const currencyOptions = computed<SearchableOption[]>(() => {
  const dn = new Intl.DisplayNames([locale.value], { type: 'currency' });
  const codes = new Set(Intl.supportedValuesOf('currency'));
  codes.add(props.portfolioCurrency.toUpperCase());
  return Array.from(codes)
    .sort()
    .map((code) => ({
      value: code,
      label: code,
      description: dn.of(code) ?? code,
    }));
});

const currencyValue = computed({
  get: (): string => form.currency.toUpperCase(),
  set: (value) => {
    if (typeof value === 'string') form.currency = value;
  },
});

const needsStock = computed(() =>
  TYPES_NEEDING_STOCK.includes(form.transaction_type),
);
const needsQuantityAndPrice = computed(() =>
  TYPES_NEEDING_QUANTITY_AND_PRICE.includes(form.transaction_type),
);
const needsAmount = computed(() =>
  TYPES_NEEDING_AMOUNT.includes(form.transaction_type),
);
const needsFeesAndTax = computed(() =>
  TYPES_NEEDING_FEES_AND_TAX.includes(form.transaction_type),
);
const isSplit = computed(() => form.transaction_type === 'split');

const hasCustomCurrency = computed(
  () =>
    form.currency.trim().toUpperCase() !== props.portfolioCurrency.toUpperCase(),
);

watch(
  () => form.transaction_type,
  () => {
    clearErrors();
    if (!needsStock.value) form.stock_id = null;
    if (!needsQuantityAndPrice.value) {
      form.quantity = null;
      form.unit_price = null;
    }
    if (!needsAmount.value) form.amount = null;
    if (!needsFeesAndTax.value) {
      form.fees = 0;
      form.tax = 0;
    }
    if (!isSplit.value) {
      form.split_from = null;
      form.split_to = null;
    }
  },
);

watch(
  () => form.currency,
  () => {
    // Switching to a foreign currency clears the rate so the user must enter
    // a fresh value (a stale 1.0 from EUR-on-EUR would silently ship).
    form.exchange_rate = hasCustomCurrency.value ? null : 1;
  },
);

const initialStockOption = computed<SearchableOption | null>(() => {
  const stock = props.initialValue?.stock;
  if (!stock) return null;
  return { value: stock.id, label: stock.symbol, description: stock.name };
});

const selectedStockOption = ref<SearchableOption | null>(initialStockOption.value);
const searchResults = ref<SearchableOption[]>([]);
const stockLoading = ref(false);
const stockTruncated = ref(false);
let searchAbort: AbortController | null = null;

const stockOptions = computed<SearchableOption[]>(() => {
  const list = [...searchResults.value];
  const selected = selectedStockOption.value;
  if (selected && !list.some((o) => o.value === selected.value)) {
    list.unshift(selected);
  }
  return list;
});

const stockValue = computed({
  get: () => form.stock_id,
  set: (value: number | null) => {
    form.stock_id = value;
    if (value === null) {
      selectedStockOption.value = null;
      return;
    }
    const found = searchResults.value.find((o) => o.value === value)
      ?? selectedStockOption.value;
    if (found) selectedStockOption.value = found;
  },
});

async function onStockSearch(query: string) {
  searchAbort?.abort();
  if (query.length < 2) {
    searchAbort = null;
    searchResults.value = [];
    stockTruncated.value = false;
    stockLoading.value = false;
    return;
  }
  searchAbort = new AbortController();
  const { signal } = searchAbort;
  stockLoading.value = true;
  try {
    const result = await searchStocks(query, { signal });
    searchResults.value = result.items.map((item) => ({
      value: item.id,
      label: item.symbol,
      description: item.name,
    }));
    stockTruncated.value = result.truncated;
  } catch (err) {
    if (signal.aborted) return;
    toast.error(t('portfolios.detail.transactions.toast.stock_search_failed'));
    searchResults.value = [];
    stockTruncated.value = false;
    if (import.meta.dev) console.error('[stock search] failed', err);
  } finally {
    if (!signal.aborted) stockLoading.value = false;
  }
}

watch(
  () => props.apiErrors,
  (next) => {
    if (!next) return;
    for (const [field, message] of Object.entries(next)) {
      if (field in errors) {
        (errors as Record<string, string>)[field] = message;
      }
    }
  },
);

function clearErrors() {
  for (const key of Object.keys(errors) as Array<keyof typeof errors>) {
    errors[key] = '';
  }
}

function validate(): boolean {
  clearErrors();

  if (!form.executed_at) {
    errors.executed_at = t(
      'portfolios.detail.transactions.form.errors.executed_at_required',
    );
  }

  if (form.currency.trim().length !== 3) {
    errors.currency = t(
      'portfolios.detail.transactions.form.errors.currency_length',
    );
  }

  if (needsStock.value && !form.stock_id) {
    errors.stock_id = t(
      'portfolios.detail.transactions.form.errors.stock_required',
    );
  }

  if (needsQuantityAndPrice.value) {
    if (form.quantity === null || form.quantity <= 0) {
      errors.quantity = t(
        'portfolios.detail.transactions.form.errors.positive_required',
      );
    }
    if (form.unit_price === null || form.unit_price <= 0) {
      errors.unit_price = t(
        'portfolios.detail.transactions.form.errors.positive_required',
      );
    }
  }

  if (needsAmount.value && (form.amount === null || form.amount <= 0)) {
    errors.amount = t(
      'portfolios.detail.transactions.form.errors.positive_required',
    );
  }

  if (isSplit.value) {
    if (form.split_from === null || form.split_from < 1) {
      errors.split_from = t(
        'portfolios.detail.transactions.form.errors.split_from_required',
      );
    }
    if (form.split_to === null || form.split_to < 1) {
      errors.split_to = t(
        'portfolios.detail.transactions.form.errors.split_to_required',
      );
    }
  }

  if (needsFeesAndTax.value) {
    if (form.fees < 0) {
      errors.fees = t(
        'portfolios.detail.transactions.form.errors.non_negative_required',
      );
    }
    if (form.tax < 0) {
      errors.tax = t(
        'portfolios.detail.transactions.form.errors.non_negative_required',
      );
    }
  }

  if (hasCustomCurrency.value && (form.exchange_rate === null || form.exchange_rate <= 0)) {
    errors.exchange_rate = t(
      'portfolios.detail.transactions.form.errors.positive_required',
    );
  }

  if (form.notes && form.notes.length > 500) {
    errors.notes = t(
      'portfolios.detail.transactions.form.errors.notes_too_long',
    );
  }

  return Object.values(errors).every((value) => !value);
}

function buildPayload(): CreateTransactionPayload {
  const payload: CreateTransactionPayload = {
    transaction_type: form.transaction_type,
    executed_at: form.executed_at,
    currency: form.currency.trim().toUpperCase(),
  };

  if (needsStock.value && form.stock_id !== null) {
    payload.stock_id = form.stock_id;
  }

  if (needsQuantityAndPrice.value) {
    if (form.quantity !== null) payload.quantity = form.quantity;
    if (form.unit_price !== null) payload.unit_price = form.unit_price;
  }

  if (needsAmount.value && form.amount !== null) {
    payload.amount = form.amount;
  }

  if (isSplit.value) {
    if (form.split_from !== null) payload.split_from = form.split_from;
    if (form.split_to !== null) payload.split_to = form.split_to;
  }

  if (needsFeesAndTax.value) {
    if (form.fees > 0) payload.fees = form.fees;
    if (form.tax > 0) payload.tax = form.tax;
  }

  if (hasCustomCurrency.value && form.exchange_rate !== null) {
    payload.exchange_rate = form.exchange_rate;
  }

  const notes = form.notes.trim();
  if (notes) payload.notes = notes;

  return payload;
}

function onSubmit() {
  if (!validate()) return;
  emit('submit', buildPayload());
}
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-tx-form {
  @apply flex flex-col gap-4;
}

.bh-tx-form__row {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
}

.bh-tx-form__footer {
  @apply flex items-center justify-end gap-3 mt-2;
}
</style>
