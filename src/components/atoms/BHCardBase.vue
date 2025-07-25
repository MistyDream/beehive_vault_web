<template>
  <div class="bh-card-base">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="css" scoped>
.bh-card-base {
  @apply flex items-center justify-between gap-4;
  @apply bg-dark-gray-500 rounded-2xl;
  @apply p-6;
}
</style>
