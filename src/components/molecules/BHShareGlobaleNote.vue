<template>
  <div class="bh-share-globale-note">
    <div class="bh-share-globale-note--content">
      <span class="bh-share-globale-note--content-note" :class="noteClass">
        {{ note }}
      </span>
      <span class="bh-share-globale-note--content-label">
        {{ $t('global-score') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  note?: number;
}

const props = withDefaults(defineProps<Props>(), {
  note: 0,
});

const noteClass = computed(() => {
  return {
    'text-mint-green-500': props.note >= 80,
    'text-deep-blue-400': props.note < 80 && props.note >= 60,
    'text-golden-yellow-500': props.note < 60 && props.note >= 40,
    'text-filter-orange-500': props.note < 40 && props.note >= 20,
    'text-filter-red-500': props.note < 20,
  };
});
</script>

<style lang="css" scoped>
.bh-share-globale-note {
  @apply flex items-center justify-center;
  @apply h-36 w-36 rounded-full;
  @apply bg-gradient-to-br from-mint-green-600 from-30% via-golden-yellow-500 via-60% to-filter-red-600;
}

.bh-share-globale-note--content {
  @apply flex flex-col items-center justify-center;
  @apply h-32 w-32 rounded-full;
  @apply bg-dark-gray-500;
}

.bh-share-globale-note--content-note {
  @apply text-3xl font-semibold;
}

.bh-share-globale-note--content-label {
  @apply text-xs text-dark-gray-400 font-semibold;
}
</style>
