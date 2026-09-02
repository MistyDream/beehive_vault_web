<template>
  <span class="bh-badge" :class="[`variant-${variant}`, `size-${size}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
});
</script>

<style lang="css" scoped>
.bh-badge {
  @apply inline-flex items-center gap-1.5 rounded-full border font-medium;
}

.size-sm {
  @apply px-2 py-0.5 text-xs;
}

.size-md {
  @apply px-3 py-1 text-sm;
}

.variant-neutral {
  @apply border-theme-border-primary bg-theme-bg-elevated text-theme-text-secondary;
}

.variant-accent {
  @apply border-theme-accent-primary/40 bg-theme-accent-primary/20 text-theme-accent-primary-strong;
}

.variant-success {
  @apply border-theme-status-success/40 bg-theme-status-success/20 text-theme-status-success-strong;
}

.variant-warning {
  @apply border-theme-status-warning/40 bg-theme-status-warning/20 text-theme-status-warning-strong;
}

.variant-error {
  @apply border-theme-status-error/40 bg-theme-status-error/20 text-theme-status-error-strong;
}

.variant-info {
  @apply border-theme-status-info/40 bg-theme-status-info/20 text-theme-status-info-strong;
}
</style>
