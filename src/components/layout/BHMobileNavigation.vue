<template>
  <nav class="bh-mobile-navigation" :aria-label="navigationLabel">
    <ul class="bh-mobile-navigation__list">
      <li v-for="item in items" :key="item.to">
        <BHNavigationLink :item="item" class="bh-mobile-navigation__link" />
      </li>
      <li>
        <button
          type="button"
          class="bh-mobile-navigation__more"
          aria-haspopup="dialog"
          :aria-expanded="moreExpanded"
          @click="emit('more')"
        >
          <span class="bh-mobile-navigation__icon" aria-hidden="true">
            <component :is="moreIcon" :size="20" />
          </span>
          <span>{{ moreLabel }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import type { NavigationItem } from '~/types/navigation-item';

interface Props {
  navigationLabel: string;
  items: NavigationItem[];
  moreLabel: string;
  moreIcon: Component;
  moreExpanded?: boolean;
}

interface Emits {
  more: [];
}

withDefaults(defineProps<Props>(), {
  moreExpanded: false,
});

const emit = defineEmits<Emits>();
</script>

<style lang="css" scoped>
.bh-mobile-navigation {
  @apply fixed inset-x-0 bottom-0 z-30 lg:hidden;
  @apply border-t border-theme-border-primary bg-theme-bg-card;
  padding-bottom: env(safe-area-inset-bottom);
}

.bh-mobile-navigation__list {
  @apply grid grid-cols-4;
}

.bh-mobile-navigation__list > li {
  @apply min-w-0;
}

.bh-mobile-navigation__link,
.bh-mobile-navigation__more {
  @apply flex min-h-14 w-full flex-col items-center justify-center gap-1 px-1 py-2;
  @apply text-xs font-medium text-theme-text-muted no-underline;
}

.bh-mobile-navigation__link:not(.is-active):hover,
.bh-mobile-navigation__more:hover {
  @apply bg-theme-bg-elevated text-theme-text-primary;
}

.bh-mobile-navigation__link.is-active {
  @apply bg-theme-bg-elevated text-theme-accent-primary-strong;
}

.bh-mobile-navigation__more {
  @apply border-0 bg-transparent;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme-accent-primary;
}

.bh-mobile-navigation__icon {
  @apply inline-flex shrink-0;
}
</style>
