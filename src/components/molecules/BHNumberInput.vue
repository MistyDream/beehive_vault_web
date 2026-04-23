<template>
  <div class="bh-number-input">
    <label v-if="label" :for="inputId" class="bh-number-input__label">
      {{ label }}
    </label>
    <input
      :id="inputId"
      type="text"
      inputmode="decimal"
      :placeholder="placeholder"
      :value="displayValue"
      :disabled="disabled"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      class="bh-number-input__input"
      :class="{ 'bh-number-input__input--error': !!error }"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    >
    <p v-if="error" :id="errorId" role="alert" class="bh-number-input__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  id?: string;
  modelValue?: number | null;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  modelValue: null,
  placeholder: '',
  disabled: false,
  error: '',
  min: undefined,
  max: undefined,
  step: 1,
  precision: 2,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const { inputId, errorId } = useFieldIds(() => props.id);

const isFocused = ref(false);
const rawInput = ref('');

const { locale } = useI18n();
const { parseLocalizedNumber } = useLocaleFormatters();

const displayValue = computed(() => {
  if (isFocused.value) {
    return rawInput.value;
  }
  if (props.modelValue === null || props.modelValue === undefined) {
    return '';
  }
  return new Intl.NumberFormat(locale.value, {
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision,
  }).format(props.modelValue);
});

function onFocus() {
  isFocused.value = true;
  rawInput.value =
    props.modelValue !== null && props.modelValue !== undefined
      ? String(props.modelValue)
      : '';
}

function onBlur() {
  isFocused.value = false;
}

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  rawInput.value = value;

  if (value === '' || value === '-') {
    emit('update:modelValue', null);
    return;
  }

  const parsed = parseLocalizedNumber(value);
  if (isNaN(parsed)) {
    return;
  }

  let clamped = parsed;
  if (props.min !== undefined && clamped < props.min) clamped = props.min;
  if (props.max !== undefined && clamped > props.max) clamped = props.max;

  emit('update:modelValue', clamped);
}
</script>

<style lang="css" scoped>
.bh-number-input {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-number-input__label {
  @apply text-sm text-theme-text-primary font-medium;
}

.bh-number-input__input {
  @apply px-4 py-2 rounded-lg;
  @apply bg-theme-bg-card;
  @apply border border-theme-border-secondary;
  @apply text-sm text-theme-text-primary font-medium placeholder:text-theme-text-muted;
  @apply transition-colors duration-150;
  @apply hover:border-theme-border-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:border-transparent;
  @apply disabled:opacity-60 disabled:cursor-not-allowed;
}

.bh-number-input__input--error {
  @apply border-theme-status-error;
}

.bh-number-input__error {
  @apply text-theme-status-error text-xs mt-1;
}
</style>
