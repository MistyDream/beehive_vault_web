<template>
  <span class="bh-score-badge" :class="scoreClass">
    {{ score }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  score: number;
  isGlobalScore?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isGlobalScore: false,
});

const scoreClass = computed(() => {
  const baseClass = props.isGlobalScore
    ? 'bh-score-badge--global'
    : 'bh-score-badge--category';

  // Utiliser les mêmes seuils que les filtres
  if (props.score >= 80) return `${baseClass} bh-score-badge--green`;
  if (props.score >= 60) return `${baseClass} bh-score-badge--blue`;
  if (props.score >= 40) return `${baseClass} bh-score-badge--yellow`;
  if (props.score >= 20) return `${baseClass} bh-score-badge--orange`;
  return `${baseClass} bh-score-badge--red`;
});
</script>

<style lang="css" scoped>
.bh-score-badge {
  @apply inline-flex items-center justify-center;
  @apply rounded-full font-medium;
  @apply border;
  @apply transition-all duration-200;
}

.bh-score-badge--global {
  @apply w-12 h-12 text-lg font-poppins font-semibold;
}

.bh-score-badge--category {
  @apply text-sm font-poppins font-semibold;
  @apply px-4 py-1;
}

/* Utiliser les mêmes couleurs que les filtres avec fond semi-transparent */
.bh-score-badge--global.bh-score-badge--green {
  @apply bg-gradient-to-r from-mint-green-500 to-deep-blue-500;
  @apply border-none text-dark-gray-900;
}

.bh-score-badge--global.bh-score-badge--blue {
  @apply bg-gradient-to-r from-deep-blue-500 to-golden-yellow-500;
  @apply border-none text-dark-gray-900;
}

.bh-score-badge--global.bh-score-badge--yellow {
  @apply bg-gradient-to-r from-golden-yellow-500 to-filter-orange-500;
  @apply border-none text-dark-gray-900;
}

.bh-score-badge--global.bh-score-badge--orange {
  @apply bg-gradient-to-r from-filter-orange-500 to-filter-red-500;
  @apply border-none text-dark-gray-900;
}

.bh-score-badge--global.bh-score-badge--red {
  @apply bg-gradient-to-r from-filter-red-500 to-filter-orange-500;
  @apply border-none text-dark-gray-900;
}

.bh-score-badge--category.bh-score-badge--green {
  @apply bg-mint-green-500/20 text-mint-green-400;
  @apply border-mint-green-500/30;
}

.bh-score-badge--category.bh-score-badge--blue {
  @apply bg-deep-blue-500/20 text-deep-blue-400;
  @apply border-deep-blue-500/30;
}

.bh-score-badge--category.bh-score-badge--yellow {
  @apply bg-golden-yellow-500/20 text-golden-yellow-400;
  @apply border-golden-yellow-500/30;
}

.bh-score-badge--category.bh-score-badge--orange {
  @apply bg-filter-orange-500/20 text-filter-orange-400;
  @apply border-filter-orange-500/30;
}

.bh-score-badge--category.bh-score-badge--red {
  @apply bg-filter-red-500/20 text-filter-red-400;
  @apply border-filter-red-500/30;
}
</style>
