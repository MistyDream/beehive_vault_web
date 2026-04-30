<template>
  <div class="bh-select">
    <label v-if="label" :for="triggerId" class="bh-select__label">
      {{ label }}
    </label>
    <div ref="selectRef" class="bh-select__wrapper">
      <button
        :id="triggerId"
        type="button"
        role="combobox"
        class="bh-select__control"
        :class="{
          'bh-select__control--disabled': disabled,
          'bh-select__control--open': isOpen,
          'bh-select__control--error': !!error,
        }"
        :disabled="disabled"
        :required="required || undefined"
        :aria-required="required || undefined"
        :aria-invalid="!!error || undefined"
        :aria-describedby="error ? errorId : undefined"
        :aria-haspopup="'listbox'"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-activedescendant="
          isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
        "
        @click="toggleDropdown"
        @keydown.enter.prevent="onTriggerEnter"
        @keydown.space.prevent="onTriggerEnter"
        @keydown.down.prevent="onArrowDown"
        @keydown.up.prevent="onArrowUp"
        @keydown.home.prevent="onHome"
        @keydown.end.prevent="onEnd"
        @keydown.escape.stop.prevent="closeDropdown"
      >
        <span
          class="bh-select__value"
          :class="{ 'bh-select__placeholder': !hasValue }"
        >
          {{ displayLabel }}
        </span>
        <LucideChevronDown
          class="bh-select__icon"
          :class="{ 'bh-select__icon--open': isOpen }"
          :size="16"
          aria-hidden="true"
        />
      </button>
    </div>
    <Teleport to="body">
      <Transition name="bh-select-dropdown">
        <ul
          v-if="isOpen"
          :id="listboxId"
          ref="floatingRef"
          :style="[floatingStyles, !isPositioned && { visibility: 'hidden' }]"
          class="bh-select__options"
          role="listbox"
          :aria-multiselectable="multiple"
        >
          <li
            v-for="(option, index) in options"
            :id="optionId(index)"
            :key="option.value"
            class="bh-select__option"
            :class="{
              'bh-select__option--selected': isSelected(option.value),
              'bh-select__option--active': index === activeIndex,
              'bh-select__option--disabled': option.disabled,
            }"
            role="option"
            :aria-selected="isSelected(option.value)"
            :aria-disabled="option.disabled || undefined"
            @click="onOptionSelect(option)"
            @mouseenter="activeIndex = index"
          >
            <span>{{ option.label }}</span>
            <LucideCheck v-if="isSelected(option.value)" :size="16" aria-hidden="true" />
          </li>
        </ul>
      </Transition>
    </Teleport>
    <p v-if="error" :id="errorId" role="alert" class="bh-select__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { LucideCheck, LucideChevronDown } from '#components';
import {
  useFloating,
  offset as offsetMiddleware,
  flip,
  shift,
  size,
  autoUpdate,
} from '@floating-ui/vue';

type PrimitiveValue = string | number;
type SelectValue = PrimitiveValue | null | undefined;

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  label?: string;
  id?: string;
  placeholder?: string;
  modelValue?: SelectValue | PrimitiveValue[];
  disabled?: boolean;
  required?: boolean;
  options?: Option[];
  multiple?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  placeholder: '',
  modelValue: null,
  disabled: false,
  required: false,
  options: () => [],
  multiple: false,
  error: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue | PrimitiveValue[]): void;
}>();

const selectRef = ref<HTMLElement | null>(null);
const floatingRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const activeIndex = ref(-1);

const { triggerId, listboxId, errorId, optionId } = useSelectIds(() => props.id);

