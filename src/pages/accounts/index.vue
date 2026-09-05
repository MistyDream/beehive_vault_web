<template>
  <div class="accounts-page">
    <header class="accounts-page__header">
      <div>
        <p>{{ t('accounts.overline') }}</p>
        <h1>{{ t('accounts.title') }}</h1>
        <span>{{ t('accounts.description') }}</span>
      </div>

      <BHButton :to="localePath('/accounts/new')" class="accounts-page__add">
        <LucidePlus :size="18" aria-hidden="true" />
        {{ t('accounts.add') }}
      </BHButton>
    </header>

    <div
      v-if="status === 'idle' || status === 'pending'"
      class="accounts-page__loading"
      role="status"
    >
      <span>{{ t('accounts.loading') }}</span>
      <div aria-hidden="true" class="accounts-page__loading-list" />
    </div>

    <section
      v-else-if="error"
      class="accounts-page__error"
      role="alert"
      :aria-labelledby="errorTitleId"
    >
      <h2 :id="errorTitleId">{{ t('accounts.load_error_title') }}</h2>
      <p>{{ t('accounts.load_error_description') }}</p>
      <BHButton @click="refresh">
        {{ t('common.retry') }}
      </BHButton>
    </section>

    <div v-else-if="accountsData" class="accounts-page__content">
      <BHSurface
        v-if="accountsData.accounts.items.length === 0"
        as="section"
        class="accounts-page__empty"
        :aria-labelledby="emptyTitleId"
      >
        <LucideLandmark :size="28" aria-hidden="true" />
        <h2 :id="emptyTitleId">{{ t('accounts.empty.title') }}</h2>
        <p>{{ t('accounts.empty.description') }}</p>
        <BHButton :to="localePath('/accounts/new')">
          {{ t('accounts.add') }}
        </BHButton>
      </BHSurface>

      <AccountList
        v-else
        :collection="accountsData.accounts"
        :institutions="accountsData.institutions"
        :account-to="accountTo"
      />

      <NuxtLink
        :to="localePath('/accounts/archived')"
        class="accounts-page__archived"
      >
        <LucideArchive :size="18" aria-hidden="true" />
        {{ t('accounts.archived') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccountId } from '~/types/account';

const { t } = useI18n();
const localePath = useLocalePath();
const errorTitleId = useId();
const emptyTitleId = useId();

const { activeHousehold } = useActiveHousehold();
const accountApi = useAccountApi();
const institutionApi = useInstitutionApi();

const household = activeHousehold.value;

if (!household) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Active household is required',
  });
}

const {
  data: accountsData,
  status,
  error,
  refresh,
} = await useLazyAsyncData(`accounts:${household.id}`, async () => {
  const [accounts, institutions] = await Promise.all([
    accountApi.list(household.id),
    institutionApi.list(),
  ]);

  return { accounts, institutions };
});

const accountTo = (accountId: AccountId) =>
  localePath(`/accounts/${accountId}`);
</script>

<style lang="css" scoped>
.accounts-page {
  @apply mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8;
}

.accounts-page__header {
  @apply mb-6 flex items-start justify-between gap-4;
}

.accounts-page__header p {
  @apply text-xs font-medium uppercase tracking-widest text-theme-accent-primary-strong;
}

.accounts-page__header h1 {
  @apply mt-1 font-poppins text-2xl font-semibold text-theme-text-primary md:text-3xl;
}

.accounts-page__header span {
  @apply mt-2 block max-w-2xl text-sm text-theme-text-secondary;
}

.accounts-page__add {
  @apply shrink-0;
}

.accounts-page__loading {
  @apply grid gap-6;
}

.accounts-page__loading > span {
  @apply sr-only;
}

.accounts-page__loading-list {
  @apply animate-pulse rounded-surface border border-theme-border-primary bg-theme-bg-card;
}

.accounts-page__loading-list {
  @apply h-72;
}

.accounts-page__error {
  @apply flex min-h-56 flex-col items-center justify-center rounded-surface;
  @apply border border-theme-border-primary bg-theme-bg-card px-6 py-10 text-center;
}

.accounts-page__error h2 {
  @apply font-poppins text-xl font-semibold text-theme-text-primary;
}

.accounts-page__error p {
  @apply mt-2 max-w-md text-sm text-theme-text-secondary;
}

.accounts-page__error button {
  @apply mt-5;
}

.accounts-page__content {
  @apply grid gap-6;
}

.accounts-page__empty {
  @apply flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center;
}

.accounts-page__empty > svg {
  @apply text-theme-accent-primary-strong;
}

.accounts-page__empty h2 {
  @apply mt-4 font-poppins text-xl font-semibold text-theme-text-primary;
}

.accounts-page__empty p {
  @apply mt-2 max-w-md text-sm text-theme-text-secondary;
}

.accounts-page__empty a {
  @apply mt-5;
}

.accounts-page__archived {
  @apply inline-flex min-h-11 w-fit items-center gap-2 rounded-md px-2;
  @apply text-sm font-medium text-theme-accent-primary-strong no-underline;
  @apply hover:text-theme-accent-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

@media (max-width: 479px) {
  .accounts-page__header {
    @apply items-center;
  }

  .accounts-page__header span {
    @apply hidden;
  }

  .accounts-page__add {
    @apply px-3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .accounts-page__loading-list {
    animation: none;
  }
}
</style>
