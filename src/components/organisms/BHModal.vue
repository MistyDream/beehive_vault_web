<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="modelValue"
        class="bh-modal-overlay"
        @click="onOverlayClick"
      />
    </Transition>
    <Transition name="modal">
      <div
        v-if="modelValue"
        ref="modalRef"
        class="bh-modal"
        :class="sizeClass"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <header class="bh-modal__header">
          <component v-if="icon" :is="icon" :size="20" class="bh-modal__icon" />
          <h2 :id="titleId" class="bh-modal__title">{{ title }}</h2>
          <button
            type="button"
            class="bh-modal__close"
            :aria-label="t('common.close')"
            @click="close"
          >
            <LucideX :size="20" />
          </button>
        </header>

        <div class="bh-modal__content">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="bh-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { LucideX } from '#components';
import type { Component } from 'vue';

interface Props {
  modelValue: boolean;
  title: string;
  icon?: Component;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  size: 'md',
  closeOnOverlayClick: true,
  closeOnEscape: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const { t } = useI18n();
const modalRef = ref<HTMLElement | null>(null);
const titleId = computed(() => `bh-modal-title-${useId()}`);

const sizeClass = computed(() => `bh-modal--${props.size}`);

function close() {
  emit('update:modelValue', false);
}

function onOverlayClick() {
  if (props.closeOnOverlayClick) close();
}

onMounted(() => {
  const isScrollLocked = useScrollLock(document.body);
  const { activate, deactivate } = useFocusTrap(modalRef, {
    allowOutsideClick: true,
    escapeDeactivates: false,
  });

  watch(
    () => props.modelValue,
    (open) => {
      isScrollLocked.value = open;
      if (open) {
        nextTick(() => activate());
      } else {
        deactivate();
      }
    },
    { immediate: true },
  );

  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (!props.modelValue) return;
    if (e.key === 'Escape' && props.closeOnEscape) {
      e.preventDefault();
      close();
    }
  });
});
</script>

<style lang="css" scoped>
.bh-modal-overlay {
  @apply fixed inset-0 z-40;
  @apply bg-theme-overlay/60;
  @apply cursor-pointer;
}

.bh-modal {
  @apply fixed z-50;
  @apply bg-theme-bg-card border border-theme-border-secondary shadow-2xl;
  @apply flex flex-col;
  /* Mobile: bottom sheet full-width */
  @apply bottom-0 left-0 right-0;
  @apply rounded-t-2xl;
  @apply max-h-[90vh];
  /* Desktop: centered via fixed positioning + inline transform */
  @apply md:bottom-auto md:right-auto;
  @apply md:rounded-2xl;
  @apply md:max-h-[85vh];
  @apply md:w-full;
}

@media (min-width: 768px) {
  .bh-modal {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.bh-modal--sm {
  @apply md:max-w-sm;
}

.bh-modal--md {
  @apply md:max-w-lg;
}

.bh-modal--lg {
  @apply md:max-w-2xl;
}

.bh-modal__header {
  @apply flex items-center gap-3;
  @apply px-4 py-3 md:px-6 md:py-4;
  @apply border-b border-theme-border-secondary;
}

.bh-modal__icon {
  @apply text-theme-text-primary;
}

.bh-modal__title {
  @apply flex-1;
  @apply font-poppins text-lg md:text-xl font-semibold text-theme-text-primary;
}

.bh-modal__close {
  @apply flex items-center justify-center;
  @apply w-11 h-11 md:w-10 md:h-10;
  @apply rounded-lg;
  @apply text-theme-text-muted;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-modal__content {
  @apply flex-1 overflow-y-auto;
  @apply px-4 py-4 md:px-6 md:py-5;
}

.bh-modal__footer {
  @apply flex items-center justify-end gap-3;
  @apply px-4 py-3 md:px-6 md:py-4;
  @apply border-t border-theme-border-secondary;
}

/* Overlay fade in/out */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 200ms ease-out;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* Modal: mobile slides from bottom */
.modal-enter-active,
.modal-leave-active {
  transition:
    transform 250ms ease-out,
    opacity 200ms ease-out;
}

.modal-enter-from,
.modal-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Desktop: override to fade + scale */
@media (min-width: 768px) {
  .modal-enter-from,
  .modal-leave-to {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
  }

  .modal-enter-to,
  .modal-leave-from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
</style>
