<template>
  <BHFormField
    :id="id"
    v-slot="{ inputId, describedBy, invalid }"
    :label="label"
    :help="help"
    :error="error"
    :required="required"
  >
    <input
      v-bind="$attrs"
      :id="inputId"
      v-model="model"
      class="bh-text-input"
      :class="{ 'is-invalid': invalid }"
      :type="type"
      :name="name || undefined"
      :autocomplete="autocomplete || undefined"
      :placeholder="placeholder || undefined"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-required="required || undefined"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
    />
  </BHFormField>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

interface Props {
  label: string;
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  autocomplete?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  id: undefined,
  name: '',
  type: 'text',
  autocomplete: '',
  placeholder: '',
  help: '',
  error: '',
  disabled: false,
  readonly: false,
  required: false,
});

const model = defineModel<string>({ default: '' });
</script>

<style lang="css" scoped>
.bh-text-input {
  @apply min-h-11 w-full rounded-control border border-theme-border-primary;
  @apply bg-theme-bg-primary px-3 py-2 text-sm text-theme-text-primary;
  @apply placeholder:text-theme-text-muted;
  @apply enabled:hover:border-theme-border-secondary;
  @apply focus-visible:border-transparent focus-visible:outline-none;
  @apply focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
  @apply disabled:cursor-not-allowed disabled:opacity-60;
  transition:
    border-color 150ms ease-out,
    box-shadow 150ms ease-out,
    opacity 150ms ease-out;
}

.bh-text-input.is-invalid {
  @apply border-theme-status-error;
}
</style>
