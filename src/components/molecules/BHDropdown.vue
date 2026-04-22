<template>
  <div ref="triggerRef" class="bh-dropdown">
    <slot
      name="trigger"
      :is-open="isOpen"
      :toggle="handleToggle"
      :open="open"
      :close="close"
    >
      <button
        type="button"
        class="bh-dropdown__default-trigger"
        :disabled="disabled"
        :aria-expanded="isOpen"
        aria-haspopup="true"
        @click="handleToggle"
        @keydown.down.prevent="open"
      >
        {{ t('common.select_placeholder') }}
        <svg
          class="bh-dropdown__arrow"
          :class="{ 'bh-dropdown__arrow--open': isOpen }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </slot>

    <Teleport to="body">
      <div
        v-if="showMenu"
        ref="floatingRef"
        class="bh-dropdown__menu"
        :class="{
          'bh-dropdown__menu--entering': isPositioned && isAnimating && isOpen,
          'bh-dropdown__menu--leaving': isPositioned && isAnimating && !isOpen,
        }"
        :style="[
          floatingStyles,
          { transformOrigin: transformOrigin },
          !isPositioned && { visibility: 'hidden' },
        ]"
        role="menu"
        tabindex="-1"
        @keydown="handleMenuKeydown"
      >
        <template v-if="hasItems">
          <div class="bh-dropdown__items">
            <BHButton
              v-for="(item, index) in items"
              :ref="(el: Element | ComponentPublicInstance | null) => setItemRef(el, index)"
              :key="index"
              :to="item.to"
              :href="item.href"
              :disabled="item.disabled"
              role="menuitem"
              :tabindex="item.disabled ? -1 : 0"
              @click="handleItemSelect(item)"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
                :size="16"
                class="bh-dropdown__item-icon"
                aria-hidden="true"
              />
              <span>{{ item.text }}</span>
            </BHButton>
          </div>
        </template>
        <slot
          v-else
          name="content"
          :close="close"
          :is-open="isOpen"
          :toggle="handleToggle"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import {
  useFloating,
  offset as offsetMiddleware,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/vue';
import type { NavigationLink } from '~/types/navigation-link';

interface Props {
  modelValue?: boolean;
  disabled?: boolean;
  placement?:
    | 'bottom-start'
    | 'bottom-end'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'top';
  offset?: number;
  autoClose?: boolean;
  items?: NavigationLink[];
}

interface Emits {
  'update:modelValue': [value: boolean];
  open: [];
  close: [];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  placement: 'bottom-start',
  offset: 8,
  autoClose: true,
  items: () => [],
});

const emit = defineEmits<Emits>();

const { t } = useI18n();

const triggerRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();
const itemRefs = ref<HTMLElement[]>([]);
const reducedMotion = usePreferredReducedMotion();
const enterMs = computed(() => (reducedMotion.value === 'reduce' ? 0 : 200));
const leaveMs = computed(() => (reducedMotion.value === 'reduce' ? 0 : 160));

const [isOpen, toggle] = useToggle(props.modelValue);
const showMenu = ref(false);
const isAnimating = ref(false);
const items = computed(() => props.items);
const hasItems = computed(() => items.value.length > 0);

const setItemRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  if (!el) {
    return;
  }
  const node =
    el instanceof Element
      ? el
      : ((el as ComponentPublicInstance).$el as HTMLElement);
  if (node instanceof HTMLElement) {
    itemRefs.value[index] = node;
  }
};

const focusableItems = () =>
  itemRefs.value.filter(
    (el): el is HTMLElement =>
      !!el && !el.hasAttribute('disabled') && el.tabIndex !== -1,
  );

const { start: scheduleOpenEnd } = useTimeoutFn(() => {
  isAnimating.value = false;
}, enterMs, { immediate: false });

const { start: scheduleCloseEnd } = useTimeoutFn(() => {
  showMenu.value = false;
  isAnimating.value = false;
}, leaveMs, { immediate: false });

const open = () => {
  if (props.disabled || isAnimating.value) return;
  showMenu.value = true;
  isOpen.value = true;
  isAnimating.value = true;
  scheduleOpenEnd();
};

