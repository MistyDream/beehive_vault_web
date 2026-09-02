<template>
  <NuxtLink
    :to="item.to"
    class="bh-navigation-link"
    active-class="is-active"
    exact-active-class="is-active"
  >
    <span class="bh-navigation-link__icon" aria-hidden="true">
      <component :is="item.icon" :size="20" />
    </span>
    <span class="bh-navigation-link__label">{{ item.label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation-item';

interface Props {
  item: NavigationItem;
}

defineProps<Props>();
</script>

<style lang="css" scoped>
.bh-navigation-link {
  @apply inline-flex min-h-11 items-center justify-center rounded-control no-underline;
  @apply transition-colors duration-200;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-navigation-link__icon {
  @apply inline-flex shrink-0;
}
</style>
