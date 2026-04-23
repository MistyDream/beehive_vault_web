<template>
  <Transition name="bh-sidebar-overlay">
    <div
      v-if="isOpen"
      class="bh-sidebar__overlay"
      aria-hidden="true"
      @click="close"
    />
  </Transition>

  <nav
    id="bh-main-sidebar"
    class="bh-sidebar"
    :class="{ 'bh-sidebar--open': isOpen }"
    :aria-label="t('nav.main')"
  >
    <div class="bh-sidebar--head">
      <BHImage
        src="/img/beehive_vault_logo.png"
        alt=""
        class="bh-sidebar--head__logo"
      />
      <div class="bh-sidebar--head__app-name">BeeHive Vault</div>
      <button
        type="button"
        class="bh-sidebar--head__close"
        :aria-label="t('nav.close_menu')"
        @click="close"
      >
        <LucideX :size="20" aria-hidden="true" />
      </button>
    </div>
    <BHSeparator />
    <div class="bh-sidebar--content">
      <BHVerticalNavigation :items="navigation">
        <template #icon="{ item }">
          <component :is="item.icon" :size="20" aria-hidden="true" />
        </template>
      </BHVerticalNavigation>
    </div>
    <div class="bh-sidebar--footer">
      <ClientOnly>
        <button
          type="button"
          class="bh-sidebar--theme-toggle"
          :aria-label="isDark ? t('theme.switch_to_light') : t('theme.switch_to_dark')"
          @click="toggle"
        >
          <component :is="isDark ? LucideSun : LucideMoon" :size="18" aria-hidden="true" />
          <span>{{ isDark ? t('theme.light_mode') : t('theme.dark_mode') }}</span>
        </button>
      </ClientOnly>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  LucideLayoutDashboard,
  LucideWallet,
  LucideSun,
  LucideMoon,
  LucideX,
} from '#components';
import type { NavigationLink } from '~/types/navigation-link';

const { t } = useI18n();
const localePath = useLocalePath();
const { isDark, toggle } = useTheme();
const { isOpen, close } = useSidebar();
const route = useRoute();

const navigation = computed<NavigationLink[]>(() => [
  {
    text: t('dashboard'),
    to: localePath('/'),
    icon: LucideLayoutDashboard,
  },
  {
    text: t('bank-account'),
    to: localePath('/bank-account'),
    icon: LucideWallet,
  },
]);

watch(() => route.fullPath, () => {
  if (isOpen.value) close();
});

onKeyStroke('Escape', (e) => {
  if (!isOpen.value) return;
  e.preventDefault();
  close();
});
</script>

<style scoped>
.bh-sidebar__overlay {
  @apply fixed inset-0 z-40;
  @apply bg-theme-overlay/60;
  @apply lg:hidden;
}

.bh-sidebar {
  @apply fixed inset-y-0 left-0 z-50;
  @apply flex flex-col gap-4 items-center;
  @apply w-72 pt-4;
  @apply bg-theme-bg-secondary drop-shadow-md;
  @apply -translate-x-full lg:translate-x-0;
  @apply transition-transform duration-250 ease-out;
}

.bh-sidebar--open {
  @apply translate-x-0;
}

.bh-sidebar--head {
  @apply relative flex gap-4 items-center;
  @apply h-fit w-full px-4;
}

.bh-sidebar--head__logo {
  @apply h-12 w-12;
}

.bh-sidebar--head__app-name {
  @apply flex-1 font-poppins text-base;
}

.bh-sidebar--head__close {
  @apply flex items-center justify-center;
  @apply w-11 h-11 rounded-lg;
  @apply text-theme-text-muted;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply lg:hidden;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-sidebar--content {
  @apply flex;
  @apply w-full mt-5 px-4;
}

.bh-sidebar--footer {
  @apply flex mt-auto mb-4 w-full px-4;
}

.bh-sidebar--theme-toggle {
  @apply flex items-center gap-3 w-full px-3 py-3 min-h-[44px];
  @apply rounded-md text-sm font-medium;
  @apply text-theme-text-secondary;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply transition-colors duration-200;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-sidebar-overlay-enter-active,
.bh-sidebar-overlay-leave-active {
  transition: opacity 200ms ease-out;
}

.bh-sidebar-overlay-enter-from,
.bh-sidebar-overlay-leave-to {
  opacity: 0;
}
</style>
