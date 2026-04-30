<template>
  <div class="bh-date-input">
    <label v-if="label" :for="inputId" class="bh-date-input__label">
      {{ label }}
    </label>
    <input
      :id="inputId"
      v-model="model"
      type="date"
      :min="min"
      :max="max"
      :disabled="disabled"
      :aria-label="label ? undefined : ariaLabel"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      class="bh-date-input__input"
      :class="{ 'bh-date-input__input--error': !!error }"
    >
    <p v-if="error" :id="errorId" role="alert" class="bh-date-input__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  ariaLabel?: string;
  id?: string;
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  min?: string;
  max?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  ariaLabel: '',
  id: '',
  modelValue: '',
  placeholder: '',
  disabled: false,
  error: '',
  min: undefined,
  max: undefined,
});

if (import.meta.dev && !props.label && !props.ariaLabel) {
  console.warn('[BHDateInput] provide either `label` or `ariaLabel` for accessibility.');
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const model = useVModel(props, 'modelValue', emit, { passive: true });
const { inputId, errorId } = useFieldIds(() => props.id);
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-date-input {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-date-input__label {
  @apply text-sm text-theme-text-primary font-medium;
}

.bh-date-input__input {
  @apply px-4 py-2 rounded-lg cursor-pointer;
  @apply bg-theme-bg-card;
  @apply border border-theme-border-secondary;
  @apply text-sm text-theme-text-primary font-medium;
  @apply transition-colors duration-150;
  @apply focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:border-transparent;
  @apply disabled:opacity-60 disabled:cursor-not-allowed;
}

.bh-date-input__input::-webkit-calendar-picker-indicator {
  @apply cursor-pointer;
}

:root.dark .bh-date-input__input::-webkit-calendar-picker-indicator {
  filter: invert(0.85);
}

.bh-date-input__input--error {
  @apply border-theme-status-error;
}

.bh-date-input__error {
  @apply text-theme-status-error text-xs mt-1;
}
</style>
