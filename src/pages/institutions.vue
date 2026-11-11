<template>
  <div class="institutions-page">
    <header class="institutions-page__header">
      <h1 ref="titleElement" tabindex="-1">{{ t('institutions.title') }}</h1>
      <p>{{ t('institutions.description') }}</p>
    </header>

    <div
      v-if="status === 'idle' || status === 'pending'"
      class="institutions-page__loading"
      role="status"
    >
      <span>{{ t('institutions.loading') }}</span>
      <div aria-hidden="true" class="institutions-page__skeleton" />
    </div>

    <BHSurface
      v-else-if="error"
      as="section"
      class="institutions-page__message"
      role="alert"
      :aria-labelledby="errorTitleId"
    >
      <h2 :id="errorTitleId">{{ t('institutions.load_error_title') }}</h2>
      <p>{{ t('institutions.load_error_description') }}</p>
      <BHButton @click="refresh">{{ t('common.retry') }}</BHButton>
    </BHSurface>

    <BHSurface v-else-if="institutions" as="section">
      <div
        v-if="institutions.length === 0"
        class="institutions-page__message"
        :aria-labelledby="emptyTitleId"
      >
        <h2 :id="emptyTitleId">{{ t('institutions.empty_title') }}</h2>
        <p>{{ t('institutions.empty_description') }}</p>
      </div>
      <ul
        v-else
        class="institutions-page__list"
        :aria-label="t('institutions.title')"
      >
        <li v-for="institution in institutions" :key="institution.id">
          <LucideLandmark :size="20" aria-hidden="true" />
          <span>{{ institution.name }}</span>
        </li>
      </ul>
    </BHSurface>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const institutionApi = useInstitutionApi();
const titleElement = ref<HTMLHeadingElement | null>(null);
const errorTitleId = useId();
const emptyTitleId = useId();
const {
  data: institutions,
  status,
  error,
  refresh,
} = await useLazyAsyncData('institution-catalog', () => institutionApi.list());

onMounted(() => titleElement.value?.focus());
</script>

<style lang="css" scoped>
.institutions-page {
  @apply mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8;
}

.institutions-page__header {
  @apply mb-6;
}

.institutions-page__header h1 {
  @apply font-poppins text-2xl font-semibold text-theme-text-primary md:text-3xl;
  @apply focus:outline-none;
}

.institutions-page__header p {
  @apply mt-2 max-w-2xl text-sm text-theme-text-secondary;
}

.institutions-page__loading > span {
  @apply sr-only;
}

.institutions-page__skeleton {
  @apply h-64 animate-pulse rounded-surface border border-theme-border-primary bg-theme-bg-card;
}

.institutions-page__message {
  @apply flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center;
}

.institutions-page__message h2 {
  @apply font-poppins text-xl font-semibold text-theme-text-primary;
}

.institutions-page__message p {
  @apply mt-2 max-w-md text-sm text-theme-text-secondary;
}

.institutions-page__message button {
  @apply mt-5;
}

.institutions-page__list {
  @apply divide-y divide-theme-border-secondary;
}

.institutions-page__list li {
  @apply flex min-h-14 items-center gap-3 px-4 py-3 sm:px-6;
}

.institutions-page__list svg {
  @apply shrink-0 text-theme-text-muted;
}

.institutions-page__list span {
  @apply min-w-0 break-words text-sm font-medium text-theme-text-primary;
}

@media (prefers-reduced-motion: reduce) {
  .institutions-page__skeleton {
    animation: none;
  }
}
</style>
