<template>
  <section class="portfolios-page">
    <header class="portfolios-page__header">
      <div class="portfolios-page__header-left">
        <h1 class="portfolios-page__title">{{ t('portfolios.title') }}</h1>
        <p v-if="portfolios && portfolios.length" class="portfolios-page__subtitle">
          {{ t('portfolios.subtitle_count', portfolios.length) }}
        </p>
      </div>
      <BHButton
        variant="primary"
        size="md"
        class="portfolios-page__cta"
        @click="openCreateModal"
      >
        <LucidePlus :size="16" aria-hidden="true" />
        {{ t('portfolios.create_cta') }}
      </BHButton>
    </header>

    <div
      v-if="showLoading"
      class="portfolios-page__grid"
      role="status"
      aria-live="polite"
      aria-busy="true"
      :aria-label="t('portfolios.loading')"
    >
      <BHPortfolioCard v-for="n in 4" :key="n" skeleton />
    </div>

    <div v-else-if="showError" class="portfolios-page__error" role="alert">
      <h2 class="portfolios-page__error-title">
        {{ t('portfolios.error.title') }}
      </h2>
      <p class="portfolios-page__error-description">
        {{ t('portfolios.error.description') }}
      </p>
      <BHButton variant="secondary" size="md" @click="refresh()">
        {{ t('portfolios.error.retry') }}
      </BHButton>
    </div>

    <div
      v-else-if="showEmpty"
      class="portfolios-page__empty"
    >
      <div class="portfolios-page__empty-pattern bh-hex-pattern" aria-hidden="true" />
      <div class="portfolios-page__empty-inner">
        <LucideHexagon :size="64" class="portfolios-page__empty-icon" aria-hidden="true" />
        <h2 class="portfolios-page__empty-title">
          {{ t('portfolios.empty.title') }}
        </h2>
        <p class="portfolios-page__empty-description">
          {{ t('portfolios.empty.description') }}
        </p>
        <BHButton variant="primary" size="md" @click="openCreateModal">
          <LucidePlus :size="16" aria-hidden="true" />
          {{ t('portfolios.create_cta') }}
        </BHButton>
      </div>
    </div>

    <div v-else class="portfolios-page__grid">
      <BHPortfolioCard
        v-for="portfolio in portfolios"
        :key="portfolio.id"
        :portfolio="portfolio"
      />
    </div>

    <BHModal
      v-model="isModalOpen"
      :title="t('portfolios.form.modal_title')"
      size="md"
    >
      <BHPortfolioForm
        :loading="creating"
        @submit="onCreate"
        @cancel="isModalOpen = false"
      />
    </BHModal>
  </section>
</template>

<script setup lang="ts">
import { LucidePlus, LucideHexagon } from '#components';
import { ApiError } from '~/types/api';
import type { CreatePortfolioPayload } from '~/types/portfolio';

const { t } = useI18n();
const portfolioApi = usePortfolioApi();
const { data: portfolios, pending, error, refresh } = portfolioApi.list();

const route = useRoute();
const forcedState = computed(() => {
  if (!import.meta.dev) return null;
  const state = route.query.state;
  return typeof state === 'string' ? state : null;
});

const showLoading = computed(() =>
  forcedState.value ? forcedState.value === 'loading' : pending.value,
);

const showError = computed(() =>
  forcedState.value ? forcedState.value === 'error' : !!error.value,
);

const showEmpty = computed(() => {
  if (forcedState.value) return forcedState.value === 'empty';
  return !portfolios.value || portfolios.value.length === 0;
});

const isModalOpen = ref(false);
const creating = ref(false);

function openCreateModal() {
  isModalOpen.value = true;
}

async function onCreate(payload: CreatePortfolioPayload) {
  creating.value = true;
  try {
    const created = await portfolioApi.create(payload);
    portfolios.value = [...(portfolios.value ?? []), created];
    isModalOpen.value = false;
  } catch (err) {
    if (err instanceof ApiError) {
      console.error('Portfolio creation failed:', err.status, err.title, err.detail);
    } else {
      console.error(err);
    }
  } finally {
    creating.value = false;
  }
}
</script>

<style lang="css" scoped>
.portfolios-page {
  @apply flex flex-col gap-6;
  @apply p-4 md:p-6 lg:p-8;
}

.portfolios-page__header {
  @apply flex flex-col gap-4;
  @apply md:flex-row md:items-center md:justify-between;
}

.portfolios-page__header-left {
  @apply flex flex-col gap-1;
}

.portfolios-page__title {
  @apply font-poppins text-2xl md:text-3xl lg:text-4xl font-semibold text-theme-text-primary;
}

.portfolios-page__subtitle {
  @apply text-sm text-theme-text-secondary;
}

.portfolios-page__cta {
  @apply w-full md:w-auto justify-center;
}

.portfolios-page__grid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3;
  @apply gap-4 md:gap-6;
}

.portfolios-page__error {
  @apply flex flex-col items-start gap-3;
  @apply p-6 rounded-2xl;
  @apply bg-theme-bg-card border border-theme-status-error/30;
}

.portfolios-page__error-title {
  @apply font-poppins text-lg font-semibold text-theme-status-error;
}

.portfolios-page__error-description {
  @apply text-sm text-theme-text-secondary;
}

.portfolios-page__empty {
  @apply relative overflow-hidden;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
}

.portfolios-page__empty-pattern {
  @apply pointer-events-none absolute inset-0;
  @apply opacity-[0.10];
}

.portfolios-page__empty-inner {
  @apply relative flex flex-col items-center gap-4;
  @apply py-12 px-6 text-center;
}

.portfolios-page__empty-icon {
  @apply text-theme-accent-primary/40;
}

.portfolios-page__empty-title {
  @apply font-poppins text-lg md:text-xl font-semibold text-theme-text-primary;
}

.portfolios-page__empty-description {
  @apply text-sm text-theme-text-secondary max-w-md;
}
</style>
