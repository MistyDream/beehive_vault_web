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
  variant: 'primary',
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

const disabledLinkAttrs = computed(() => {
  if (isDisabled.value && (props.to || props.href))
    return {
      'aria-disabled': 'true',
      tabindex: -1,
    };

  return {};
});

const componentAttrs = computed(() => {
  if (props.to)
    return {
      to: props.to,
      activeClass: props.activeClass,
      exactActiveClass: props.exactActiveClass,
      ...disabledLinkAttrs.value,
    };
  if (props.href)
    return {
      href: props.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      ...disabledLinkAttrs.value,
    };

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
  'is-disabled': isDisabled.value,
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
  @apply inline-flex gap-2 items-center justify-center;
  @apply rounded-control;
  @apply font-medium whitespace-nowrap no-underline text-theme-text-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-theme-bg-primary;
  @apply disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent;
  transition:
    background-color 200ms ease-out,
    border-color 200ms ease-out,
    color 200ms ease-out,
    box-shadow 200ms ease-out,
    opacity 200ms ease-out;
}

.primary,
.danger {
  box-shadow: 0 1px 2px rgb(var(--color-text-primary) / 0.08);
}

.primary:not(.is-disabled):hover,
.danger:not(.is-disabled):hover {
  box-shadow: 0 2px 6px rgb(var(--color-text-primary) / 0.12);
}

.size-sm {
  @apply text-xs px-3 py-1.5 min-h-9;
}

.size-md {
  @apply text-sm px-4 py-2.5 min-h-11;
}

.size-lg {
  @apply text-base px-5 py-3 min-h-12;
}

.primary {
  @apply border bg-theme-accent-primary border-theme-accent-primary text-theme-text-on-accent-primary;
}

.primary:not(.is-disabled):hover {
  @apply bg-theme-accent-primary/90 border-theme-accent-primary-strong;
}

.secondary {
  @apply border bg-theme-bg-card border-theme-border-primary text-theme-text-primary;
}

.secondary:not(.is-disabled):hover {
  @apply bg-theme-bg-elevated border-theme-border-secondary;
}

.ghost {
  @apply border border-transparent bg-transparent;
}

.ghost:not(.is-disabled):hover {
  @apply bg-theme-bg-elevated;
}

.danger {
  @apply border bg-theme-status-error border-theme-status-error text-theme-text-on-danger;
}

.danger:not(.is-disabled):hover {
  @apply bg-theme-status-error/90;
}

.is-disabled {
  @apply opacity-60 cursor-not-allowed;
}

.is-loading {
  @apply opacity-75 cursor-wait;
}
</style>
