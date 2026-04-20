<template>
  <div class="portfolio-resume" role="tabpanel">
    <div class="portfolio-resume__grid">
      <div class="portfolio-resume__main">
        <BHPortfolioPositionsCard
          :portfolio-id="id"
          @row-click="onPositionClick"
        />
        <BHPortfolioAllocationCard :portfolio-id="id" />
      </div>
      <div class="portfolio-resume__side">
        <div class="portfolio-resume__placeholder">
          {{ t('portfolios.detail.resume.side_placeholder') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Position } from '~/types/portfolio';

const { t } = useI18n();
const route = useRoute();
const id = computed(() => Number(route.params.id));

const toast = useToast();

function onPositionClick(_position: Position) {
  toast.info(t('toast.coming_soon'));
}
</script>

<style lang="css" scoped>
.portfolio-resume__grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6;
}

.portfolio-resume__main {
  @apply lg:col-span-2 flex flex-col gap-4 lg:gap-6;
}

.portfolio-resume__side {
  @apply flex flex-col gap-4 lg:gap-6;
}

.portfolio-resume__placeholder {
  @apply p-6 rounded-2xl;
  @apply bg-theme-bg-card border border-theme-border-primary;
  @apply text-sm text-theme-text-muted italic;
}
</style>
