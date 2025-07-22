<template>
  <component
    :is="componentType"
    v-bind="componentAttrs"
    class="bh-button"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';

export interface Props {
  to?: string;
  href?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  activeClass?: string;
  exactActiveClass?: string;
}

interface Emits {
  click: [event: MouseEvent];
}

const props = withDefaults(defineProps<Props>(), {
  to: '',
  href: '',
  disabled: false,
  variant: undefined,
  type: 'button',
  activeClass: 'link-active',
  exactActiveClass: 'exact-active-class',
});

const emit = defineEmits<Emits>();

const componentType = computed(() => {
  if (props.to) return NuxtLink;
  if (props.href) return 'a';

  return 'button';
});

const componentAttrs = computed(() => {
  if (props.to)
    return {
      to: props.to,
      activeClass: props.activeClass,
      exactActiveClass: props.exactActiveClass,
    };
  if (props.href)
    return { href: props.href, target: '_blank', rel: 'noopener noreferrer' };

  return { type: props.type, disabled: props.disabled };
});

const buttonClasses = computed(() => ({
  primary: props.variant === 'primary',
  secondary: props.variant === 'secondary',
}));

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
</script>

<style lang="css" scoped>
.bh-button {
  @apply flex gap-3 items-center;
  @apply px-2 py-1;
  @apply rounded drop-shadow-md;
  @apply hover:bg-border-dark;
  @apply transition-colors duration-200;
}

.primary {
  @apply border bg-golden-yellow-500 border-golden-yellow-700 text-dark-gray-500;
  @apply hover:bg-golden-yellow-400 hover:border-golden-yellow-600;
}

.secondary {
  @apply border bg-deep-blue-500 border-deep-blue-700 text-warm-white-500;
  @apply hover:bg-deep-blue-400 hover:border-deep-blue-600;
}
</style>
