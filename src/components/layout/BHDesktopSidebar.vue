<template>
  <aside class="bh-desktop-sidebar">
    <NuxtLink :to="homeTo" class="bh-desktop-sidebar__brand">
      <BHLogo class="bh-desktop-sidebar__brand-logo" />
      <span>Beehive Vault</span>
    </NuxtLink>
    <nav :aria-label="navigationLabel" class="bh-desktop-sidebar__navigation">
      <ul class="bh-desktop-sidebar__list">
        <li v-for="item in items" :key="item.to">
          <BHNavigationLink :item="item" class="bh-desktop-sidebar__link" />
        </li>
      </ul>
    </nav>
    <div class="bh-desktop-sidebar__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation-item';

interface Props {
  homeTo: string;
  navigationLabel: string;
  items: NavigationItem[];
}

defineProps<Props>();
</script>

<style lang="css" scoped>
.bh-desktop-sidebar {
  @apply fixed inset-y-0 left-0 z-30;
  @apply hidden w-64 flex-col overflow-y-auto px-4 py-6 lg:flex;
  @apply bg-theme-sidebar text-theme-sidebar-text;
}

.bh-desktop-sidebar__brand {
  @apply mb-8 flex min-h-11 items-center gap-2 rounded-control px-2;
  @apply text-base font-medium text-theme-sidebar-text no-underline;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-desktop-sidebar__brand-logo {
  @apply h-10 w-auto shrink-0 text-theme-sidebar-text;
}

.bh-desktop-sidebar__navigation {
  @apply flex-1;
}

.bh-desktop-sidebar__list {
  @apply flex flex-col gap-1.5;
}

.bh-desktop-sidebar__link {
  @apply w-full justify-start gap-3 px-3;
  @apply text-sm font-medium text-theme-sidebar-muted;
}

.bh-desktop-sidebar__link:not(.is-active):hover {
  @apply bg-theme-sidebar-selected/60 text-theme-sidebar-text;
}

.bh-desktop-sidebar__link.is-active {
  @apply bg-theme-sidebar-selected text-theme-accent-primary;
}

.bh-desktop-sidebar__footer {
  @apply mt-auto pt-4;
}
</style>
