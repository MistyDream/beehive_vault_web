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
            class="absolute top-0 left-0 text-theme-text-muted"
            :aria-label="t('common.close')"
            @click="close"
          >
            <LucideX :size="20" aria-hidden="true" />
          </BHButton>
          <component :is="icon" :size="24" class="bh-drawer--header__icon" />
          <h1 :id="titleId">{{ title }}</h1>
        </div>
        <div class="bh-drawer--content">
          <component :is="content" v-bind="props" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
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

onMounted(() => {
  const isScrollLocked = useScrollLock(document.body);
  const { activate, deactivate } = useFocusTrap(drawerRef, {
    allowOutsideClick: true,
    returnFocusOnDeactivate: false,
  });

  let previousFocus: HTMLElement | null = null;

  watch(showDrawer, (open) => {
    isScrollLocked.value = open;
    if (open) {
      previousFocus = document.activeElement as HTMLElement | null;
      nextTick(() => activate());
    } else {
      deactivate();
      if (previousFocus && document.body.contains(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
      previousFocus = null;
    }
  });
});
</script>

<style lang="css" scoped>
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
  @apply w-full sm:w-[480px] lg:w-[560px] h-screen p-4;
  @apply bg-theme-bg-card;
  @apply shadow-2xl;
}

.bh-drawer--header {
  @apply flex gap-2 items-center justify-start;
  @apply p-4;
  @apply font-poppins text-xl font-bold text-theme-text-primary;
}

.bh-drawer--header__icon {
  @apply text-theme-text-primary;
}

.bh-drawer--content {
  @apply p-4;
}
</style>
