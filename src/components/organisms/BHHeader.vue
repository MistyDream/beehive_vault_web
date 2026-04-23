<template>
  <header class="bh-header">
    <button
      type="button"
      class="bh-header__menu-trigger"
      :aria-label="t('nav.open_menu')"
      aria-controls="bh-main-sidebar"
      :aria-expanded="isOpen"
      @click="toggle()"
    >
      <LucideMenu :size="24" aria-hidden="true" />
    </button>
  </header>
</template>

<script setup lang="ts">
import { LucideMenu } from '#components';

const { t } = useI18n();
const { isOpen, toggle } = useSidebar();
</script>

<style lang="css" scoped>
.bh-header {
  @apply flex items-center gap-3;
  @apply ml-0 lg:ml-72 p-4;
  @apply lg:hidden;
}

.bh-header__menu-trigger {
  @apply flex items-center justify-center;
  @apply w-11 h-11 rounded-lg;
  @apply text-theme-text-primary;
  @apply hover:bg-theme-bg-elevated;
  @apply transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}
</style>
