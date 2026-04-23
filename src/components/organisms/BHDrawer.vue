<template>
  <div v-if="showWrapper" class="bh-drawer-wrapper">
    <div class="bh-drawer-overlay" @click="close" />

    <Transition name="drawer" @after-leave="toggleWrapper">
      <div
        v-if="showDrawer"
        ref="drawerRef"
        class="bh-drawer"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div class="bh-drawer--header">
          <BHButton
            class="bh-drawer--close text-theme-text-muted"
            :aria-label="t('common.close')"
            @click="close"
          >
            <LucideX :size="20" aria-hidden="true" />
          </BHButton>
          <component :is="icon" :size="24" class="bh-drawer--header__icon" aria-hidden="true" />
          <h2 :id="titleId">{{ title }}</h2>
        </div>
        <div class="bh-drawer--content">
          <component :is="content" v-bind="props" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { LucideX } from '#components';

const { t } = useI18n();
const {
  showWrapper,
  showDrawer,
  title,
  icon,
  content,
  props,
  toggleWrapper,
  close,
} = useDrawer();

const drawerRef = ref<HTMLElement | null>(null);
const titleId = useId();

onKeyStroke('Escape', () => {
  if (showDrawer.value) close();
});

const bodyRef = ref<HTMLElement | null>(null);
const isScrollLocked = useScrollLock(bodyRef);

onMounted(() => {
  bodyRef.value = document.body;
});

watch(showDrawer, (open) => {
  isScrollLocked.value = open;
});

useModalFocusTrap(drawerRef, showDrawer);
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.drawer-enter-active {
  animation: bh-slideInRight 0.3s ease-out;
}

.drawer-leave-active {
  animation: bh-slideOutRight 0.3s ease-in;
}

.bh-drawer-wrapper {
  @apply fixed inset-0 z-50;
}

.bh-drawer-overlay {
  @apply absolute inset-0;
  @apply bg-theme-overlay/50;
  @apply cursor-pointer;
}

.bh-drawer {
  @apply absolute top-0 right-0;
  @apply flex flex-col;
  @apply w-full sm:w-[480px] lg:w-[560px] h-screen;
  @apply bg-theme-bg-card;
  @apply shadow-2xl;
}

.bh-drawer--header {
  @apply sticky top-0 z-10 shrink-0;
  @apply flex gap-2 items-center justify-start;
  @apply p-4 pl-14;
  @apply bg-theme-bg-card;
  @apply border-b border-theme-border-secondary/60;
  @apply font-poppins text-xl font-bold text-theme-text-primary;
}

.bh-drawer--close {
  @apply absolute top-2 left-2;
}

.bh-drawer--header__icon {
  @apply text-theme-text-primary;
}

.bh-drawer--content {
  @apply flex-1 min-h-0 overflow-y-auto;
  @apply p-4;
}
</style>
