<template>
  <div class="bh-input">
    <label v-if="label" :for="inputId" class="bh-input__label">
      {{ label }}
    </label>
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required || undefined"
      :aria-required="required || undefined"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      class="bh-input__input"
      :class="{ 'bh-input__input--error': !!error }"
    />
    <p v-if="error" :id="errorId" role="alert" class="bh-input__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  type: 'text',
  placeholder: '',
  modelValue: '',
  disabled: false,
  required: false,
  error: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const model = useVModel(props, 'modelValue', emit, { passive: true });
const inputId = computed(() => props.id || useId());
const errorId = computed(() => `${inputId.value}-error`);
</script>

<style lang="css" scoped>
.bh-input {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-input__label {
  @apply text-sm text-theme-text-primary font-medium;
}

.bh-input__input {
  @apply px-4 py-2 rounded-lg;
  @apply bg-theme-bg-card;
  @apply border border-theme-border-secondary;
  @apply text-sm text-theme-text-primary font-medium placeholder:text-theme-text-muted;
  @apply transition-colors duration-150;
  @apply hover:border-theme-border-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:border-transparent;
  @apply disabled:opacity-60 disabled:cursor-not-allowed;
}

.bh-input__input--error {
  @apply border-theme-status-error;
}

.bh-input__error {
  @apply text-theme-status-error text-xs mt-1;
}
</style>
