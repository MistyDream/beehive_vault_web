<template>
  <section class="portfolio-detail">
    <NuxtLink :to="localePath('/')" class="portfolio-detail__back">
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
      <BHPortfolioHeaderBand
        :portfolio="portfolio"
        @edit="isEditOpen = true"
        @delete="isDeleteOpen = true"
      />

      <BHPortfolioKpiStrip :portfolio-id="id" :currency="portfolio.currency" />

      <BHTabs :tabs="tabs" :aria-label="t('portfolios.detail.tabs_label')" />

      <NuxtPage />

      <BHModal
        v-model="isEditOpen"
        :title="t('portfolios.form.modal_title_edit')"
        size="md"
      >
        <BHPortfolioForm
          :initial-value="portfolio"
          :loading="updating"
          @submit="onEdit"
          @cancel="isEditOpen = false"
        />
      </BHModal>

      <BHPortfolioDeleteDialog
        v-model="isDeleteOpen"
        :portfolio="portfolio"
        :loading="deleting"
        @confirm="onDelete"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core';
import { LucideArrowLeft } from '#components';
import type { TabItem } from '~/components/molecules/BHTabs.vue';
import { ApiError } from '~/types/api';
import type { CreatePortfolioPayload } from '~/types/portfolio';

// Delay between a success toast and a route change — lets assistive tech
// finish announcing the live-region message before the dialog unmounts.
const TOAST_ANNOUNCE_DELAY_MS = 400;

type BusyKind = 'edit' | 'delete';

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const id = computed(() => Number(route.params.id));

const portfolioApi = usePortfolioApi();
const toast = useToast();
const isMounted = useMounted();

const { portfolio, detailPending, detailError, refresh } = usePortfolioDetail(id);

const isEditOpen = ref(false);
const isDeleteOpen = ref(false);
const busy = ref<BusyKind | null>(null);
const updating = computed(() => busy.value === 'edit');
const deleting = computed(() => busy.value === 'delete');

async function runAction(
  kind: BusyKind,
  op: () => Promise<void>,
  successKey: string,
  failKey: string,
  afterSuccess?: () => Promise<void>,
) {
  busy.value = kind;
  try {
    await op();
    toast.success(t(successKey));
    await afterSuccess?.();
  } catch (err) {
    toast.error(err instanceof ApiError && err.detail ? err.detail : t(failKey));
  } finally {
    busy.value = null;
  }
}

async function onEdit(payload: CreatePortfolioPayload) {
  await runAction(
    'edit',
    async () => {
      await portfolioApi.update(id.value, payload);
      await refresh();
      isEditOpen.value = false;
    },
    'portfolios.toast.updated',
    'portfolios.toast.update_failed',
  );
}

async function onDelete() {
  await runAction(
    'delete',
    async () => {
      await portfolioApi.remove(id.value);
      isDeleteOpen.value = false;
    },
    'portfolios.toast.deleted',
    'portfolios.toast.delete_failed',
    async () => {
      await Promise.all([
        refreshNuxtData('portfolios:list'),
        promiseTimeout(TOAST_ANNOUNCE_DELAY_MS),
      ]);
      if (!isMounted.value) return;
      await navigateTo(localePath('/'));
    },
  );
}

const tabs = computed<TabItem[]>(() => [
  {
    id: 'resume',
    label: t('portfolios.detail.tab_resume'),
    to: localePath(`/portfolios/${id.value}/resume`),
  },
  {
    id: 'transactions',
    label: t('portfolios.detail.tab_transactions'),
    to: localePath(`/portfolios/${id.value}/transactions`),
  },
  {
    id: 'performance',
    label: t('portfolios.detail.tab_performance'),
    to: localePath(`/portfolios/${id.value}/performance`),
  },
  {
    id: 'scoring',
    label: t('portfolios.detail.tab_scoring'),
    disabled: true,
    tooltip: t('portfolios.detail.tab_scoring_tooltip'),
  },
]);

const showLoading = computed(() => detailPending.value && !portfolio.value);
const showError = computed(() => !!detailError.value && !portfolio.value);

const activeTabLabel = computed(() => {
  const active = tabs.value.find((tab) => tab.to && route.path.startsWith(tab.to));
  return active?.label ?? '';
});

useHead({
  title: () => {
    const name = portfolio.value?.name ?? t('portfolios.detail.loading_title');
    const tab = activeTabLabel.value;
    return tab ? `${name} — ${tab}` : name;
  },
});
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
</style>
