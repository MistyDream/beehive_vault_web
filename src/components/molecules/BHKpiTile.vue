<template>
  <div class="bh-kpi-tile" :aria-busy="loading || undefined">
    <div class="bh-kpi-tile__header">
      <component
        :is="icon"
        v-if="icon"
        :size="16"
        :class="['bh-kpi-tile__icon', iconVariantClass]"
        aria-hidden="true"
      />
      <span class="bh-kpi-tile__label">{{ label }}</span>
    </div>
    <div class="bh-kpi-tile__value">
      <span v-if="loading" class="bh-kpi-tile__skeleton bh-skeleton" />
      <slot v-else>
        <span class="bh-kpi-tile__fallback">—</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  label: string;
  loading?: boolean;
  icon?: Component;
  iconVariant?: 'muted' | 'success' | 'error' | 'warning' | 'accent';
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  icon: undefined,
  iconVariant: 'muted',
});

const iconVariantClass = computed(
  () => `bh-kpi-tile__icon--${props.iconVariant}`,
);
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-kpi-tile {
  @apply flex flex-col gap-2;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply p-4 md:p-5;
}

.bh-kpi-tile__header {
  @apply flex items-center gap-2;
}

.bh-kpi-tile__icon {
  @apply text-theme-text-muted;
}

.bh-kpi-tile__icon--success {
  @apply text-theme-status-success;
}

.bh-kpi-tile__icon--error {
  @apply text-theme-status-error;
}

.bh-kpi-tile__icon--warning {
  @apply text-theme-status-warning;
}

.bh-kpi-tile__icon--accent {
  @apply text-theme-accent-primary;
}

.bh-kpi-tile__label {
  @apply text-xs font-medium uppercase tracking-wide;
  @apply text-theme-text-muted;
}

.bh-kpi-tile__value {
  @apply flex items-baseline gap-2;
  @apply font-poppins text-2xl font-semibold text-theme-text-primary;
  @apply min-h-[2rem];
}

.bh-kpi-tile__skeleton {
  @apply block h-6 w-24 rounded;
}

.bh-kpi-tile__fallback {
  @apply text-theme-text-muted font-space;
}
</style>
