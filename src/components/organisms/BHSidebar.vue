<template>
  <nav class="bh-sidebar">
    <div class="bh-sidebar--head">
      <div class="flex items-center text-2xl">Logo</div>
      <!-- <div class="bh-sidebar--app-name">BeeHive Vault</div> -->
      <div class="bh-sidebar--head__button">
        <BHButton>
          <LucidePanelLeft />
        </BHButton>
      </div>
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
  LucideSettings,
  LucideWallet,
  LucideBarChart,
  LucideTrendingUp,
  LucideBriefcaseBusiness,
} from '#components';
import type { NavigationLink } from '~/types/navigation-link';

const navigation: NavigationLink[] = [
  {
    text: 'Dashboard',
    to: '/',
    icon: LucideLayoutDashboard,
  },
  {
    text: 'Actions',
    icon: LucideBriefcaseBusiness,
    isExpandable: true,
    children: [
      {
        text: "Vue d'ensemble",
        to: '/shares',
        icon: LucideBarChart,
      },
      {
        text: 'Classifications',
        to: '/shares/classifications',
        icon: LucideTrendingUp,
      },
    ],
  },
  {
    text: 'Comptes bancaires',
    to: '/bank-account',
    icon: LucideWallet,
  },
  {
    text: 'Paramètres',
    to: '/settings',
    icon: LucideSettings,
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

.bh-sidebar--content {
  @apply flex;
  @apply w-full mt-5 px-4;
}

.bh-sidebar--app-name {
  @apply font-poppins text-sm;
}

.bh-sidebar--head__button {
  @apply flex grow justify-end;
}
</style>
