<template>
  <section class="bh-positions-card">
    <header class="bh-positions-card__header">
      <h2 class="bh-positions-card__title">
        {{ t('portfolios.detail.resume.positions.title') }}
      </h2>
      <span v-if="total > 0" class="bh-positions-card__count">
        {{ t('portfolios.detail.resume.positions.count', total) }}
      </span>
    </header>

    <div v-if="loading" class="bh-positions-card__loading">
      <div v-for="n in 5" :key="n" class="bh-positions-card__skel-row bh-skeleton" />
    </div>

    <div v-else-if="isEmpty" class="bh-positions-card__empty">
      <div class="bh-positions-card__empty-pattern bh-hex-pattern" aria-hidden="true" />
      <div class="bh-positions-card__empty-inner">
        <LucideHexagon :size="48" class="bh-positions-card__empty-icon" aria-hidden="true" />
        <p class="bh-positions-card__empty-title">
          {{ t('portfolios.detail.resume.positions.empty_title') }}
        </p>
        <p class="bh-positions-card__empty-description">
          {{ t('portfolios.detail.resume.positions.empty_description') }}
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
        <tr
          v-for="(position, index) in sortedData"
          :key="position.stock.id"
          class="bh-positions-card__row"
          :class="{ 'bh-positions-card__row--even': index % 2 === 1 }"
          role="button"
          tabindex="0"
          @click="emit('row-click', position)"
          @keydown.enter.prevent="emit('row-click', position)"
          @keydown.space.prevent="emit('row-click', position)"
        >
          <td class="bh-positions-card__cell">
            <div class="bh-positions-card__symbol">
              <BHStockAvatar :symbol="position.stock.symbol" size="sm" />
              <span class="bh-positions-card__symbol-text">
                {{ position.stock.symbol }}
              </span>
            </div>
          </td>
          <td class="bh-positions-card__cell bh-positions-card__cell--name">
            <span class="bh-positions-card__name">{{ position.stock.name }}</span>
          </td>
          <td class="bh-positions-card__cell bh-positions-card__cell--num">
            {{ formatQuantity(position.quantity) }}
          </td>
          <td class="bh-positions-card__cell bh-positions-card__cell--num">
            <BHCurrencyDisplay
              :amount="position.average_cost"
              :currency="position.currency"
              size="sm"
            />
          </td>
          <td class="bh-positions-card__cell bh-positions-card__cell--num">
            <BHCurrencyDisplay
              :amount="position.total_cost"
              :currency="position.currency"
              size="sm"
            />
          </td>
          <td class="bh-positions-card__cell">
            <div class="bh-positions-card__weight">
              <span class="bh-positions-card__weight-value">
                {{ formatPercent(position.weight) }}
              </span>
              <div class="bh-positions-card__weight-bar">
                <div
                  class="bh-positions-card__weight-fill"
                  :style="{ width: `${position.weight * 100}%` }"
                />
              </div>
            </div>
          </td>
          <td class="bh-positions-card__cell bh-positions-card__cell--chevron">
            <LucideChevronRight :size="16" aria-hidden="true" />
          </td>
        </tr>
      </template>
    </BHTable>
  </section>
</template>

<script setup lang="ts">
import { LucideChevronRight, LucideHexagon } from '#components';
import type {
  Position,
  PositionsQuery,
  PositionsSortBy,
  SortDirection,
} from '~/types/portfolio';

interface Props {
  portfolioId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'row-click', position: Position): void;
}>();

const { t, locale } = useI18n();

const sortBy = ref<PositionsSortBy>('weight');
const sortDir = ref<SortDirection>('desc');
const page = ref(1);
const limit = 25;

