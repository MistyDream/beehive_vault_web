<template>
  <BHCardBase class="bh-score-card">
    <BHIconCard :icon="icon" :icon-color="iconColor" />
    <span class="bh-score-card--label">{{ label }}</span>
    <span class="bh-score-card--score">{{ score }}</span>
    <span class="bh-score-card--progress-bar">
      <span
        class="bh-score-card--bar"
        :class="progressBarClass"
        :style="{
          width: score + '%',
        }"
      />
    </span>
  </BHCardBase>
</template>

<script setup lang="ts">
export interface ScoreCardProps {
  label: string;
  score?: number;
  icon?: Component | null;
  iconColor?: 'gold' | 'blue' | 'green' | 'red' | 'orange';
}

const props = withDefaults(defineProps<ScoreCardProps>(), {
  score: 0,
  icon: null,
  iconColor: 'gold',
});

const progressBarClass = computed(() => {
  return {
    'bh-score-card--bar-green': props.score >= 80,
    'bh-score-card--bar-blue': props.score < 80 && props.score >= 60,
    'bh-score-card--bar-gold': props.score < 60 && props.score >= 40,
    'bh-score-card--bar-orange': props.score < 40 && props.score >= 20,
    'bh-score-card--bar-red': props.score < 20,
  };
});
</script>

<style lang="css" scoped>
.bh-score-card {
  @apply flex flex-col gap-2;
}

.bh-score-card--label {
  @apply text-warm-white-500 font-bold;
}

.bh-score-card--score {
  @apply text-3xl font-space;
}

.bh-score-card--progress-bar {
  @apply h-2 w-40 rounded-full;
  @apply bg-dark-gray-800;
}

.bh-score-card--bar {
  @apply flex h-2 rounded-full;
  @apply bg-gradient-to-r;
}

.bh-score-card--bar-gold {
  @apply text-dark-gray-900 from-golden-yellow-500 to-golden-yellow-800;
}

.bh-score-card--bar-blue {
  @apply text-warm-white-500 from-deep-blue-500 to-deep-blue-800;
}

.bh-score-card--bar-green {
  @apply text-warm-white-500 from-mint-green-600 to-mint-green-900;
}

.bh-score-card--bar-red {
  @apply text-warm-white-500 from-filter-red-500 to-filter-red-900;
}

.bh-score-card--bar-orange {
  @apply text-warm-white-500 from-filter-orange-600 to-filter-orange-900;
}
</style>
