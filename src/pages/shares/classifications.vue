<template>
  <section id="classifications" class="classifications-page">
    <!-- Cards de statistiques -->
    <div class="stats-grid">
      <BHStatsCard
        label="Average Score"
        :value="averageScore"
        :icon="LucideBarChart"
      />
      <BHStatsCard
        label="Excellent Stocks"
        :value="`${excellentStocksPercentage}%`"
        change="+5%"
        :is-positive="true"
        :icon="LucideTrendingUp"
      />
      <BHStatsCard label="Total Tracked" :value="`${total} Stocks`">
        <template #actions>
          <BHButton
            variant="secondary"
            class="add-stock-button"
            @click="openDrawer"
          >
            <LucidePlus :size="16" />
            {{ $t('add-stock') }}
          </BHButton>
        </template>
      </BHStatsCard>
    </div>

    <!-- Filters Stock Classification -->
    <BHFilterCard />

    <!-- Section Stock Analysis -->
    <div class="analysis-section">
      <BHTable
        :data="stocks"
        :total="total"
        :columns="tableColumns"
        :items-per-page="10"
        :page="page"
        sort-by="globalScore"
        sort-direction="desc"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
      >
        <template #rows="{ sortedData }">
          <BHShareRow
            v-for="share in sortedData"
            :key="share.id"
            :share="share"
            :on-drawer-close="refreshList"
          />
        </template>
      </BHTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUpdateHeader } from '~/composables/updateHeader';
import BHEditStockForm from '~/components/organisms/BHEditStockForm.vue';
import type { Stock, StockFilters } from '~/types/stock';
import {
  LucideBarChart,
  LucideBuilding2,
  LucidePlus,
  LucideTrendingUp,
} from '#components';

const { updateHeader } = useUpdateHeader();

// Configuration des colonnes du tableau
const tableColumns = [
  { key: 'name', label: $t('table.labels.stock'), centerAlign: false },
  {
    key: 'globalScore',
    label: $t('table.labels.globalScore'),
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.valorisation',
    label: $t('table.labels.valuation'),
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.croissance',
    label: $t('table.labels.growth'),
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.profitabilite',
    label: $t('table.labels.profitability'),
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.santeFInanciere',
    label: $t('table.labels.financialHealth'),
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.retourInvestisseurs',
    label: $t('table.labels.investorReturns'),
    centerAlign: true,
    sortable: true,
  },
  { key: 'actions', label: $t('actions'), centerAlign: true },
];

// Données de test avec scores numériques
const { list } = useStockApi();
const route = useRoute();
const router = useRouter();

// Initialize page and sort from URL query parameters
const page: Ref<number> = ref(Number(route.query.page) || 1);
const limit: Ref<number> = ref(10);

// Initialize sort from URL query parameters
const sort: Ref<StockFilters> = ref({
  score: { total: (route.query.sortScore as 'ASC' | 'DESC') || 'DESC' },
  stock: { name: (route.query.sortStock as 'ASC' | 'DESC') || 'ASC' },
});

const { data, refresh } = await list(page, limit, sort);

const stocks = computed<Stock[]>(() => data.value?.items ?? []);
const total = computed<number>(() => data.value?.total ?? 0);

// Computed properties pour les statistiques
const averageScore = computed(() => {
  // const total = shares.reduce((sum, share) => sum + share.globalScore, 0);
  // return Math.round((total / shares.length) * 10) / 10;
  return 0;
});

const excellentStocksPercentage = computed(() => {
  // const excellentCount = shares.filter(
  //   (share) => share.globalScore >= 90,
  // ).length;
  // return Math.round((excellentCount / shares.length) * 100);
  return 0;
});

const { open } = useDrawer();

// Method to refresh the stock list
function refreshList() {
  refresh();
}

function openDrawer() {
  open(
    $t('shares-create'),
    LucideBuilding2,
    BHEditStockForm,
    null,
    refreshList,
  );
}

// Handlers pour les événements du tableau
const handlePageChange = (pageUpdate: number) => {
  console.log('Page changed to:', pageUpdate);
  page.value = pageUpdate;

  // Update URL query parameter
  router.push({
    query: {
      ...route.query,
      page: pageUpdate.toString(),
    },
  });
};

const handleSortChange = (sortBy: string, direction: 'asc' | 'desc') => {
  console.log('Sort changed:', sortBy, direction);

  // Convert direction to uppercase for API
  const apiDirection = direction.toUpperCase() as 'ASC' | 'DESC';

  // Update sort object based on sortBy
  if (sortBy === 'globalScore') {
    sort.value = {
      score: { total: apiDirection },
      stock: { name: 'ASC' },
    };
  } else if (sortBy === 'name') {
    sort.value = {
      score: { total: 'DESC' },
      stock: { name: apiDirection },
    };
  }

  // Update URL query parameters
  router.push({
    query: {
      ...route.query,
      sortScore: sort.value.score?.total || 'DESC',
      sortStock: sort.value.stock?.name || 'ASC',
    },
  });
};

onMounted(() => {
  updateHeader({
    title: $t('classifications'),
    subtitle: $t('shares-classifications-subtitle'),
  });
});
</script>

<style lang="css" scoped>
.classifications-page {
  @apply px-4;
  @apply space-y-6;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.add-stock-button {
  @apply flex items-center gap-2;
  @apply px-2 py-1;
  @apply text-sm;
}

.analysis-section {
  @apply space-y-6;
}
</style>
