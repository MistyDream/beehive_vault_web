<template>
  <header class="bh-header">
    <button
      type="button"
      class="bh-header__menu-trigger"
      :aria-label="t('nav.open_menu')"
      aria-controls="bh-main-sidebar"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <LucideMenu :size="24" aria-hidden="true" />
    </button>

    <div v-show="title" class="bh-header__content">
      <h1 class="bh-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="bh-header__subtitle">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { LucideMenu } from '#components';
import { useHeaderStore } from '~/stores/header';

const { t } = useI18n();
const { isOpen, toggle } = useSidebar();

const title = computed(() => useHeaderStore().title);
const subtitle = computed(() => useHeaderStore().subtitle);
</script>

<style lang="css" scoped>
.bh-header {
  @apply flex items-center gap-3;
  @apply ml-0 lg:ml-72 p-4;
}

.bh-header__menu-trigger {
  @apply flex items-center justify-center;
  @apply w-11 h-11 rounded-lg;
  @apply text-theme-text-primary;
  @apply hover:bg-theme-bg-elevated;
  @apply lg:hidden;
  @apply transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-header__content {
  @apply flex flex-col min-w-0;
}

.bh-header__title {
  @apply font-poppins text-2xl font-bold truncate;
}

.bh-header__subtitle {
  @apply text-sm text-theme-text-secondary truncate;
}
</style>