const close = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  isOpen.value = false;
  scheduleCloseEnd();
};

const handleItemSelect = (item: NavigationLink) => {
  if (item.disabled) {
    return;
  }
  item.onClick?.();
  if (props.autoClose) {
    close();
    getTriggerButton()?.focus();
  }
};

const handleToggle = () => {
  if (props.disabled || isAnimating.value) return;
  if (isOpen.value) {
    close();
  } else {
    open();
  }
};

const handleMenuKeydown = (e: KeyboardEvent) => {
  const focusable = focusableItems();
  if (focusable.length === 0) return;

  const currentIndex = focusable.findIndex(
    (el) => el === document.activeElement,
  );

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault();
      const next =
        currentIndex < 0 ? 0 : (currentIndex + 1) % focusable.length;
      focusable[next]?.focus();
      break;
    }
    case 'ArrowUp': {
      e.preventDefault();
      const prev =
        currentIndex <= 0
          ? focusable.length - 1
          : currentIndex - 1;
      focusable[prev]?.focus();
      break;
    }
    case 'Home':
      e.preventDefault();
      focusable[0]?.focus();
      break;
    case 'End':
      e.preventDefault();
      focusable[focusable.length - 1]?.focus();
      break;
    case 'Escape':
      e.preventDefault();
      close();
      getTriggerButton()?.focus();
      break;
    case 'Tab':
      close();
      break;
  }
};

const getTriggerButton = (): HTMLElement | undefined => {
  const btn = triggerRef.value?.querySelector<HTMLElement>(
    'button, [role="button"], a, [tabindex]:not([tabindex="-1"])',
  );
  return btn ?? undefined;
};

const { floatingStyles, isPositioned, placement: resolvedPlacement } =
  useFloating(triggerRef, floatingRef, {
    placement: computed(() => props.placement),
    middleware: [
      offsetMiddleware(() => props.offset),
      flip(),
      shift({ padding: 16 }),
    ],
    strategy: 'fixed',
    transform: false,
    whileElementsMounted: autoUpdate,
  });

const transformOrigin = computed(() => {
  const [side, align] = resolvedPlacement.value.split('-');
  const vertical = side === 'top' ? 'bottom' : 'top';
  const horizontal =
    align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
  return `${vertical} ${horizontal}`;
});

onClickOutside(
  triggerRef,
  () => {
    if (isOpen.value && !isAnimating.value) close();
  },
  { ignore: [floatingRef] },
);

watch(isOpen, async (newValue) => {
  if (newValue) {
    emit('open');
    await nextTick();
    const focusable = focusableItems();
    focusable[0]?.focus();
  } else {
    emit('close');
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== isOpen.value) {
      if (newValue) {
        open();
      } else {
        close();
      }
    }
  },
);

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue);
});

onMounted(() => {
  if (props.modelValue) {
    showMenu.value = true;
  }
});
</script>

<style lang="css" scoped>
.bh-dropdown {
  @apply relative inline-block;
}

.bh-dropdown__default-trigger {
  @apply flex items-center justify-between gap-2;
  @apply bg-theme-bg-card text-theme-text-primary;
  @apply px-4 py-2 rounded-lg;
  @apply border border-theme-border-secondary;
  @apply hover:bg-theme-bg-elevated transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply min-w-[200px];
}

.bh-dropdown__arrow {
  @apply transition-transform duration-200;
  @apply shrink-0;
}

.bh-dropdown__arrow--open {
  @apply rotate-180;
}

.bh-dropdown__menu {
  @apply bg-theme-bg-card rounded-2xl;
  @apply border border-theme-border-secondary;
  @apply shadow-xl;
  @apply min-w-[200px];
  @apply py-2;
  @apply z-50;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
  will-change: transform, opacity;
}

.bh-dropdown__menu--entering {
  animation: bh-dropdown-enter 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.bh-dropdown__menu--leaving {
  animation: bh-dropdown-leave 140ms ease-in forwards;
}

@keyframes bh-dropdown-enter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bh-dropdown-leave {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}

.bh-dropdown__items {
  @apply flex flex-col;
}
</style>
