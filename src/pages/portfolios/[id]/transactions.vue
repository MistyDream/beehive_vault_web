<template>
  <div class="portfolio-transactions" role="tabpanel">
    <div class="portfolio-transactions__stub">
      {{ t('portfolios.detail.coming_soon.transactions') }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="css" scoped>
.portfolio-transactions__stub {
  @apply p-6 rounded-2xl;
  @apply bg-theme-bg-card border border-theme-border-primary;
  @apply text-sm text-theme-text-secondary;
}
</style>
