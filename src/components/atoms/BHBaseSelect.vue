<template>
  <div class="bh-select">
    <label v-if="label" :for="id" class="bh-select__label">
      {{ label }}
    </label>
    <div class="bh-select__wrapper">
      <select
        :id="id"
        v-model="selectedValue"
        :disabled="disabled"
        class="bh-select__select"
      >
        <option v-if="placeholder" disabled value="">
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="toOptionValue(option.value)"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <LucideChevronDown class="bh-select__icon" :size="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LucideChevronDown } from 'lucide-vue-next';

type SelectValue = string | number | null | undefined;

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  label?: string;
  id?: string;
  placeholder?: string;
  modelValue?: SelectValue;
  disabled?: boolean;
  options?: Option[];
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  placeholder: '',
  modelValue: null,
  disabled: false,
  options: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue): void;
}>();

const toOptionValue = (value: string | number) => value.toString();

const selectedValue = computed({
  get: () =>
    props.modelValue === null || props.modelValue === undefined
      ? ''
      : props.modelValue.toString(),
  set: (value: string) => {
    const option = props.options.find(
      (opt) => toOptionValue(opt.value) === value,
    );
    emit('update:modelValue', option ? option.value : value);
  },
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

.bh-select__select {
  @apply appearance-none w-full px-4 py-2 rounded-lg;
  @apply bg-dark-gray-600;
  @apply border border-dark-gray-450;
  @apply text-sm text-warm-white-500 font-medium;
  @apply placeholder:text-dark-gray-400;
}

.bh-select__select:disabled {
  @apply cursor-not-allowed text-dark-gray-400;
}

.bh-select__icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2;
  @apply text-warm-white-500 pointer-events-none;
}
</style>
