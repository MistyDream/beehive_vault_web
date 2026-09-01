<template>
  <component :is="as" class="bh-surface" :class="surfaceClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  as?: 'div' | 'section' | 'article' | 'aside';
  tone?: 'card' | 'elevated';
  shadow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  tone: 'card',
  shadow: false,
});

const surfaceClasses = computed(() => ({
  'tone-card': props.tone === 'card',
  'tone-elevated': props.tone === 'elevated',
  'has-shadow': props.shadow,
}));
</script>

<style lang="css" scoped>
.bh-surface {
  @apply bg-theme-bg-card;
  @apply border border-theme-border-primary rounded-surface;
}

.tone-elevated {
  @apply bg-theme-bg-elevated;
}

.has-shadow {
  @apply shadow-surface;
}
</style>
