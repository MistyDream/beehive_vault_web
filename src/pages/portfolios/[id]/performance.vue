<template>
  <div
    id="tabpanel-performance"
    class="portfolio-performance"
    role="tabpanel"
    aria-labelledby="tab-performance"
    tabindex="0"
  >
    <div class="portfolio-performance__stub">
      {{ t('portfolios.detail.coming_soon.performance') }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="css" scoped>
.portfolio-performance__stub {
  @apply p-6 rounded-2xl;
  @apply bg-theme-bg-card border border-theme-border-primary;
  @apply text-sm text-theme-text-secondary;
}
</style>
