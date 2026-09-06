<template>
  <div class="account-detail-page">
    <div
      v-if="(status === 'idle' || status === 'pending') && !accountData"
      class="account-detail-page__loading"
      role="status"
    >
      <span>{{ t('accounts.detail.loading') }}</span>
      <div aria-hidden="true" class="account-detail-page__loading-card" />
      <div aria-hidden="true" class="account-detail-page__loading-grid" />
    </div>

    <section
      v-else-if="error"
      class="account-detail-page__error"
      role="alert"
      :aria-labelledby="errorTitleId"
    >
      <h1 :id="errorTitleId">{{ t('accounts.detail.load_error_title') }}</h1>
      <p>{{ t('accounts.detail.load_error_description') }}</p>
      <BHButton @click="refresh">{{ t('common.retry') }}</BHButton>
    </section>

    <AccountDetail
      v-else-if="accountData"
      :account="accountData.account"
      :institution-name="accountData.institutionName"
      :balances="accountData.balances"
      :operations="accountData.operations"
      :accounts-to="accountsTo"
      :transactions-to="transactionsTo"
      @update-balance="openBalanceModal"
    />

    <BHModal
      v-if="accountData"
      v-model="balanceModalOpen"
      :title="t('accounts.balance.title')"
    >
      <AccountBalanceForm
        :account="accountData.account"
        :current-date="currentDate"
        @saved="handleBalanceSaved"
        @cancel="closeBalanceModal"
      />
    </BHModal>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const errorTitleId = useId();
const { activeHousehold } = useActiveHousehold();
const accountApi = useAccountApi();
const institutionApi = useInstitutionApi();
const transactionApi = useTransactionApi();
const toast = useToast();
const balanceModalOpen = ref(false);

const household = activeHousehold.value;

if (!household) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Active household is required',
  });
}

const accountId = String(route.params.accountId);
const currentDate = getDateInTimeZone(household.timezone);
const accountsTo = localePath('/accounts');
const transactionsTo = localePath({
  path: '/transactions',
  query: { accountId },
});

const {
  data: accountData,
  status,
  error,
  refresh,
} = await useLazyAsyncData(
  `account-detail:${household.id}:${accountId}`,
  async () => {
    const [account, balances, operationPage, institutions] = await Promise.all([
      accountApi.get(household.id, accountId),
      accountApi.listBalances(household.id, accountId),
      transactionApi.list(household.id, {
        accountId,
        page: 1,
        limit: 5,
      }),
      institutionApi.list(),
    ]);

    return {
      account,
      balances,
      operations: operationPage.items,
      institutionName: account.institutionId
        ? institutions.find(({ id }) => id === account.institutionId)?.name
        : undefined,
    };
  },
);

function openBalanceModal(): void {
  balanceModalOpen.value = true;
}

function closeBalanceModal(): void {
  balanceModalOpen.value = false;
}

async function handleBalanceSaved(): Promise<void> {
  closeBalanceModal();
  await nextTick();
  toast.success(t('accounts.balance.success'));
  await refresh();
}
</script>

<style lang="css" scoped>
.account-detail-page {
  @apply min-h-full w-full;
}

.account-detail-page__loading {
  @apply mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8;
}

.account-detail-page__loading > span {
  @apply sr-only;
}

.account-detail-page__loading-card,
.account-detail-page__loading-grid {
  @apply animate-pulse rounded-surface border border-theme-border-primary bg-theme-bg-card;
}

.account-detail-page__loading-card {
  @apply mt-14 h-48;
}

.account-detail-page__loading-grid {
  @apply h-72;
}

.account-detail-page__error {
  @apply mx-auto mt-6 flex min-h-56 w-[calc(100%-2rem)] max-w-2xl flex-col;
  @apply items-center justify-center rounded-surface border border-theme-border-primary;
  @apply bg-theme-bg-card px-6 py-10 text-center sm:mt-10;
}

.account-detail-page__error h1 {
  @apply font-poppins text-xl font-semibold text-theme-text-primary;
}

.account-detail-page__error p {
  @apply mt-2 max-w-md text-sm text-theme-text-secondary;
}

.account-detail-page__error button {
  @apply mt-5;
}

@media (prefers-reduced-motion: reduce) {
  .account-detail-page__loading-card,
  .account-detail-page__loading-grid {
    animation: none;
  }
}
</style>
