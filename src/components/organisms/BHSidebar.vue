<template>
  <nav class="bh-sidebar">
    <div class="bh-sidebar--head">
      <BHImage
        src="/img/beehive_vault_logo.png"
        alt="logo"
        class="bh-sidebar--head__logo"
      />
      <div class="bh-sidebar--head__app-name">BeeHive Vault</div>
    </div>
    <BHSeparator />
    <div class="bh-sidebar--content">
      <BHVerticalNavigation :items="navigation">
        <template #icon="{ item }">
          <component :is="item.icon" :size="20" />
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
          <component :is="isDark ? LucideSun : LucideMoon" :size="18" />
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
} from '#components';
import type { NavigationLink } from '~/types/navigation-link';

const { t } = useI18n();
const { isDark, toggle } = useTheme();

const navigation: NavigationLink[] = [
  {
    text: t('dashboard'),
    to: '/',
    icon: LucideLayoutDashboard,
  },
  {
    text: t('bank-account'),
    to: '/bank-account',
    icon: LucideWallet,
  },
];
</script>

<style scoped>
.bh-sidebar {
  @apply hidden lg:flex fixed flex-col gap-4 items-center;
  @apply h-screen w-72 pt-4;
  @apply bg-theme-bg-secondary drop-shadow-md;
}

.bh-sidebar--head {
  @apply relative flex gap-4 items-center;
  @apply h-fit w-full px-4;
}

.bh-sidebar--head__logo {
  @apply h-12 w-12;
}

.bh-sidebar--content {
  @apply flex;
  @apply w-full mt-5 px-4;
}

.bh-sidebar--head__app-name {
  @apply font-poppins text-base;
}

.bh-sidebar--footer {
  @apply flex mt-auto mb-4 w-full px-4;
}

.bh-sidebar--theme-toggle {
  @apply flex items-center gap-3 w-full px-3 py-2;
  @apply rounded-md text-sm font-medium;
  @apply text-theme-text-secondary;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply transition-colors duration-200;
}
</style>
