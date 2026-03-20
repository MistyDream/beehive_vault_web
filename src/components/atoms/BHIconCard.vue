<template>
  <div
    class="bh-icon-card"
    :class="{
      'bh-icon-card--gold': iconColor === 'gold',
      'bh-icon-card--blue': iconColor === 'blue',
      'bh-icon-card--green': iconColor === 'green',
      'bh-icon-card--red': iconColor === 'red',
      'bh-icon-card--orange': iconColor === 'orange',
    }"
  >
    <component :is="icon" v-if="icon" :size="localSize" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'base' | 'lg';
  icon?: Component | null;
  iconColor?: 'gold' | 'blue' | 'green' | 'red' | 'orange';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'base',
  icon: null,
  iconColor: 'gold',
});

const localSize = computed<number>(() => {
  if (props.size === 'lg') return 28;

  return 20;
});
</script>

<style lang="css" scoped>
.bh-icon-card {
  @apply px-3 py-3 rounded-lg;
  @apply bg-gradient-to-br;
}

.bh-icon-card--gold {
  @apply text-dark-gray-900 from-golden-yellow-500 to-golden-yellow-800;
}

.bh-icon-card--blue {
  @apply text-warm-white-500 from-deep-blue-500 to-deep-blue-800;
}

.bh-icon-card--green {
  @apply text-warm-white-500 from-mint-green-600 to-mint-green-900;
}

.bh-icon-card--red {
  @apply text-warm-white-500 from-filter-red-500 to-filter-red-900;
}

.bh-icon-card--orange {
  @apply text-warm-white-500 from-filter-orange-600 to-filter-orange-900;
}
</style>
