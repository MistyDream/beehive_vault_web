<template>
  <BHCardBase class="bh-filter-card">
    <div class="bh-filter-card--header">
      <div class="bh-filter-card--header-title">Stock Analysis</div>
      <div class="bh-filter-card--header-actions">
        <BHButton class="filters-button">
          <LucideFilter :size="16" />
          Filters
        </BHButton>
        <BHDropdown>
          <template #trigger>
            <BHButton class="filters-button">
              Sort by: Score (High to Low)
              <LucideChevronDown :size="16" />
            </BHButton>
          </template>
        </BHDropdown>
      </div>
    </div>
    <div class="bh-filter-card--filters">
      <div
        v-for="filter in activeFilters"
        :key="filter.type"
        class="filter-badge"
        :class="getFilterColorClass(filter.value)"
      >
        <span>{{ filter.type }} {{ filter.operator }} {{ filter.value }}</span>
        <BHButton
          class="filter-badge__close"
          variant="ghost"
          @click="removeFilter(filter.type)"
        >
          <LucideX :size="14" />
        </BHButton>
      </div>
    </div>
  </BHCardBase>
</template>

<script setup lang="ts">
const activeFilters = ref<
  {
    type: string;
    operator: string;
    value: string;
  }[]
>([
  {
    type: 'Score',
    operator: '>',
    value: '70',
  },
  {
    type: 'Profitability',
    operator: '>',
    value: '80',
  },
]);

// Fonction pour déterminer la couleur selon la valeur
const getFilterColorClass = (value: string) => {
  const numValue = parseInt(value);

  if (numValue >= 80) {
    return 'filter-badge--green';
  } else if (numValue >= 60) {
    return 'filter-badge--blue';
  } else if (numValue >= 40) {
    return 'filter-badge--yellow';
  } else if (numValue >= 20) {
    return 'filter-badge--orange';
  } else {
    return 'filter-badge--red';
  }
};

const removeFilter = (filterType: string) => {
  // Logique de suppression du filtre
  console.log(`Removing filter: ${filterType}`);
  activeFilters.value = activeFilters.value.filter(
    (filter) => filter.type !== filterType,
  );
};
</script>

<style lang="css" scoped>
.bh-filter-card {
  @apply flex flex-col gap-4;
}

.bh-filter-card--header {
  @apply flex justify-between items-center;
  @apply w-full;
}

.bh-filter-card--header-title {
  @apply text-xl font-semibold text-warm-white-500;
}

.bh-filter-card--header-actions {
  @apply flex items-center gap-2;
}

.filters-button {
  @apply flex items-center gap-2;
  @apply bg-dark-gray-800 hover:bg-dark-gray-600;
  @apply border border-dark-gray-450 rounded-lg;
  @apply px-4 py-2;
  @apply text-sm;
}

.bh-filter-card--filters {
  @apply flex items-center gap-2;
  @apply w-full;
  @apply flex-wrap;
}

.filter-badge {
  @apply flex items-center gap-2;
  @apply px-3 py-1.5;
  @apply rounded-full;
  @apply text-sm font-medium;
  @apply border;
  @apply transition-all duration-200;
}

/* Couleurs selon la valeur */
.filter-badge--green {
  @apply bg-mint-green-500/20 text-mint-green-400;
  @apply border-mint-green-500/30;
  @apply hover:bg-mint-green-500/30;
}

.filter-badge--blue {
  @apply bg-deep-blue-500/20 text-deep-blue-400;
  @apply border-deep-blue-500/30;
  @apply hover:bg-deep-blue-500/30;
}

.filter-badge--yellow {
  @apply bg-golden-yellow-500/20 text-golden-yellow-400;
  @apply border-golden-yellow-500/30;
  @apply hover:bg-golden-yellow-500/30;
}

.filter-badge--orange {
  @apply bg-filter-orange-500/20 text-filter-orange-400;
  @apply border-filter-orange-500/30;
  @apply hover:bg-filter-orange-500/30;
}

.filter-badge--red {
  @apply bg-filter-red-500/20 text-filter-red-400;
  @apply border-filter-red-500/30;
  @apply hover:bg-filter-red-500/30;
}

.filter-badge__close {
  @apply flex items-center justify-center;
  @apply w-5 h-5;
  @apply rounded-full;
  @apply hover:bg-black/20;
  @apply transition-colors;
  @apply cursor-pointer;
  @apply border-none bg-transparent;
}

/* Couleurs spécifiques pour les boutons de fermeture */
.filter-badge--green .filter-badge__close {
  @apply hover:bg-mint-green-500/30;
  @apply text-mint-green-300;
}

.filter-badge--blue .filter-badge__close {
  @apply hover:bg-deep-blue-500/30;
  @apply text-deep-blue-300;
}

.filter-badge--yellow .filter-badge__close {
  @apply hover:bg-golden-yellow-500/30;
  @apply text-golden-yellow-300;
}

.filter-badge--orange .filter-badge__close {
  @apply hover:bg-filter-orange-500/30;
  @apply text-filter-orange-300;
}

.filter-badge--red .filter-badge__close {
  @apply hover:bg-filter-red-500/30;
  @apply text-filter-red-300;
}

.filter-badge__close:hover {
  @apply scale-110;
}
</style>
