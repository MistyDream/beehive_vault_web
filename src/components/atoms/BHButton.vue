<template>
  <component
    :is="componentType"
    v-bind="componentAttrs"
    class="bh-button"
    :class="buttonClasses"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <LucideLoader2 v-if="loading" :size="16" class="animate-spin" />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink, LucideLoader2 } from '#components';

export interface Props {
  to?: string;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
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
  loading: false,
  variant: undefined,
  size: 'md',
  type: 'button',
  activeClass: 'link-active',
  exactActiveClass: 'exact-active-class',
});

const isDisabled = computed(() => props.disabled || props.loading);

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

  return { type: props.type, disabled: isDisabled.value };
});

const buttonClasses = computed(() => ({
  primary: props.variant === 'primary',
  secondary: props.variant === 'secondary',
  ghost: props.variant === 'ghost',
  danger: props.variant === 'danger',
  'size-sm': props.size === 'sm',
  'size-md': props.size === 'md',
  'size-lg': props.size === 'lg',
  'is-loading': props.loading,
}));

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
</script>

<style lang="css" scoped>
.bh-button {
  @apply flex gap-3 items-center;
  @apply rounded-md drop-shadow-md;
  @apply hover:bg-theme-bg-elevated;
  @apply text-theme-text-primary;
  @apply transition-colors duration-200;
}

.size-sm {
  @apply text-xs px-2 py-0.5;
}

.size-md {
  @apply text-sm px-2 py-1;
}

.size-lg {
  @apply text-base px-4 py-2;
}

.primary {
  @apply border bg-theme-accent-primary border-theme-accent-primary text-gray-900;
  @apply hover:brightness-110;
}

.secondary {
  @apply border bg-theme-accent-secondary border-theme-accent-secondary text-theme-text-primary;
  @apply hover:brightness-110;
}

.ghost {
  @apply px-0 py-0 border-none bg-transparent;
  @apply hover:bg-transparent;
}

.danger {
  @apply border bg-theme-status-error border-theme-status-error text-white;
  @apply hover:brightness-110;
}

.is-loading {
  @apply opacity-75 cursor-wait;
}
</style>
