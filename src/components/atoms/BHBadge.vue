<template>
  <span class="bh-badge" :class="[variantClass, sizeClass, { 'bh-badge--rounded': rounded }]">
    <span v-if="dot" class="bh-badge__dot" />
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  dot: false,
  rounded: true,
});

const variantClass = computed(() => `bh-badge--${props.variant}`);
const sizeClass = computed(() => `bh-badge--${props.size}`);
</script>

<style lang="css" scoped>
.bh-badge {
  @apply inline-flex items-center gap-1.5;
  @apply font-medium border;
}

.bh-badge--rounded {
  @apply rounded-full;
}

.bh-badge:not(.bh-badge--rounded) {
  @apply rounded-md;
}

.bh-badge--sm {
  @apply text-xs px-2 py-0.5;
}

.bh-badge--md {
  @apply text-sm px-3 py-1;
}

.bh-badge__dot {
  @apply w-1.5 h-1.5 rounded-full bg-current;
}

.bh-badge--success {
  @apply bg-theme-status-success/15 text-theme-status-success border-theme-status-success/25;
}

.bh-badge--warning {
  @apply bg-theme-status-warning/15 text-theme-status-warning border-theme-status-warning/25;
}

.bh-badge--error {
  @apply bg-theme-status-error/15 text-theme-status-error border-theme-status-error/25;
}

.bh-badge--info {
  @apply bg-theme-status-info/15 text-theme-status-info border-theme-status-info/25;
}

.bh-badge--neutral {
  @apply bg-theme-bg-elevated text-theme-text-secondary border-theme-border-primary;
}
</style>
