<template>
  <section class="portfolio-detail">
    <NuxtLink to="/" class="portfolio-detail__back">
      <LucideArrowLeft :size="16" aria-hidden="true" />
      {{ t('portfolios.title') }}
    </NuxtLink>

    <div v-if="showLoading" class="portfolio-detail__loading">
      <div class="portfolio-detail__loading-header">
        <div class="portfolio-detail__skel-title bh-skeleton" />
        <div class="portfolio-detail__skel-meta bh-skeleton" />
        <div class="portfolio-detail__skel-desc bh-skeleton" />
      </div>
      <div class="portfolio-detail__loading-kpis">
        <div v-for="n in 4" :key="n" class="portfolio-detail__skel-kpi bh-skeleton" />
      </div>
    </div>

    <div v-else-if="showError" class="portfolio-detail__error" role="alert">
      <h2 class="portfolio-detail__error-title">
        {{ t('portfolios.detail.error.title') }}
      </h2>
      <p class="portfolio-detail__error-description">
        {{ t('portfolios.detail.error.description') }}
      </p>
      <BHButton variant="secondary" size="md" @click="refresh()">
        {{ t('portfolios.detail.error.retry') }}
      </BHButton>
    </div>

    <template v-else-if="portfolio">
      <BHPortfolioHeaderBand :portfolio="portfolio" />

      <BHPortfolioKpiStrip
        :summary="summaryData ?? null"
        :performance="performanceData ?? null"
        :summary-pending="summaryPending"
        :performance-pending="performancePending"
        :currency="portfolio.currency"
      />

      <BHTabs
        v-model="activeTab"
        :tabs="tabs"
        :aria-label="t('portfolios.detail.tabs_label')"
      />

      <div class="portfolio-detail__tab-content" role="tabpanel">
        <div v-if="activeTab === 'resume'" class="portfolio-detail__stub">
          {{ t('portfolios.detail.coming_soon.resume') }}
        </div>
        <div v-else-if="activeTab === 'transactions'" class="portfolio-detail__stub">
          {{ t('portfolios.detail.coming_soon.transactions') }}
        </div>
        <div v-else-if="activeTab === 'performance'" class="portfolio-detail__stub">
          {{ t('portfolios.detail.coming_soon.performance') }}
        </div>
        <div v-else-if="activeTab === 'scoring'" class="portfolio-detail__stub portfolio-detail__stub--muted">
          {{ t('portfolios.detail.coming_soon.scoring') }}
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { LucideArrowLeft } from '#components';
import type { TabItem } from '~/components/molecules/BHTabs.vue';

const { t } = useI18n();
const route = useRoute();
const id = computed(() => Number(route.params.id));

const { detail, summary, performance } = usePortfolioApi();
const { data: portfolio, pending: detailPending, error: detailError, refresh } = detail(id);
const { data: summaryData, pending: summaryPending } = summary(id);
const { data: performanceData, pending: performancePending } = performance(id);

const activeTab = useRouteQuery<string>('tab', 'resume');

const tabs = computed<TabItem[]>(() => [
  { id: 'resume', label: t('portfolios.detail.tab_resume') },
  { id: 'transactions', label: t('portfolios.detail.tab_transactions') },
  { id: 'performance', label: t('portfolios.detail.tab_performance') },
  { id: 'scoring', label: t('portfolios.detail.tab_scoring'), muted: true },
]);

const showLoading = computed(() => detailPending.value && !portfolio.value);
const showError = computed(() => !!detailError.value && !portfolio.value);
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
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:rounded-md;
}

.portfolio-detail__loading {
  @apply flex flex-col gap-6;
}

.portfolio-detail__loading-header {
  @apply flex flex-col gap-3;
}

.portfolio-detail__skel-title {
  @apply h-8 w-64 rounded;
}

.portfolio-detail__skel-meta {
  @apply h-5 w-32 rounded-full;
}

.portfolio-detail__skel-desc {
  @apply h-4 w-1/2 rounded;
}

.portfolio-detail__loading-kpis {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3;
}

.portfolio-detail__skel-kpi {
  @apply h-24 rounded-lg;
}

.portfolio-detail__error {
  @apply flex flex-col items-start gap-3;
  @apply p-6 rounded-2xl;
  @apply bg-theme-bg-card border border-theme-status-error/30;
}

.portfolio-detail__error-title {
  @apply font-poppins text-lg font-semibold text-theme-status-error;
}

.portfolio-detail__error-description {
  @apply text-sm text-theme-text-secondary;
}

.portfolio-detail__tab-content {
  @apply mt-2;
}

.portfolio-detail__stub {
  @apply p-6 rounded-2xl;
  @apply bg-theme-bg-card border border-theme-border-primary;
  @apply text-sm text-theme-text-secondary;
}

.portfolio-detail__stub--muted {
  @apply text-theme-text-muted;
  @apply italic;
}
</style>
