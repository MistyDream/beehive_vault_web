<template>
  <div class="bh-card">
    <div class="bh-card--header">
      <div class="bh-card--title">
        <slot name="title" />
      </div>
      <div class="bh-card--header__actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="bh-card--content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="css" scoped>
.bh-card {
  @apply flex flex-col gap-6;
  @apply h-full w-full px-8 py-4;
  @apply bg-dark-gray-800 border border-border-dark rounded-lg shadow-lg;
}

.bh-card--header {
  @apply flex justify-between;
  @apply w-full;
}

.bh-card--title {
  @apply font-poppins text-xl font-semibold;
}

.bh-card--header__actions {
  @apply flex gap-2;
}

.bh-card--content {
  @apply flex;
  @apply w-full;
}
</style>