const columns = computed(() => [
  { key: 'symbol', label: t('portfolios.detail.resume.positions.columns.symbol'), sortable: true },
  { key: 'name', label: t('portfolios.detail.resume.positions.columns.name'), sortable: false },
  { key: 'quantity', label: t('portfolios.detail.resume.positions.columns.quantity'), sortable: true },
  { key: 'average_cost', label: t('portfolios.detail.resume.positions.columns.avg_cost'), sortable: true },
  { key: 'total_cost', label: t('portfolios.detail.resume.positions.columns.total_cost'), sortable: true },
  { key: 'weight', label: t('portfolios.detail.resume.positions.columns.weight'), sortable: true },
  { key: '_chevron', label: '', sortable: false },
]);

const { positions } = usePortfolioApi();
const query = computed<PositionsQuery>(() => ({
  sort_by: sortBy.value,
  sort_dir: sortDir.value,
  page: page.value,
  limit,
}));
const { data, pending } = positions(() => props.portfolioId, query);

const items = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);
const loading = computed(() => pending.value && !data.value);
const isEmpty = computed(() => !loading.value && total.value === 0);

function onSortChange(by: string, direction: SortDirection) {
  sortBy.value = by as PositionsSortBy;
  sortDir.value = direction;
  page.value = 1;
}

function onPageChange(newPage: number) {
  page.value = newPage;
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat(locale.value, {
    maximumFractionDigits: 4,
  }).format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
</script>

<style lang="css" scoped>
.bh-positions-card {
  @apply flex flex-col gap-3;
}

.bh-positions-card__header {
  @apply flex items-baseline justify-between gap-3;
  @apply px-1;
}

.bh-positions-card__title {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-positions-card__count {
  @apply text-xs text-theme-text-muted;
}

.bh-positions-card__loading {
  @apply flex flex-col gap-2;
  @apply bg-theme-bg-card rounded-2xl p-4;
}

.bh-positions-card__skel-row {
  @apply h-10 rounded;
}

.bh-positions-card__empty {
  @apply relative overflow-hidden;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
}

.bh-positions-card__empty-pattern {
  @apply pointer-events-none absolute inset-0 opacity-[0.08];
}

.bh-positions-card__empty-inner {
  @apply relative flex flex-col items-center gap-2;
  @apply py-10 px-6 text-center;
}

.bh-positions-card__empty-icon {
  @apply text-theme-accent-primary/40;
}

.bh-positions-card__empty-title {
  @apply font-poppins text-base font-semibold text-theme-text-primary;
}

.bh-positions-card__empty-description {
  @apply text-sm text-theme-text-secondary max-w-md;
}

.bh-positions-card__row {
  @apply cursor-pointer transition-colors duration-150;
  @apply hover:bg-theme-bg-elevated;
  @apply focus-visible:outline-none focus-visible:bg-theme-bg-elevated;
}

.bh-positions-card__row--even {
  @apply bg-theme-bg-card/60;
}

.bh-positions-card__cell {
  @apply px-6 py-3 text-sm text-theme-text-primary;
  @apply border-b border-theme-border-secondary/60;
}

.bh-positions-card__cell--name {
  @apply max-w-[14rem];
}

.bh-positions-card__cell--num {
  @apply tabular-nums;
}

.bh-positions-card__cell--chevron {
  @apply text-theme-text-muted text-right;
  @apply w-8;
}

.bh-positions-card__symbol {
  @apply flex items-center gap-2;
}

.bh-positions-card__symbol-text {
  @apply font-medium;
}

.bh-positions-card__name {
  @apply block truncate text-theme-text-secondary;
}

.bh-positions-card__weight {
  @apply flex items-center gap-3;
  @apply tabular-nums;
}

.bh-positions-card__weight-value {
  @apply text-xs text-theme-text-secondary w-12;
}

.bh-positions-card__weight-bar {
  @apply relative h-1.5 w-20 rounded-full;
  @apply bg-theme-bg-elevated overflow-hidden;
}

.bh-positions-card__weight-fill {
  @apply h-full rounded-full;
  @apply bg-theme-accent-primary;
}
</style>
