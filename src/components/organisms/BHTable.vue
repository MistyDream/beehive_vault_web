<template>
  <div class="bh-table">
    <!-- Table Container -->
    <div class="table-container">
      <table class="bh-table__table">
        <thead>
          <tr class="table-header">
            <th
              v-for="column in columns"
              :key="column.key"
              class="header-cell"
              :class="column.centerAlign ? 'header-cell--center' : ''"
              :style="column.sortable ? 'cursor: pointer' : ''"
              @click="column.sortable ? toggleSort(column.key) : null"
            >
              <div class="header-content">
                {{ column.label }}
                <span
                  v-if="column.sortable && currentSortBy === column.key"
                  class="sort-indicator"
                  :class="{
                    'sort-indicator--desc': currentSortDirection === 'desc',
                  }"
                >
                  <LucideChevronUp :size="16" />
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <slot
            name="rows"
            :sorted-data="paginatedData"
            :total-items="totalItems"
          >
            <!-- Fallback content si le slot n'est pas fourni -->
            <tr
              v-for="(item, index) in paginatedData"
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

    <!-- Pagination -->
    <div class="pagination">
      <span class="pagination-info">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of
        {{ totalItems }} results
      </span>
      <div class="pagination-controls">
        <BHButton class="pagination-button" :disabled="!hasPrev" @click="prev">
          <LucideChevronLeft :size="16" />
        </BHButton>

        <BHButton
          v-for="page in visiblePages"
          :key="page"
          class="pagination-button"
          :class="{ 'pagination-button--active': page === current }"
          @click="setCurrent(page)"
        >
          {{ page }}
        </BHButton>

        <BHButton class="pagination-button" :disabled="!hasNext" @click="next">
          <LucideChevronRight :size="16" />
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
  columns: Column[];
  itemsPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

interface Emits {
  'page-change': [page: number];
  'sort-change': [sortBy: string, direction: 'asc' | 'desc'];
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  sortBy: '',
  sortDirection: 'desc',
});

const emit = defineEmits<Emits>();

// État de tri réactif
const currentSortBy = ref(props.sortBy);
const currentSortDirection = ref<'asc' | 'desc'>(props.sortDirection);

// État de pagination réactif
const currentPage = ref(1);

// Données triées
const sortedData = computed(() => {
  const sorted = [...props.data];

  if (currentSortBy.value) {
    sorted.sort((a, b) => {
      const aValue = getValueFromPath(a, currentSortBy.value);
      const bValue = getValueFromPath(b, currentSortBy.value);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return currentSortDirection.value === 'desc'
          ? bValue - aValue
          : aValue - bValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      const result = aStr.localeCompare(bStr);
      return currentSortDirection.value === 'desc' ? -result : result;
    });
  }

  return sorted;
});

// Computed pour la pagination
const totalItems = computed(() => sortedData.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / props.itemsPerPage),
);
const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage);
const endIndex = computed(() =>
  Math.min(startIndex.value + props.itemsPerPage, totalItems.value),
);

// Données paginées
const paginatedData = computed(() => {
  return sortedData.value.slice(startIndex.value, endIndex.value);
});

// Navigation avec computed
const hasNext = computed(() => currentPage.value < totalPages.value);
const hasPrev = computed(() => currentPage.value > 1);

const next = () => {
  if (hasNext.value) {
    setCurrent(currentPage.value + 1);
  }
};

const prev = () => {
  if (hasPrev.value) {
    setCurrent(currentPage.value - 1);
  }
};

// Pages visibles dans la pagination
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Fonction de tri avec VueUse debounce
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

// Fonction pour changer de page avec VueUse debounce
const debouncedPageChange = useDebounceFn((page: number) => {
  emit('page-change', page);
}, 100);

const setCurrent = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    debouncedPageChange(page);
  }
};

// Accès aux propriétés imbriquées
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getValueFromPath = (obj: any, path: string): any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((current: any, key: string) => {
    return current?.[key];
  }, obj);
};

// Watcher pour les changements de données
watch(
  () => props.data,
  () => {
    setCurrent(1);
  },
  { deep: true },
);

// Watchers pour synchroniser avec les props
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

// Exposer les propriétés pour le template
const current = currentPage;
</script>

<style lang="css" scoped>
.bh-table {
  @apply bg-dark-gray-500;
  @apply rounded-2xl;
}

.table-container {
  @apply overflow-hidden;
  @apply rounded-t-2xl;
}

.bh-table__table {
  @apply w-full;
}

.table-header {
  @apply bg-dark-gray-800 border-b border-border-dark;
}

.header-cell {
  @apply px-6 py-4 text-left;
  @apply text-sm font-medium text-gray-400;
  @apply transition-colors;
}

.header-cell:hover {
  @apply text-warm-white-500;
}

.header-cell--center {
  @apply text-center;
}

.header-content {
  @apply flex items-center justify-center;
}

.sort-indicator {
  @apply ml-2 text-warm-white-500;
  @apply transition-all duration-300 ease-in-out;
  transform: rotate(0deg);
}

.sort-indicator--desc {
  transform: rotate(180deg);
}

.table-row {
  @apply border-b border-dark-gray-450;
  @apply hover:bg-dark-gray-700/50;
  @apply transition-colors;
}

.table-cell {
  @apply px-6 py-4;
  @apply text-sm text-warm-white-500;
}

.pagination {
  @apply flex justify-between items-center;
  @apply px-6 py-3;
}

.pagination-info {
  @apply text-sm text-gray-400;
}

.pagination-controls {
  @apply flex items-center gap-2;
}

.pagination-button {
  @apply w-8 h-8 flex items-center justify-center;
  @apply bg-dark-gray-700 hover:bg-dark-gray-600;
  @apply border border-border-dark rounded;
  @apply text-sm;
  @apply transition-colors;
}

.pagination-button--active {
  @apply bg-deep-blue-500 border-deep-blue-500;
  @apply text-warm-white-500;
}

.pagination-button:disabled {
  @apply opacity-50 cursor-not-allowed;
  @apply hover:bg-dark-gray-700;
}
</style>
