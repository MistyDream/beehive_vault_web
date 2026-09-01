<template>
  <div
    role="separator"
    class="bh-divider"
    :class="dividerClasses"
    :aria-orientation="orientation"
  />
</template>

<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
});

const dividerClasses = computed(() => ({
  'orientation-horizontal': props.orientation === 'horizontal',
  'orientation-vertical': props.orientation === 'vertical',
}));
</script>

<style lang="css" scoped>
.bh-divider {
  @apply shrink-0 border-theme-border-primary;
}

.orientation-horizontal {
  @apply w-full border-t;
}

.orientation-vertical {
  @apply h-full border-l;
}
</style>
