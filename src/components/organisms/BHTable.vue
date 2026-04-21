<template>
  <div class="bh-table">
    <div class="table-container">
      <table class="bh-table__table">
        <thead>
          <tr class="table-header">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="header-cell"
              :class="column.centerAlign ? 'header-cell--center' : ''"
              :aria-sort="ariaSortFor(column)"
            >
              <button
                v-if="column.sortable"
                type="button"
                class="header-button"
                :aria-label="sortAriaLabel(column)"
                @click="toggleSort(column.key)"
              >
                {{ column.label }}
                <span
                  v-if="currentSortBy === column.key"
                  class="sort-indicator"
                  :class="{ 'sort-indicator--desc': currentSortDirection === 'desc' }"
                  aria-hidden="true"
                >
                  <LucideChevronUp :size="16" />
                </span>
              </button>
              <span v-else class="header-content">{{ column.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <slot name="rows" :sorted-data="data" :total-items="total">
            <tr
              v-for="(item, index) in data"
              :key="String(item.id) || index"
              class="table-row"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="table-cell"
              >
                {{ getValueFromPath(item, String(column.key)) }}
              </td>
            </tr>
          </slot>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <span class="pagination-info">
        {{ t('table.pagination_info', { from: startIndex + 1, to: endIndex, total }) }}
      </span>
      <div class="pagination-controls">
        <BHButton
          class="pagination-button"
          :disabled="!hasPrev"
          :aria-label="t('table.previous_page')"
          @click="prev"
        >
          <LucideChevronLeft :size="18" aria-hidden="true" />
        </BHButton>

        <BHButton
          v-for="page in visiblePages"
          :key="page"
          class="pagination-button"
          :class="{ 'pagination-button--active': page === current }"
          :aria-label="t('table.go_to_page', { n: page })"
          :aria-current="page === current ? 'page' : undefined"
          @click="setCurrent(page)"
        >
          {{ page }}
        </BHButton>

        <BHButton
          class="pagination-button"
          :disabled="!hasNext"
          :aria-label="t('table.next_page')"
          @click="next"
        >
          <LucideChevronRight :size="18" aria-hidden="true" />
        </BHButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronUp,
} from '#components';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  centerAlign?: boolean;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  total: number;
  columns: Column[];
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

interface Emits {
  'page-change': [page: number];
  'sort-change': [sortBy: string, direction: 'asc' | 'desc'];
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  itemsPerPage: 10,
  sortBy: '',
  sortDirection: 'desc',
});

const emit = defineEmits<Emits>();

const { t } = useI18n();

const currentPageRef = ref(props.page);

watch(
  () => props.page,
  (newPage) => {
    if (currentPageRef.value !== newPage) {
      currentPageRef.value = newPage;
    }
  },
);

const {
  currentPage,
  currentPageSize,
  pageCount,
  isFirstPage,
  isLastPage,
  prev,
  next,
} = useOffsetPagination({
  total: () => props.total,
  page: currentPageRef,
  pageSize: () => props.itemsPerPage,
  onPageChange: ({ currentPage: page }) => {
    emit('page-change', page);
  },
});

const current = currentPage;
const startIndex = computed(() => (currentPage.value - 1) * currentPageSize.value);
const endIndex = computed(() =>
  Math.min(startIndex.value + currentPageSize.value, props.total),
);
const hasPrev = computed(() => !isFirstPage.value);
const hasNext = computed(() => !isLastPage.value);

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  const end = Math.min(pageCount.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const currentSortBy = ref(props.sortBy);
const currentSortDirection = ref<'asc' | 'desc'>(props.sortDirection);

const debouncedSortChange = useDebounceFn(
  (sortBy: string, direction: 'asc' | 'desc') => {
    emit('sort-change', sortBy, direction);
  },
  100,
);

const toggleSort = (columnKey: string) => {
  if (currentSortBy.value === columnKey) {
    currentSortDirection.value =
      currentSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortBy.value = columnKey;
    currentSortDirection.value = 'desc';
  }

  debouncedSortChange(currentSortBy.value, currentSortDirection.value);
};

const ariaSortFor = (column: Column): 'ascending' | 'descending' | 'none' | undefined => {
  if (!column.sortable) return undefined;
  if (currentSortBy.value !== column.key) return 'none';
  return currentSortDirection.value === 'asc' ? 'ascending' : 'descending';
};

const sortAriaLabel = (column: Column): string => {
  const nextDir =
    currentSortBy.value === column.key && currentSortDirection.value === 'asc'
      ? 'desc'
      : 'asc';
  const action =
    nextDir === 'asc' ? t('table.sort_ascending') : t('table.sort_descending');
  return `${column.label} — ${action}`;
};

const setCurrent = (page: number) => {
  if (page >= 1 && page <= pageCount.value) {
    currentPage.value = page;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getValueFromPath = (obj: any, path: string): any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((current: any, key: string) => {
    return current?.[key];
  }, obj);
};

watch(
  () => props.sortBy,
  (newValue) => {
    if (newValue) {
      currentSortBy.value = newValue;
    }
  },
);

watch(
  () => props.sortDirection,
  (newValue) => {
    currentSortDirection.value = newValue;
  },
);
</script>

<style lang="css" scoped>
.bh-table {
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
}

.table-container {
  @apply overflow-hidden;
  @apply rounded-t-2xl;
}

.bh-table__table {
  @apply w-full;
}

.table-header {
  @apply bg-theme-bg-elevated border-b border-theme-border-primary;
}

.header-cell {
  @apply px-6 py-4 text-left;
  @apply text-sm font-medium text-theme-text-secondary;
  @apply transition-colors;
}

.header-cell--center {
  @apply text-center;
}

.header-content {
  @apply flex items-center justify-center;
}

.header-button {
  @apply inline-flex items-center justify-center gap-1;
  @apply bg-transparent border-0 p-0 m-0;
  @apply text-sm font-medium text-theme-text-secondary;
  @apply cursor-pointer transition-colors;
  @apply hover:text-theme-text-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:rounded-md;
}

.sort-indicator {
  @apply ml-2 text-theme-text-primary;
  @apply transition-transform duration-300 ease-in-out;
  transform: rotate(0deg);
}

.sort-indicator--desc {
  transform: rotate(180deg);
}

.table-row {
  @apply border-b border-theme-border-secondary;
  @apply hover:bg-theme-bg-elevated/50;
  @apply transition-colors;
}

.table-cell {
  @apply px-6 py-4;
  @apply text-sm text-theme-text-primary;
}

.pagination {
  @apply flex justify-between items-center;
  @apply px-6 py-3;
}

.pagination-info {
  @apply text-sm text-theme-text-secondary;
}

.pagination-controls {
  @apply flex items-center gap-2;
}

.pagination-button {
  @apply w-8 h-8 flex items-center justify-center;
  @apply bg-theme-bg-elevated-strong hover:bg-theme-accent-secondary/20;
  @apply border border-theme-border-secondary rounded-md;
  @apply text-sm;
  @apply transition-colors;
}

.pagination-button--active {
  @apply bg-theme-accent-secondary border-theme-accent-secondary;
  @apply text-theme-text-on-accent-secondary;
}

.pagination-button:disabled {
  @apply opacity-50 cursor-not-allowed;
  @apply hover:bg-theme-bg-elevated-strong;
}
</style>
