<template>
  <span class="bh-tag" :class="colorClass">
    <slot />
    <button
      v-if="removable"
      type="button"
      class="bh-tag__remove"
      aria-label="Remove"
      @click.stop="$emit('remove')"
    >
      <LucideX :size="12" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { LucideX } from '#components';

interface Props {
  color?: 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  removable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'neutral',
  removable: false,
});

defineEmits<{
  (e: 'remove'): void;
}>();

const colorClass = computed(() => `bh-tag--${props.color}`);
</script>

<style lang="css" scoped>
.bh-tag {
  @apply inline-flex items-center gap-1;
  @apply text-xs font-medium px-2 py-0.5 rounded;
}

.bh-tag--accent {
  @apply bg-theme-accent-primary/25 text-theme-accent-primary;
}

.bh-tag--success {
  @apply bg-theme-status-success/25 text-theme-status-success;
}

.bh-tag--warning {
  @apply bg-theme-status-warning/25 text-theme-status-warning;
}

.bh-tag--error {
  @apply bg-theme-status-error/25 text-theme-status-error;
}

.bh-tag--info {
  @apply bg-theme-status-info/25 text-theme-status-info;
}

.bh-tag--neutral {
  @apply bg-theme-bg-elevated text-theme-text-secondary;
}

.bh-tag__remove {
  @apply rounded-full p-0.5;
  @apply hover:bg-black/10;
  @apply transition-colors;
}
</style>
