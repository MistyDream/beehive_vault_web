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
      <BHStatsCard label="Total Tracked" :value="`${shares.length} Stocks`">
        <template #actions>
          <BHButton variant="secondary" class="add-stock-button">
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
        :data="shares"
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
import type { Share } from '~/types/share';
import { LucideBarChart, LucideTrendingUp, LucidePlus } from '#components';

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
const shares: Share[] = [
  {
    id: '1',
    name: 'NVDA',
    company: 'NVIDIA Corp',
    logoColor: '#10B981',
    globalScore: 92,
    ratings: {
      valorisation: 75,
      croissance: 98,
      profitabilite: 95,
      santeFInanciere: 90,
      retourInvestisseurs: 85,
    },
  },
  {
    id: '2',
    name: 'AAPL',
    company: 'Apple Inc',
    logoColor: '#3B82F6',
    globalScore: 88,
    ratings: {
      valorisation: 70,
      croissance: 78,
      profitabilite: 92,
      santeFInanciere: 95,
      retourInvestisseurs: 85,
    },
  },
  {
    id: '3',
    name: 'MSFT',
    company: 'Microsoft Corp',
    logoColor: '#8B5CF6',
    globalScore: 88,
    ratings: {
      valorisation: 72,
      croissance: 90,
      profitabilite: 95,
      santeFInanciere: 88,
      retourInvestisseurs: 82,
    },
  },
  {
    id: '4',
    name: 'TSLA',
    company: 'Tesla Inc',
    logoColor: '#EF4444',
    globalScore: 65,
    ratings: {
      valorisation: 45,
      croissance: 85,
      profitabilite: 68,
      santeFInanciere: 72,
      retourInvestisseurs: 65,
    },
  },
];

// Computed properties pour les statistiques
const averageScore = computed(() => {
  const total = shares.reduce((sum, share) => sum + share.globalScore, 0);
  return Math.round((total / shares.length) * 10) / 10;
});

const excellentStocksPercentage = computed(() => {
  const excellentCount = shares.filter(
    (share) => share.globalScore >= 90,
  ).length;
  return Math.round((excellentCount / shares.length) * 100);
});

// Handlers pour les événements du tableau
const handlePageChange = (page: number) => {
  console.log('Page changed to:', page);
};

const handleSortChange = (sortBy: string, direction: 'asc' | 'desc') => {
  console.log('Sort changed:', sortBy, direction);
};

onMounted(() => {
  updateHeader({
    title: 'Classifications',
    subtitle:
      'Analyse détaillée de vos actions selon différents critères de performance',
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
