<template>
  <div class="bh-kpi-tile" :aria-busy="loading || undefined">
    <div class="bh-kpi-tile__header">
      <component
        :is="icon"
        v-if="icon"
        :size="16"
        class="bh-kpi-tile__icon"
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
}

withDefaults(defineProps<Props>(), {
  loading: false,
  icon: undefined,
});
</script>

<style lang="css" scoped>
.bh-kpi-tile {
  @apply flex flex-col gap-2;
  @apply bg-theme-bg-card rounded-lg border border-theme-border-primary;
  @apply p-4;
}

.bh-kpi-tile__header {
  @apply flex items-center gap-2;
}

.bh-kpi-tile__icon {
  @apply text-theme-text-muted;
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
