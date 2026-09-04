<template>
  <div class="overview-page">
    <header class="overview-page__header">
      <p>{{ t('overview.today') }}</p>
      <h1>{{ t('overview.title') }}</h1>
    </header>

    <div
      v-if="status === 'idle' || status === 'pending'"
      class="overview-page__loading"
      role="status"
    >
      {{ t('overview.loading') }}
    </div>

    <section
      v-else-if="error"
      class="overview-page__error"
      role="alert"
      :aria-labelledby="errorTitleId"
    >
      <h2 :id="errorTitleId">
        {{ t('overview.load_error_title') }}
      </h2>
      <p>{{ t('overview.load_error_description') }}</p>
      <BHButton @click="refresh">
        {{ t('common.retry') }}
      </BHButton>
    </section>

    <div v-else-if="overviewData" class="overview-page__content">
      <NetWorthSummary :summary="overviewData.summary" />
      <AccountComposition
        :collection="overviewData.accounts"
        :currency="overviewData.summary.currency"
        :accounts-to="localePath('/accounts')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const errorTitleId = useId();
const localePath = useLocalePath();

const { activeHousehold } = useActiveHousehold();
const reportApi = useReportApi();
const accountApi = useAccountApi();

const household = activeHousehold.value;

if (!household) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Active household is required',
  });
}

const {
  data: overviewData,
  status,
  error,
  refresh,
} = await useLazyAsyncData(`overview:${household.id}`, async () => {
  const [summary, accounts] = await Promise.all([
    reportApi.getNetWorthSummary(household.id),
    accountApi.list(household.id),
  ]);

  return { summary, accounts };
});
</script>

<style lang="css" scoped>
.overview-page {
  @apply mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8;
}

.overview-page__header {
  @apply mb-6;
}

.overview-page__header p {
  @apply text-xs font-medium uppercase tracking-widest text-theme-accent-primary-strong;
}

.overview-page__header h1 {
  @apply mt-1 font-poppins text-2xl font-semibold text-theme-text-primary md:text-3xl;
}

.overview-page__loading,
.overview-page__error {
  @apply flex min-h-56 flex-col items-center justify-center rounded-surface;
  @apply border border-theme-border-primary bg-theme-bg-card px-6 py-10 text-center;
}

.overview-page__loading {
  @apply gap-3 text-sm font-medium text-theme-text-secondary;
}

.overview-page__loading::before {
  content: '';
  @apply h-8 w-8 rounded-full border-2;
  @apply border-theme-border-primary border-t-theme-accent-primary;
  animation: overview-loading 800ms linear infinite;
}

.overview-page__error h2 {
  @apply font-poppins text-xl font-semibold text-theme-text-primary;
}

.overview-page__error p {
  @apply mt-2 max-w-md text-sm text-theme-text-secondary;
}

.overview-page__error button {
  @apply mt-5;
}

.overview-page__content {
  @apply grid gap-6;
}

@keyframes overview-loading {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .overview-page__loading::before {
    animation: none;
  }
}
</style>
