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
      <BHStatsCard label="Total Tracked" :value="`${stocks.length} Stocks`">
        <template #actions>
          <BHButton
            variant="secondary"
            class="add-stock-button"
            @click="openDrawer"
          >
            <LucidePlus :size="16" />
            Add Stock
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
        :columns="tableColumns"
        :items-per-page="10"
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
          />
        </template>
      </BHTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUpdateHeader } from '~/composables/updateHeader';
import BHEditStockForm from '~/components/organisms/BHEditStockForm.vue';
import type { Stock } from '~/types/stock';
import {
  LucideBarChart,
  LucideBuilding2,
  LucidePlus,
  LucideTrendingUp,
} from '#components';

const { updateHeader } = useUpdateHeader();

// Configuration des colonnes du tableau
const tableColumns = [
  { key: 'name', label: 'Stock', centerAlign: false },
  {
    key: 'globalScore',
    label: 'Global Score',
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.valorisation',
    label: 'Valuation',
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.croissance',
    label: 'Growth',
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.profitabilite',
    label: 'Profitability',
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.santeFInanciere',
    label: 'Financial Health',
    centerAlign: true,
    sortable: true,
  },
  {
    key: 'ratings.retourInvestisseurs',
    label: 'Investor Returns',
    centerAlign: true,
    sortable: true,
  },
  { key: 'actions', label: 'Actions', centerAlign: true },
];

// Données de test avec scores numériques
const { list } = useStockApi();

const { data } = await list(1, 10);

const stocks = ref<Stock[]>(data.value || []);

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

function openDrawer() {
  open($t('shares-create'), LucideBuilding2, BHEditStockForm);
}

// Handlers pour les événements du tableau
const handlePageChange = (page: number) => {
  console.log('Page changed to:', page);
};

const handleSortChange = (sortBy: string, direction: 'asc' | 'desc') => {
  console.log('Sort changed:', sortBy, direction);
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
