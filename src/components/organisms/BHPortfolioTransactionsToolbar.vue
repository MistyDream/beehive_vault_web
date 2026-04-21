<template>
  <div class="bh-tx-toolbar">
    <div class="bh-tx-toolbar__row bh-tx-toolbar__row--controls">
      <BHBaseSelect
        class="bh-tx-toolbar__field bh-tx-toolbar__field--type"
        :label="t('portfolios.detail.transactions.filters.type_label')"
        :placeholder="t('portfolios.detail.transactions.filters.type_placeholder')"
        :model-value="transactionTypes"
        :options="typeOptions"
        multiple
        @update:model-value="onTypesUpdate"
      />
      <BHSearchableSelect
        class="bh-tx-toolbar__field bh-tx-toolbar__field--stock"
        :label="t('portfolios.detail.transactions.filters.stock_label')"
        :placeholder="t('portfolios.detail.transactions.filters.stock_placeholder')"
        :search-placeholder="t('portfolios.detail.transactions.filters.stock_search_placeholder')"
        :empty-text="t('portfolios.detail.transactions.filters.stock_empty')"
        :clear-label="t('portfolios.detail.transactions.filters.stock_clear')"
        :model-value="stockId ?? undefined"
        :options="stockOptions"
        @update:model-value="onStockUpdate"
      >
        <template #selected="{ options }">
          <span v-if="options[0]" class="bh-tx-toolbar__stock-selected">
            <BHStockAvatar :symbol="String(options[0].label)" size="sm" />
            {{ options[0].label }}
          </span>
        </template>
        <template #option="{ option }">
          <span class="bh-tx-toolbar__stock-option">
            <BHStockAvatar :symbol="String(option.label)" size="sm" />
            <span class="bh-tx-toolbar__option-body">
              <span class="bh-tx-toolbar__option-label">{{ option.label }}</span>
              <span
                v-if="option.description"
                class="bh-tx-toolbar__option-description"
              >
                {{ option.description }}
              </span>
            </span>
          </span>
        </template>
      </BHSearchableSelect>
      <BHDateInput
        class="bh-tx-toolbar__field bh-tx-toolbar__field--date"
        :label="t('portfolios.detail.transactions.filters.from_label')"
        :model-value="fromDate ?? ''"
        :max="toDate ?? undefined"
        @update:model-value="onFromUpdate"
      />
      <BHDateInput
        class="bh-tx-toolbar__field bh-tx-toolbar__field--date"
        :label="t('portfolios.detail.transactions.filters.to_label')"
        :model-value="toDate ?? ''"
        :min="fromDate ?? undefined"
        @update:model-value="onToUpdate"
      />
      <BHButton
        class="bh-tx-toolbar__cta"
        variant="primary"
        @click="emit('add')"
      >
        <LucidePlus :size="16" aria-hidden="true" />
        {{ t('portfolios.detail.actions.add_transaction') }}
      </BHButton>
    </div>

    <div v-if="hasAnyFilter" class="bh-tx-toolbar__chips">
      <BHTag
        v-for="chip in chips"
        :key="chip.key"
        color="accent"
        removable
        @remove="chip.onRemove"
      >
        {{ chip.label }}
      </BHTag>
      <button
        type="button"
        class="bh-tx-toolbar__reset"
        @click="emit('reset')"
      >
        {{ t('portfolios.detail.transactions.filters.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LucidePlus } from '#components';
import type { SearchableOption } from '~/components/molecules/BHSearchableSelect.vue';
import {
  TRANSACTION_TYPES,
  type TransactionType,
} from '~/types/portfolio';

interface Props {
  transactionTypes: TransactionType[];
  stockId: number | null;
  fromDate: string | null;
  toDate: string | null;
  stockOptions: SearchableOption[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:transactionTypes', value: TransactionType[]): void;
  (e: 'update:stockId', value: number | null): void;
  (e: 'update:fromDate' | 'update:toDate', value: string | null): void;
  (e: 'add' | 'reset'): void;
}>();

const { t } = useI18n();
const { formatDate } = useLocaleFormatters();

const typeOptions = computed(() =>
  TRANSACTION_TYPES.map((type) => ({
    value: type,
    label: t(`portfolios.detail.resume.tx_type.${type}`),
  })),
);

function onTypesUpdate(value: unknown) {
  const next = Array.isArray(value) ? (value as TransactionType[]) : [];
  emit('update:transactionTypes', next);
}

function onStockUpdate(value: unknown) {
  if (value === null || value === undefined) {
    emit('update:stockId', null);
    return;
  }
  const id = typeof value === 'number' ? value : Number(value);
  emit('update:stockId', Number.isNaN(id) ? null : id);
}

function onFromUpdate(value: string) {
  emit('update:fromDate', value || null);
}

function onToUpdate(value: string) {
  emit('update:toDate', value || null);
}

const selectedStock = computed(() =>
  props.stockOptions.find((opt) => opt.value === props.stockId) ?? null,
);

const hasAnyFilter = computed(
  () =>
    props.transactionTypes.length > 0
    || props.stockId !== null
    || !!props.fromDate
    || !!props.toDate,
);

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

const chips = computed<Chip[]>(() => {
  const out: Chip[] = [];
  for (const type of props.transactionTypes) {
    out.push({
      key: `type:${type}`,
      label: t('portfolios.detail.transactions.filters.chip_type', {
        value: t(`portfolios.detail.resume.tx_type.${type}`),
      }),
      onRemove: () =>
        emit(
          'update:transactionTypes',
          props.transactionTypes.filter((t) => t !== type),
        ),
    });
  }
  if (selectedStock.value) {
    out.push({
      key: `stock:${selectedStock.value.value}`,
      label: t('portfolios.detail.transactions.filters.chip_stock', {
        value: selectedStock.value.label,
      }),
      onRemove: () => emit('update:stockId', null),
    });
  }
  if (props.fromDate) {
    out.push({
      key: 'from',
      label: t('portfolios.detail.transactions.filters.chip_from', {
        value: formatDate(props.fromDate),
      }),
      onRemove: () => emit('update:fromDate', null),
    });
  }
  if (props.toDate) {
    out.push({
      key: 'to',
      label: t('portfolios.detail.transactions.filters.chip_to', {
        value: formatDate(props.toDate),
      }),
      onRemove: () => emit('update:toDate', null),
    });
  }
  return out;
});
</script>

<style lang="css" scoped>
.bh-tx-toolbar {
  @apply flex flex-col gap-3;
  @apply p-4 md:p-5;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply sticky top-0 z-10;
}

.bh-tx-toolbar__row {
  @apply flex flex-wrap items-end gap-3;
}

.bh-tx-toolbar__row--controls {
  @apply items-end;
}

.bh-tx-toolbar__field {
  @apply min-w-[10rem];
}

.bh-tx-toolbar__field--type {
  @apply flex-1 min-w-[10rem];
}

.bh-tx-toolbar__field--stock {
  @apply flex-1 min-w-[14rem];
}

.bh-tx-toolbar__field--date {
  @apply w-[10rem] flex-shrink-0;
}

.bh-tx-toolbar__cta {
  @apply ml-auto flex-shrink-0;
}

.bh-tx-toolbar__chips {
  @apply flex flex-wrap items-center gap-2;
}

.bh-tx-toolbar__reset {
  @apply text-xs font-medium text-theme-accent-primary-strong;
  @apply underline underline-offset-2;
  @apply hover:text-theme-text-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:rounded-md;
}

.bh-tx-toolbar__stock-selected {
  @apply inline-flex items-center gap-2;
}

.bh-tx-toolbar__stock-option {
  @apply flex items-center gap-2 min-w-0 flex-1;
}

.bh-tx-toolbar__option-body {
  @apply flex flex-col min-w-0 gap-0.5;
}

.bh-tx-toolbar__option-label {
  @apply truncate font-medium;
}

.bh-tx-toolbar__option-description {
  @apply text-xs text-theme-text-secondary truncate;
}
</style>
