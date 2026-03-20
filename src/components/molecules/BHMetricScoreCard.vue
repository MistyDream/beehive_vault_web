<template>
  <BHCardBase class="bh-metric-score-card" size="sm">
    <div class="bh-metric-score-card--header">
      <span class="bh-metric-score-card--title">
        {{ $t('stock.metric.' + metric.name) }}
      </span>
      <LucideCircleAlert class="bh-metric-score-card--help" :size="14" />
    </div>
    <span class="bh-metric-score-card--score" :class="noteClass">
      {{ metricScore }}
    </span>
    <div class="bh-metric-score-card--metric">
      <div
        v-if="metric.historicScore !== undefined"
        class="bh-metric-score-card--metric-score"
      >
        <span>Historique</span>
        <span>{{ historicScore }}/100</span>
      </div>
      <div
        v-if="metric.sectorScore !== undefined"
        class="bh-metric-score-card--metric-score"
      >
        <span>Secteur</span>
        <span>{{ sectorScore }}/100</span>
      </div>
      <div
        v-if="metric.boundsScore !== undefined"
        class="bh-metric-score-card--metric-score"
      >
        <span>Bornes</span>
        <span>{{ boundsScore }}/100</span>
      </div>
      <div
        v-if="metric.trendScore !== undefined"
        class="bh-metric-score-card--metric-score"
      >
        <span>Tendance</span>
        <span>{{ trendScore }}/100</span>
      </div>
    </div>
  </BHCardBase>
</template>

<script setup lang="ts">
interface Props {
  metric: {
    name: string;
    score: number;
    historicScore: number;
    sectorScore: number;
    boundsScore: number;
    trendScore: number;
  };
}

const props = defineProps<Props>();

const metricScore = computed(() => Math.round(props.metric.score));
const historicScore = computed(() => Math.round(props.metric.historicScore));
const sectorScore = computed(() => Math.round(props.metric.sectorScore));
const boundsScore = computed(() => Math.round(props.metric.boundsScore));
const trendScore = computed(() => Math.round(props.metric.trendScore));

const noteClass = computed(() => {
  return {
    'text-mint-green-500': metricScore.value >= 80,
    'text-deep-blue-400': metricScore.value < 80 && metricScore.value >= 60,
    'text-golden-yellow-500': metricScore.value < 60 && metricScore.value >= 40,
    'text-filter-orange-500': metricScore.value < 40 && metricScore.value >= 20,
    'text-filter-red-500': metricScore.value < 20,
  };
});
</script>

<style lang="css" scoped>
.bh-metric-score-card {
  @apply flex flex-col gap-2;
}

.bh-metric-score-card--header {
  @apply flex justify-between items-center;
  @apply w-full;
}

.bh-metric-score-card--title {
  @apply text-warm-white-500 font-medium font-poppins;
}

.bh-metric-score-card--help {
  @apply text-warm-white-500 cursor-help;
}

.bh-metric-score-card--score {
  @apply w-full;
  @apply text-xl font-space font-semibold;
}

.bh-metric-score-card--metric {
  @apply flex flex-col w-full;
}

.bh-metric-score-card--metric-score {
  @apply flex justify-between;
  @apply text-xs font-semibold text-dark-gray-400;
}
</style>
