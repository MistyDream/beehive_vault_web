<template>
  <div class="bh-input">
    <label v-if="label" :for="id" class="bh-input__label">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      class="bh-input__input"
      :class="{ 'bh-input__input--error': !!error }"
      @input="handleInput"
    />
    <p v-if="error" class="bh-input__error">
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
  error?: string;
}

withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  type: 'text',
  placeholder: '',
  modelValue: '',
  disabled: false,
  error: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<style lang="css" scoped>
.bh-input {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-input__label {
  @apply text-sm text-warm-white-500 font-medium;
}

.bh-input__input {
  @apply px-4 py-2 rounded-lg;
  @apply bg-dark-gray-600;
  @apply border border-dark-gray-450;
  @apply text-sm text-warm-white-500 font-medium placeholder:text-dark-gray-400;
}

.bh-input__input--error {
  @apply border-red-500;
}

.bh-input__error {
  @apply text-red-400 text-xs mt-1;
}
</style>
