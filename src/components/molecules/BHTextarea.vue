<template>
  <div class="bh-textarea">
    <label v-if="label" :for="inputId" class="bh-textarea__label">
      {{ label }}
    </label>
    <textarea
      :id="inputId"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required || undefined"
      :aria-required="required || undefined"
      :rows="rows"
      :maxlength="maxLength"
      :style="{ resize }"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      class="bh-textarea__input"
      :class="{ 'bh-textarea__input--error': !!error }"
    />
    <div class="bh-textarea__footer">
      <p v-if="error" :id="errorId" role="alert" class="bh-textarea__error">
        {{ error }}
      </p>
      <span v-if="maxLength" class="bh-textarea__counter" :class="counterClass">
        {{ currentLength }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  id?: string;
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'both';
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  modelValue: '',
  placeholder: '',
  disabled: false,
  required: false,
  error: '',
  rows: 4,
  maxLength: undefined,
  resize: 'vertical',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const model = useVModel(props, 'modelValue', emit, { passive: true });
const inputId = computed(() => props.id || useId());
const errorId = computed(() => `${inputId.value}-error`);
const currentLength = computed(() => props.modelValue?.length ?? 0);

const counterClass = computed(() => {
  if (!props.maxLength) return '';
  const ratio = currentLength.value / props.maxLength;
  if (ratio >= 1) return 'bh-textarea__counter--error';
  if (ratio >= 0.9) return 'bh-textarea__counter--warning';
  return '';
});
</script>

<style lang="css" scoped>
.bh-textarea {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-textarea__label {
  @apply text-sm text-theme-text-primary font-medium;
}

.bh-textarea__input {
  @apply px-4 py-2 rounded-lg;
  @apply bg-theme-bg-card;
  @apply border border-theme-border-secondary;
  @apply text-sm text-theme-text-primary font-medium placeholder:text-theme-text-muted;
  @apply transition-colors duration-150;
  @apply hover:border-theme-border-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:border-transparent;
  @apply disabled:opacity-60 disabled:cursor-not-allowed;
}

.bh-textarea__input--error {
  @apply border-theme-status-error;
}

.bh-textarea__footer {
  @apply flex items-center justify-between;
}

.bh-textarea__error {
  @apply text-theme-status-error text-xs;
}

.bh-textarea__counter {
  @apply text-theme-text-muted text-xs ml-auto;
}

.bh-textarea__counter--warning {
  @apply text-theme-status-warning;
}

.bh-textarea__counter--error {
  @apply text-theme-status-error;
}
</style>