const { floatingStyles, isPositioned } = useFloating(selectRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [
    offsetMiddleware(8),
    flip({ padding: 8 }),
    shift({ padding: 8 }),
    size({
      apply({ rects, elements, availableHeight }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${Math.min(availableHeight - 8, 240)}px`,
        });
      },
      padding: 8,
    }),
  ],
  strategy: 'fixed',
  transform: false,
  whileElementsMounted: autoUpdate,
});

function firstEnabledIndex(from: number, direction: 1 | -1): number {
  const len = props.options.length;
  if (len === 0) return -1;
  let i = from;
  for (let step = 0; step < len; step++) {
    if (i < 0) i = len - 1;
    if (i >= len) i = 0;
    if (!props.options[i]?.disabled) return i;
    i += direction;
  }
  return -1;
}

function syncActiveIndexToSelection() {
  const selectedIdx = props.options.findIndex((opt) =>
    normalizedValues.value.includes(opt.value),
  );
  activeIndex.value = selectedIdx >= 0
    ? selectedIdx
    : firstEnabledIndex(0, 1);
}

function onTriggerEnter() {
  if (props.disabled) return;
  if (!isOpen.value) {
    isOpen.value = true;
    syncActiveIndexToSelection();
    return;
  }
  if (activeIndex.value >= 0) {
    onOptionSelect(props.options[activeIndex.value]!);
  }
}

function onArrowDown() {
  if (props.disabled) return;
  if (!isOpen.value) {
    isOpen.value = true;
    syncActiveIndexToSelection();
    return;
  }
  activeIndex.value = firstEnabledIndex(activeIndex.value + 1, 1);
}

function onArrowUp() {
  if (props.disabled) return;
  if (!isOpen.value) {
    isOpen.value = true;
    syncActiveIndexToSelection();
    return;
  }
  activeIndex.value = firstEnabledIndex(activeIndex.value - 1, -1);
}

function onHome() {
  if (!isOpen.value) return;
  activeIndex.value = firstEnabledIndex(0, 1);
}

function onEnd() {
  if (!isOpen.value) return;
  activeIndex.value = firstEnabledIndex(props.options.length - 1, -1);
}

const normalizedValue = computed<PrimitiveValue | null>(() => {
  if (props.multiple) {
    return null;
  }
  return props.modelValue === null || props.modelValue === undefined
    ? null
    : (props.modelValue as PrimitiveValue);
});

const normalizedValues = computed<PrimitiveValue[]>(() => {
  if (!props.multiple) {
    return normalizedValue.value !== null ? [normalizedValue.value] : [];
  }

  if (Array.isArray(props.modelValue)) {
    return props.modelValue as PrimitiveValue[];
  }

  if (props.modelValue === null || props.modelValue === undefined) {
    return [];
  }

  return [props.modelValue as PrimitiveValue];
});

const selectedOptions = computed(() =>
  props.options.filter((option) =>
    normalizedValues.value.includes(option.value),
  ),
);

const hasValue = computed(() => selectedOptions.value.length > 0);

const { t } = useI18n();

const displayLabel = computed(() => {
  if (!hasValue.value) {
    return props.placeholder || t('common.select_placeholder');
  }

  if (!props.multiple) {
    return selectedOptions.value[0]!.label;
  }

  return t('common.select_n_selected', selectedOptions.value.length);
});

const closeDropdown = () => {
  isOpen.value = false;
};

const toggleDropdown = () => {
  if (props.disabled) {
    return;
  }
  isOpen.value = !isOpen.value;
};

const isSelected = (value: PrimitiveValue) =>
  normalizedValues.value.includes(value);

const onOptionSelect = (option: Option) => {
  if (option.disabled) {
    return;
  }

  if (props.multiple) {
    const current = [...normalizedValues.value];
    const index = current.findIndex((value) => value === option.value);

    if (index !== -1) {
      current.splice(index, 1);
    } else {
      current.push(option.value as PrimitiveValue);
    }

    emit('update:modelValue', current);
    return;
  }

  emit('update:modelValue', option.value as PrimitiveValue);
  closeDropdown();
};

onClickOutside(
  selectRef,
  () => {
    closeDropdown();
  },
  { ignore: [floatingRef] },
);
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-select {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-select__label {
  @apply text-sm text-theme-text-primary font-medium;
}

.bh-select__wrapper {
  @apply relative;
}

.bh-select__control {
  @apply w-full px-4 py-2 rounded-lg cursor-pointer;
  @apply bg-theme-bg-card;
  @apply border border-theme-border-secondary;
  @apply text-sm text-theme-text-primary font-medium;
  @apply flex items-center justify-between gap-2;
  @apply text-left;
  @apply transition-colors duration-150 ease-out;
  @apply focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:border-transparent;
}

.bh-select__control--disabled {
  @apply cursor-not-allowed text-theme-text-muted;
}

.bh-select__control--error {
  @apply border-theme-status-error;
}

.bh-select__control--open {
  @apply border-theme-accent-secondary;
}

.bh-select__icon {
  @apply text-theme-text-primary pointer-events-none;
  @apply transition-transform duration-150 ease-out;
}

.bh-select__icon--open {
  @apply rotate-180;
}

.bh-select__error {
  @apply text-theme-status-error text-xs mt-1;
}

.bh-select__value {
  @apply flex-1 truncate;
}

.bh-select__placeholder {
  @apply text-theme-text-muted;
}

.bh-select__options {
  @apply z-80;
  @apply bg-theme-bg-card border border-theme-border-secondary rounded-lg shadow-xl;
  @apply overflow-auto;
}

.bh-select__option {
  @apply flex items-center justify-between gap-2;
  @apply px-4 py-2 text-sm text-theme-text-primary cursor-pointer;
  @apply transition-colors duration-100;
}

.bh-select__option:hover,
.bh-select__option--active {
  @apply bg-theme-bg-elevated text-theme-accent-primary-strong;
}

.bh-select__option--selected,
.bh-select__option--selected:hover {
  @apply bg-theme-accent-secondary/15 text-theme-accent-secondary-strong font-semibold;
}

.bh-select__option--selected:hover {
  @apply bg-theme-accent-secondary/25;
}

.bh-select__option--disabled {
  @apply cursor-not-allowed text-theme-text-muted bg-transparent;
}

.bh-select-dropdown-enter-active,
.bh-select-dropdown-leave-active {
  @apply transition ease-out duration-150;
}

.bh-select-dropdown-enter-from,
.bh-select-dropdown-leave-to {
  @apply opacity-0 translate-y-2;
}

.bh-select-dropdown-enter-to,
.bh-select-dropdown-leave-from {
  @apply opacity-100 translate-y-0;
}
</style>
