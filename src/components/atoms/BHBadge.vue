<template>
  <span class="bh-badge" :class="badgeClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  type?: 'warning' | 'success' | 'error' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
});

const badgeClass = computed(() => {
  return `bh-badge--${props.type}`;
});
</script>

<style lang="css" scoped>
.bh-badge {
  @apply absolute flex items-center justify-center;
  @apply rounded-full border border-neutral-900;
  @apply text-neutral-900;
  @apply p-1;
}

.bh-badge--info {
  @apply bg-deep-blue-400;
}

.bh-badge--warning {
  @apply bg-filter-orange-500;
}

.bh-badge--success {
  @apply bg-mint-green-500;
}

.bh-badge--error {
  @apply bg-filter-red-500;
}
</style>
