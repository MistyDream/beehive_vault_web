<template>
  <section class="portfolio-detail">
    <NuxtLink to="/" class="portfolio-detail__back">
      <LucideArrowLeft :size="16" />
      {{ $t('portfolios.title') }}
    </NuxtLink>

    <div v-if="pending" class="portfolio-detail__placeholder">
      <div class="portfolio-detail__skeleton" />
    </div>

    <div v-else-if="error || !data" class="portfolio-detail__placeholder">
      <p class="portfolio-detail__error">
        {{ $t('portfolios.error.title') }}
      </p>
    </div>

    <div v-else class="portfolio-detail__body">
      <h1 class="portfolio-detail__title">{{ data.name }}</h1>
      <p class="portfolio-detail__description">
        {{ $t('portfolios.coming_soon') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { LucideArrowLeft } from '#components';

const route = useRoute();
const id = computed(() => Number(route.params.id));

const { detail } = usePortfolioApi();
const { data, pending, error } = detail(id);
</script>

<style lang="css" scoped>
.portfolio-detail {
  @apply flex flex-col gap-6;
  @apply p-4 md:p-6 lg:p-8;
}

.portfolio-detail__back {
  @apply inline-flex items-center gap-2 self-start;
  @apply text-sm text-theme-text-secondary;
  @apply hover:text-theme-text-primary;
  @apply transition-colors;
  @apply no-underline;
}

.portfolio-detail__placeholder {
  @apply flex flex-col gap-4;
}

.portfolio-detail__skeleton {
  @apply w-64 h-10 rounded;
  @apply bg-theme-bg-elevated animate-pulse;
}

.portfolio-detail__error {
  @apply text-theme-status-error;
}

.portfolio-detail__body {
  @apply flex flex-col gap-3;
}

.portfolio-detail__title {
  @apply font-poppins text-2xl md:text-3xl lg:text-4xl font-semibold text-theme-text-primary;
}

.portfolio-detail__description {
  @apply text-theme-text-muted;
}
</style>
