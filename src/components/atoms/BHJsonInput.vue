<template>
  <div class="bh-json-input">
    <label v-if="label" :for="id" class="bh-json-input__label">
      {{ label }}
    </label>
    <textarea
      :id="id"
      :placeholder="placeholder"
      :value="localValue"
      :disabled="disabled"
      :rows="rows"
      class="bh-json-input__textarea"
      :class="{ 'bh-json-input__textarea--error': !!displayedError }"
      @input="handleInput"
      @blur="handleBlur"
    />
    <p v-if="displayedError" class="bh-json-input__error">
      {{ displayedError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };

interface Props {
  label?: string;
  id?: string;
  placeholder?: string;
  modelValue?: string | JsonLike | undefined;
  disabled?: boolean;
  error?: string;
  rows?: number;
  autoFormat?: boolean;
  indent?: number;
  invalidMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  placeholder: '',
  modelValue: '',
  disabled: false,
  error: '',
  rows: 10,
  autoFormat: true,
  indent: 2,
  invalidMessage: 'Invalid JSON format',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'json-valid', value: boolean): void;
  (e: 'json-parsed', value: JsonLike | undefined): void;
}>();

const localValue = ref<string>(normalizeToString(props.modelValue));
const jsonError = ref<string>('');
const lastValidJson = ref<JsonLike | undefined>();

function normalizeToString(value: Props['modelValue']): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return '';
  }

  try {
    return JSON.stringify(value, null, props.indent);
  } catch {
    return '';
  }
}

const displayedError = computed(() => props.error || jsonError.value);

const validateJson = (value: string) => {
  if (!value.trim()) {
    jsonError.value = '';
    lastValidJson.value = undefined;
    emit('json-valid', false);
    emit('json-parsed', undefined);
    return;
  }

  try {
    const parsed = JSON.parse(value) as JsonLike;
    jsonError.value = '';
    lastValidJson.value = parsed;
    emit('json-valid', true);
    emit('json-parsed', parsed);
  } catch {
    jsonError.value = props.invalidMessage;
    lastValidJson.value = undefined;
    emit('json-valid', false);
    emit('json-parsed', undefined);
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    const normalized = normalizeToString(newValue);
    if (normalized !== localValue.value) {
      localValue.value = normalized;
    }
    validateJson(normalized);
  },
  { immediate: true },
);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value;
  localValue.value = value;
  emit('update:modelValue', value);
  validateJson(value);
};

const handleBlur = () => {
  if (!props.autoFormat || !localValue.value.trim() || !lastValidJson.value) {
    return;
  }

  try {
    const formatted = JSON.stringify(lastValidJson.value, null, props.indent);
    if (formatted !== localValue.value) {
      localValue.value = formatted;
      emit('update:modelValue', formatted);
    }
  } catch {
    // Formatting failed, keep the current value.
  }
};
</script>

<style lang="css" scoped>
.bh-json-input {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-json-input__label {
  @apply text-sm text-warm-white-500 font-medium;
}

.bh-json-input__textarea {
  @apply px-4 py-2 rounded-lg;
  @apply bg-dark-gray-600;
  @apply border border-dark-gray-450;
  @apply text-sm text-warm-white-500 font-medium placeholder:text-dark-gray-400;
  @apply font-mono;
}

.bh-json-input__textarea--error {
  @apply border-red-500;
}

.bh-json-input__error {
  @apply text-red-400 text-xs mt-1;
}
</style>
