<template>
  <div
    class="app-shell flex flex-col min-h-screen bg-theme-bg-primary text-theme-text-primary"
  >
    <a href="#main-content" class="app-shell__skip-link">
      {{ t('a11y.skip_to_main') }}
    </a>
    <BHDesktopSidebar
      :items="desktopNavigationItems"
      :home-to="localePath('/')"
      :navigation-label="t('nav.main')"
    />
    <main id="main-content" class="app-shell__main" tabindex="-1">
      <slot />
    </main>
    <BHMobileNavigation
      :items="mobileNavigationItems"
      :navigation-label="t('nav.main')"
      :more-label="t('nav.more')"
      :more-icon="LucideMenu"
    />
    <BHToaster />
  </div>
</template>

<script setup lang="ts">
import {
  LucideArrowLeftRight,
  LucideLayoutDashboard,
  LucideMenu,
  LucideWalletCards,
} from '#components';
import type { NavigationItem } from '~/types/navigation-item';

const { t } = useI18n();
const localePath = useLocalePath();

const desktopNavigationItems = computed<NavigationItem[]>(() => [
  {
    label: t('nav.overview'),
    to: localePath('/'),
    icon: LucideLayoutDashboard,
  },
  {
    label: t('nav.accounts'),
    to: localePath('/accounts'),
    icon: LucideWalletCards,
  },
  {
    label: t('nav.transactions'),
    to: localePath('/transactions'),
    icon: LucideArrowLeftRight,
  },
]);

const mobileNavigationItems = computed<NavigationItem[]>(() => [
  {
    label: t('nav.home'),
    to: localePath('/'),
    icon: LucideLayoutDashboard,
  },
  {
    label: t('nav.accounts'),
    to: localePath('/accounts'),
    icon: LucideWalletCards,
  },
  {
    label: t('nav.transactions'),
    to: localePath('/transactions'),
    icon: LucideArrowLeftRight,
  },
]);
</script>

<style lang="css" scoped>
.app-shell__skip-link {
  @apply fixed top-2 left-2 z-[100];
  @apply -translate-y-20 focus:translate-y-0;
  @apply px-4 py-2 rounded-md;
  @apply bg-theme-accent-primary text-theme-text-on-accent-primary;
  @apply font-medium text-sm no-underline;
  @apply transition-transform duration-150;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2;
}

.app-shell__main {
  @apply min-w-0 flex-1 focus:outline-none lg:ml-64;
  padding-bottom: calc(5rem + env(safe-area-inset-bottom));
}

@media (min-width: 1024px) {
  .app-shell__main {
    padding-bottom: 0;
  }
}
</style>
