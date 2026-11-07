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
      :restoring="isRestoring"
      :restore-error="restoreError"
      :restored="restored"
      @edit="openEditModal"
      @update-balance="openBalanceModal"
      @archive="openArchiveModal"
      @restore="restoreAccount"
    />

    <BHModal
      v-if="accountData && !accountData.account.archivedAt"
      v-model="editModalOpen"
      :title="t('accounts.edit.title')"
    >
      <AccountEditForm
        v-if="editModalOpen"
        :account="accountData.account"
        :institutions="accountData.institutions"
        @saved="handleAccountSaved"
        @cancel="closeEditModal"
      />
    </BHModal>

    <BHModal
      v-if="accountData && !accountData.account.archivedAt"
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

    <BHModal
      v-if="accountData && !accountData.account.archivedAt"
      :model-value="archiveModalOpen"
      :title="t('accounts.archive.title')"
      :described-by="archiveDescriptionId"
      :close-on-overlay-click="!isArchiving"
      :close-on-escape="!isArchiving"
      @update:model-value="closeArchiveModal"
    >
      <form
        class="account-detail-page__archive-form"
        @submit.prevent="archiveAccount"
      >
        <p :id="archiveDescriptionId">
          {{
            t('accounts.archive.confirmation', {
              name: accountData.account.name,
            })
          }}
        </p>
        <p>{{ t('accounts.archive.conservation') }}</p>
        <p
          v-if="archiveError"
          role="alert"
          class="account-detail-page__archive-error"
        >
          {{ archiveError }}
        </p>
        <div class="account-detail-page__archive-actions">
          <BHButton
            variant="secondary"
            :disabled="isArchiving"
            @click="closeArchiveModal"
          >
            {{ t('common.cancel') }}
          </BHButton>
          <BHButton type="submit" :loading="isArchiving">
            {{ t('accounts.archive.submit') }}
          </BHButton>
        </div>
      </form>
    </BHModal>
  </div>
</template>

<script setup lang="ts">
import { ApiError } from '~/types/api';

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const errorTitleId = useId();
const { activeHousehold } = useActiveHousehold();
const accountApi = useAccountApi();
const institutionApi = useInstitutionApi();
const transactionApi = useTransactionApi();
const toast = useToast();
const editModalOpen = ref(false);
const balanceModalOpen = ref(false);
const archiveModalOpen = ref(false);
const archiveDescriptionId = useId();
const isArchiving = ref(false);
const archiveError = ref('');
const isRestoring = ref(false);
const restoreError = ref('');
const restored = ref(false);
let isPageActive = true;

onScopeDispose(() => {
  isPageActive = false;
});

const household = activeHousehold.value;

if (!household) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Active household is required',
  });
}

const accountId = String(route.params.accountId);
const currentDate = getDateInTimeZone(household.timezone);
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
      institutions,
      institutionName: account.institutionId
        ? institutions.find(({ id }) => id === account.institutionId)?.name
        : undefined,
    };
  },
);

const accountsTo = computed(() =>
  localePath(
    accountData.value?.account.archivedAt ? '/accounts/archived' : '/accounts',
  ),
);

function openEditModal(): void {
  editModalOpen.value = true;
}

function closeEditModal(): void {
  editModalOpen.value = false;
}

async function handleAccountSaved(): Promise<void> {
  closeEditModal();
  await nextTick();
  await refresh();
  toast.success(t('accounts.edit.success'));
}

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
  restored.value = false;
}

function openArchiveModal(): void {
  archiveError.value = '';
  archiveModalOpen.value = true;
}

function closeArchiveModal(): void {
  if (!isArchiving.value) {
    archiveModalOpen.value = false;
  }
}

function invalidateAccountCollections(): void {
  clearNuxtData(
    (key) =>
      key.startsWith(`accounts:${household.id}:`) ||
      key.startsWith(`overview:${household.id}:`),
  );
}

async function archiveAccount(): Promise<void> {
  if (
    isArchiving.value ||
    !archiveModalOpen.value ||
    accountData.value?.account.archivedAt
  )
    return;

  isArchiving.value = true;
  archiveError.value = '';

  try {
    await accountApi.archive(household.id, accountId);
  } catch (cause) {
    archiveError.value = t(
      cause instanceof ApiError && cause.code === 'account_balance_not_zero'
        ? 'accounts.archive.error.balance_not_zero'
        : 'accounts.archive.error.generic',
    );
    return;
  } finally {
    isArchiving.value = false;
  }

  invalidateAccountCollections();
  if (!isPageActive || activeHousehold.value?.id !== household.id) return;

  closeArchiveModal();
  await nextTick();
  toast.success(t('accounts.archive.success'));
  await navigateTo(localePath('/accounts'));
}

async function restoreAccount(): Promise<void> {
  if (isRestoring.value || !accountData.value?.account.archivedAt) return;

  isRestoring.value = true;
  restoreError.value = '';

  try {
    const account = await accountApi.restore(household.id, accountId);
    invalidateAccountCollections();
    if (!isPageActive || activeHousehold.value?.id !== household.id) return;

    accountData.value = { ...accountData.value, account };
    restored.value = true;
    toast.success(t('accounts.restore.success'));
  } catch {
    restoreError.value = t('accounts.restore.error');
  } finally {
    isRestoring.value = false;
  }
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

.account-detail-page__archive-form {
  @apply grid gap-4 text-sm leading-6 text-theme-text-secondary;
}

.account-detail-page__archive-error {
  @apply rounded-control border border-theme-status-error/40 bg-theme-status-error/10 p-3 text-theme-status-error-strong;
}

.account-detail-page__archive-actions {
  @apply mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end;
}

@media (prefers-reduced-motion: reduce) {
  .account-detail-page__loading-card,
  .account-detail-page__loading-grid {
    animation: none;
  }
}
</style>
