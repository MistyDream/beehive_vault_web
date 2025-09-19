<template>
  <div class="bh-select">
    <label v-if="label" :for="id" class="bh-select__label">
      {{ label }}
    </label>
    <div ref="selectRef" class="bh-select__wrapper">
      <button
        :id="id"
        type="button"
        class="bh-select__control"
        :class="{
          'bh-select__control--disabled': disabled,
          'bh-select__control--open': isOpen,
          'bh-select__control--error': !!error,
        }"
        :disabled="disabled"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
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
        />
      </button>
      <Transition name="bh-select-dropdown">
        <ul
          v-if="isOpen"
          class="bh-select__options"
          role="listbox"
          :aria-multiselectable="multiple"
        >
          <li
            v-for="option in options"
            :key="option.value"
            class="bh-select__option"
            :class="{
              'bh-select__option--selected': isSelected(option.value),
              'bh-select__option--disabled': option.disabled,
            }"
            role="option"
            :aria-selected="isSelected(option.value)"
            @click="onOptionSelect(option)"
          >
            <span>{{ option.label }}</span>
            <LucideCheck v-if="isSelected(option.value)" :size="16" />
          </li>
        </ul>
      </Transition>
    </div>
    <p v-if="error" class="bh-select__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { LucideCheck, LucideChevronDown } from 'lucide-vue-next';

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
  options: () => [],
  multiple: false,
  error: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue | PrimitiveValue[]): void;
}>();

const selectRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

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

const displayLabel = computed(() => {
  if (!hasValue.value) {
    return props.placeholder || 'Select';
  }

  if (!props.multiple) {
    return selectedOptions.value[0].label;
  }

  const count = selectedOptions.value.length;
  return `${count} selected`;
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

const handleClickOutside = (event: MouseEvent) => {
  if (!selectRef.value) {
    return;
  }

  if (!selectRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="css" scoped>
.bh-select {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-select__label {
  @apply text-sm text-warm-white-500 font-medium;
}

.bh-select__wrapper {
  @apply relative;
}

.bh-select__control {
  @apply w-full px-4 py-2 rounded-lg;
  @apply bg-dark-gray-600;
  @apply border border-dark-gray-450;
  @apply text-sm text-warm-white-500 font-medium;
  @apply flex items-center justify-between gap-2;
  @apply text-left;
  @apply transition-colors duration-150 ease-out;
}

.bh-select__control--disabled {
  @apply cursor-not-allowed text-dark-gray-400;
}

.bh-select__control--error {
  @apply border-red-500;
}

.bh-select__control--open {
  @apply border-deep-blue-500;
}

.bh-select__icon {
  @apply text-warm-white-500 pointer-events-none;
  @apply transition-transform duration-150 ease-out;
}

.bh-select__icon--open {
  @apply rotate-180;
}

.bh-select__error {
  @apply text-red-400 text-xs mt-1;
}

.bh-select__value {
  @apply flex-1 truncate;
}

.bh-select__placeholder {
  @apply text-dark-gray-400;
}

.bh-select__options {
  @apply absolute left-0 right-0 mt-2 z-10;
  @apply bg-dark-gray-600 border border-dark-gray-450 rounded-lg shadow-lg;
  @apply max-h-60 overflow-auto;
}

.bh-select__option {
  @apply flex items-center justify-between gap-2;
  @apply px-4 py-2 text-sm text-warm-white-500 cursor-pointer;
}

.bh-select__option:hover {
  @apply bg-dark-gray-500;
}

.bh-select__option--selected {
  @apply bg-deep-blue-700 text-warm-white-500;
}

.bh-select__option--disabled {
  @apply cursor-not-allowed text-dark-gray-400 bg-transparent;
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
