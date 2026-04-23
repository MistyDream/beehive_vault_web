<template>
  <div class="bh-card-base" :class="optionsClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'base' | 'darker';
  size?: 'base' | 'sm';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'base',
  size: 'base',
});

const optionsClass = computed(() => {
  return {
    'bh-card-base-darker': props.type === 'darker',
    'size-sm': props.size === 'sm',
  };
});
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-card-base {
  @apply flex items-center justify-between gap-4;
  @apply bg-theme-bg-card rounded-2xl;
  @apply p-6;

  &.size-sm {
    @apply rounded-lg;
    @apply p-4;
  }
}

.bh-card-base-darker {
  @apply bg-theme-bg-elevated;
}
</style>
