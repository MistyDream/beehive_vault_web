<template>
  <div class="portfolio-scoring__stub">
    {{ t('portfolios.detail.coming_soon.scoring') }}
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.portfolio-scoring__stub {
  @apply p-6 rounded-2xl;
  @apply bg-theme-bg-card border border-theme-border-primary;
  @apply text-sm text-theme-text-muted italic;
}
</style>
