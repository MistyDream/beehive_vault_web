<template>
  <BHCardBase>
    <div class="bh-stats-card--content">
      <div class="bh-stats-card--label">{{ label }}</div>
      <div class="bh-stats-card--value">
        {{ value }}
        <span v-if="change" class="bh-stats-card--change" :class="changeClass">
          {{ change }}
        </span>
      </div>
    </div>
    <div v-if="icon" class="bh-stats-card--icon">
      <component :is="icon" :size="24" />
    </div>
    <slot name="actions" />
  </BHCardBase>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  label: string;
  value: string | number;
  change?: string | null;
  icon?: Component | null;
  isPositive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  change: null,
  icon: null,
  isPositive: true,
});

const changeClass = computed(() => ({
  'text-green-400': props.isPositive,
  'text-red-400': !props.isPositive,
}));
</script>

<style lang="css" scoped>
.bh-stats-card--icon {
  @apply flex items-center justify-center;
  @apply w-12 h-12 rounded-full;
  @apply bg-gradient-to-r from-mint-green-400 to-deep-blue-400;
  @apply text-text-dark;
}

.bh-stats-card--content {
  @apply flex flex-col gap-2;
}

.bh-stats-card--label {
  @apply text-xs text-golden-yellow-500;
  @apply font-medium;
}

.bh-stats-card--value {
  @apply text-2xl font-bold text-warm-white-500;
  @apply flex items-baseline gap-2;
}

.bh-stats-card--change {
  @apply text-sm font-medium;
}
</style>
