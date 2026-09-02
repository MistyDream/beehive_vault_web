<template>
  <button
    type="button"
    class="bh-filter-chip"
    :disabled="disabled"
    :aria-label="t('common.remove_value', { value: label })"
    @click="handleClick"
  >
    {{ label }}
    <LucideX aria-hidden="true" :size="16" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  disabled?: boolean;
}

interface Emits {
  remove: [];
}

const { t } = useI18n();

withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<Emits>();

function handleClick() {
  emit('remove');
}
</script>

<style lang="css" scoped>
.bh-filter-chip {
  @apply inline-flex items-center justify-center gap-2;
  @apply min-h-11 min-w-11;
  @apply rounded-control border border-theme-border-primary;
  @apply bg-theme-bg-elevated px-3 py-2;
  @apply text-sm font-medium text-theme-text-primary;
  @apply focus-visible:outline-none focus-visible:ring-2;
  @apply focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2;
  @apply focus-visible:ring-offset-theme-bg-primary;
  @apply disabled:cursor-not-allowed disabled:opacity-60;
  transition:
    background-color 200ms ease-out,
    border-color 200ms ease-out,
    color 200ms ease-out,
    box-shadow 200ms ease-out,
    opacity 200ms ease-out;
}

.bh-filter-chip:not(:disabled):hover {
  @apply border-theme-border-secondary bg-theme-bg-elevated-strong;
}
</style>
