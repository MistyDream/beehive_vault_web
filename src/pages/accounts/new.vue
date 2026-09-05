<template>
  <div class="account-creation-page">
    <div
      v-if="status === 'idle' || status === 'pending'"
      class="account-creation-page__loading"
      role="status"
    >
      {{ t('accounts.creation.loading') }}
    </div>

    <section
      v-else-if="error"
      class="account-creation-page__error"
      role="alert"
      :aria-labelledby="errorTitleId"
    >
      <h1 :id="errorTitleId">
        {{ t('accounts.creation.load_error_title') }}
      </h1>
      <p>{{ t('accounts.creation.load_error_description') }}</p>
      <BHButton @click="refresh">{{ t('common.retry') }}</BHButton>
    </section>

    <AccountForm
      v-else-if="institutions"
      :household="household"
      :institutions="institutions"
      :current-date="currentDate"
      @created="openAccount"
      @cancel="returnToAccounts"
    />
  </div>
</template>

<script setup lang="ts">
import type { Account } from '~/types/account';

const { t } = useI18n();
const localePath = useLocalePath();
const errorTitleId = useId();
const { activeHousehold } = useActiveHousehold();
const institutionApi = useInstitutionApi();

const household = activeHousehold.value;

if (!household) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Active household is required',
  });
}

const currentDate = getDateInTimeZone(household.timezone);
const {
  data: institutions,
  status,
  error,
  refresh,
} = await useLazyAsyncData(`account-creation:${household.id}`, () =>
  institutionApi.list(),
);

const returnToAccounts = () => navigateTo(localePath('/accounts'));
const openAccount = (account: Account) =>
  navigateTo(localePath(`/accounts/${account.id}`));
</script>

<style lang="css" scoped>
.account-creation-page {
  @apply flex min-h-full w-full items-start justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10;
}

.account-creation-page__loading,
.account-creation-page__error {
  @apply flex min-h-56 w-full max-w-2xl flex-col items-center justify-center;
  @apply rounded-surface border border-theme-border-primary bg-theme-bg-card;
  @apply px-6 py-10 text-center;
}

.account-creation-page__loading {
  @apply text-sm font-medium text-theme-text-secondary;
}

.account-creation-page__error h1 {
  @apply font-poppins text-xl font-semibold text-theme-text-primary;
}

.account-creation-page__error p {
  @apply mt-2 max-w-md text-sm text-theme-text-secondary;
}

.account-creation-page__error button {
  @apply mt-5;
}
</style>
