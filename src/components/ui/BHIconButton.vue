<template>
  <BHButton
    class="bh-icon-button"
    :type="type"
    :variant="variant"
    :disabled="disabled"
    :aria-label="label"
    @click="handleClick"
  >
    <span aria-hidden="true">
      <slot />
    </span>
  </BHButton>
</template>

<script setup lang="ts">
export interface Props {
  label: string;
  disabled?: boolean;
  variant?: 'ghost' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
}

interface Emits {
  click: [event: MouseEvent];
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'ghost',
  type: 'button',
});

const emit = defineEmits<Emits>();

function handleClick(event: MouseEvent) {
  emit('click', event);
}
</script>

<style lang="css" scoped>
.bh-icon-button {
  @apply h-11 w-11 min-h-11 min-w-11 !p-0;
}
</style>
