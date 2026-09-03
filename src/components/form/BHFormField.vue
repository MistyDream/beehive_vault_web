<template>
  <div class="bh-form-field">
    <label :for="inputId" class="bh-form-field__label">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <slot :input-id="inputId" :described-by="describedBy" :invalid="!!error" />
    <p v-if="help" :id="helpId" class="bh-form-field__help">
      {{ help }}
    </p>
    <p v-if="error" :id="errorId" class="bh-form-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  id?: string;
  help?: string;
  error?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  help: '',
  error: '',
  required: false,
});

const { inputId, helpId, errorId } = useFieldIds(() => props.id);
const describedBy = computed(() => {
  const ids = [
    props.help ? helpId.value : undefined,
    props.error ? errorId.value : undefined,
  ].filter((id): id is string => !!id);

  return ids.length > 0 ? ids.join(' ') : undefined;
});
</script>

<style lang="css" scoped>
.bh-form-field {
  @apply grid w-full gap-2;
}

.bh-form-field__label {
  @apply text-sm font-medium text-theme-text-primary;
}

.bh-form-field__label span {
  @apply text-theme-status-error;
}

.bh-form-field__help,
.bh-form-field__error {
  @apply text-xs;
}

.bh-form-field__help {
  @apply text-theme-text-secondary;
}

.bh-form-field__error {
  @apply text-theme-status-error-strong;
}
</style>
