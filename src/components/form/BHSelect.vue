<template>
  <BHFormField
    :id="id"
    v-slot="{ inputId, describedBy, invalid }"
    :label="label"
    :help="help"
    :error="error"
    :required="required"
  >
    <div class="bh-select">
      <select
        v-bind="$attrs"
        :id="inputId"
        v-model="model"
        class="bh-select__control"
        :class="{ 'is-invalid': invalid }"
        :name="name || undefined"
        :autocomplete="autocomplete || undefined"
        :disabled="disabled"
        :required="required"
        :aria-required="required || undefined"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
      >
        <option v-if="placeholder" value="" :disabled="required">
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <LucideChevronDown
        class="bh-select__icon"
        :size="16"
        aria-hidden="true"
      />
    </div>
  </BHFormField>
</template>

<script setup lang="ts">
import type { SelectOption } from '~/types/form';

defineOptions({ inheritAttrs: false });

interface Props {
  label: string;
  options: readonly SelectOption[];
  id?: string;
  name?: string;
  autocomplete?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  id: undefined,
  name: '',
  autocomplete: '',
  placeholder: '',
  help: '',
  error: '',
  disabled: false,
  required: false,
});

const model = defineModel<string>({ default: '' });
</script>

<style lang="css" scoped>
.bh-select {
  @apply relative;
}

.bh-select__control {
  @apply min-h-11 w-full appearance-none rounded-control border border-theme-border-primary;
  @apply bg-theme-bg-primary py-2 pl-3 pr-10 text-sm text-theme-text-primary;
  @apply enabled:hover:border-theme-border-secondary;
  @apply focus-visible:border-transparent focus-visible:outline-none;
  @apply focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
  @apply disabled:cursor-not-allowed disabled:opacity-60;
  transition:
    border-color 150ms ease-out,
    box-shadow 150ms ease-out,
    opacity 150ms ease-out;
}

.bh-select__control.is-invalid {
  @apply border-theme-status-error;
}

.bh-select__icon {
  @apply pointer-events-none absolute right-3 top-1/2 -translate-y-1/2;
  @apply text-theme-text-secondary;
}
</style>
