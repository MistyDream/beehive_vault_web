<template>
  <BHCardBase type="darker" class="bh-category-score-card">
    <div class="bh-category-score-card--header">
      <div class="bh-category-score-card--header-content">
        <BHIconCard size="lg" :icon="icon" :icon-color="iconColor" />
        <div>
          <h3 class="bh-category-score-card--title">{{ title }}</h3>
          <span class="bh-category-score-card--description">
            {{ description }}
          </span>
        </div>
      </div>
      <div
        class="bh-category-score-card--header-score"
        :class="colorScoreClass"
      >
        <span class="bh-category-score-card--score-note">{{ score }}/100</span>
        <span class="bh-category-score-card--score-rating">{{ rating }}</span>
      </div>
    </div>
    <div class="bh-category-score-card--content">
      <BHMetricScoreCard
        v-for="(item, key) in metricArray"
        :key="key"
        :metric="item"
      />
    </div>
  </BHCardBase>
</template>

<script setup lang="ts">
import type { ValuationScore } from '~/types/score';

interface Props {
  title?: string;
  description?: string;
  icon?: Component | null;
  iconColor?: 'gold' | 'blue' | 'green' | 'red' | 'orange';
  score?: number;
  metricScore?: ValuationScore | null;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  icon: null,
  iconColor: 'gold',
  score: 0,
  metricScore: null,
});

const metricArray = computed(() => {
  if (!props.metricScore) return [];

  const array = Object.entries(props.metricScore)
    .map(([key, value]) => ({
      name: key,
      ...value,
    }))
    .filter((item) => typeof item.score === 'number' && !isNaN(item.score));

  return array;
});

const colorScoreClass = computed(() => {
  return {
    'bh-score-green': props.score >= 80,
    'bh-score-blue': props.score < 80 && props.score >= 60,
    'bh-score-gold': props.score < 60 && props.score >= 40,
    'bh-score-orange': props.score < 40 && props.score >= 20,
    'bh-score-red': props.score < 20,
  };
});

const rating = computed(() => {
  if (props.score >= 80) return 'Excellent';
  if (props.score >= 60) return 'Bon';
  if (props.score >= 40) return 'Moyen';
  if (props.score >= 20) return 'Mauvais';

  return 'Médiocre';
});
</script>

<style lang="css" scoped>
.bh-category-score-card {
  @apply flex flex-col;
  @apply w-full;
}

.bh-category-score-card--header {
  @apply flex justify-between;
  @apply w-full;
}

.bh-category-score-card--header-content {
  @apply flex gap-4;
}

.bh-category-score-card--title {
  @apply text-xl text-warm-white-500;
}

.bh-category-score-card--description {
  @apply text-sm text-dark-gray-400;
}

.bh-category-score-card--header-score {
  @apply flex flex-col items-end;
}

.bh-category-score-card--score-note {
  @apply text-2xl font-bold font-space;
}

.bh-category-score-card--score-rating {
  @apply px-3;
  @apply rounded-full;
  @apply text-sm font-bold;
}

.bh-category-score-card--content {
  @apply grid grid-cols-3 gap-6;
  @apply w-full;
}

.bh-score-green {
  .bh-category-score-card--score-note {
    @apply text-mint-green-600;
  }

  .bh-category-score-card--score-rating {
    @apply text-mint-green-500 bg-mint-green-900;
  }
}

.bh-score-blue {
  .bh-category-score-card--score-note {
    @apply text-deep-blue-500;
  }

  .bh-category-score-card--score-rating {
    @apply text-deep-blue-400 bg-deep-blue-800;
  }
}

.bh-score-gold {
  .bh-category-score-card--score-note {
    @apply text-golden-yellow-500;
  }

  .bh-category-score-card--score-rating {
    @apply text-golden-yellow-500 bg-golden-yellow-900;
  }
}

.bh-score-orange {
  .bh-category-score-card--score-note {
    @apply text-filter-orange-500;
  }

  .bh-category-score-card--score-rating {
    @apply text-filter-orange-500 bg-filter-orange-900;
  }
}

.bh-score-red {
  .bh-category-score-card--score-note {
    @apply text-filter-red-500;
  }

  .bh-category-score-card--score-rating {
    @apply text-filter-red-400 bg-filter-red-900;
  }
}
</style>
