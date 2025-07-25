<template>
  <header class="bh-header">
    <h1 class="bh-header__title">{{ title }}</h1>
    <p class="bh-header__subtitle">
      {{ subtitle }}
    </p>
  </header>
</template>

<script setup lang="ts">
import { useHeaderStore } from '~/stores/header';

const title = computed(() => {
  return useHeaderStore().title;
});

const subtitle = computed(() => {
  return useHeaderStore().subtitle;
});
</script>

<style lang="css" scoped>
.bh-header {
  @apply flex flex-col;
  @apply ml-72 p-4;
}

.bh-header__title {
  @apply font-poppins text-2xl font-bold;
}
</style>
