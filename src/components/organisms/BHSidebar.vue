<template>
  <nav class="bh-sidebar">
    <div class="bh-sidebar--head">
      <BHImage
        src="/img/beehive_vault_logo.png"
        alt="logo"
        class="bh-sidebar--head__logo"
      />
      <div class="bh-sidebar--head__app-name">BeeHive Vault</div>
      <!-- <div class="bh-sidebar--head__button">
        <BHButton>
          <LucidePanelLeft />
        </BHButton>
      </div> -->
    </div>
    <BHSeparator />
    <div class="bh-sidebar--content">
      <BHVerticalNavigation :items="navigation">
        <template #icon="{ item }">
          <component :is="item.icon" :size="20" />
        </template>
      </BHVerticalNavigation>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  LucideLayoutDashboard,
  LucideWallet,
} from '#components';
import type { NavigationLink } from '~/types/navigation-link';

const { t } = useI18n();

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
  @apply fixed flex flex-col gap-4 items-center;
  @apply h-screen w-72 pt-4;
  @apply bg-dark-gray-800 drop-shadow-md;
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

.bh-sidebar--head__button {
  @apply flex grow justify-end;
}
</style>
