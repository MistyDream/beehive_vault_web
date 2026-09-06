<template>
  <article class="account-detail">
    <NuxtLink :to="accountsTo" class="account-detail__back">
      <LucideArrowLeft :size="18" aria-hidden="true" />
      {{ t('accounts.detail.back') }}
    </NuxtLink>

    <header class="account-detail__header">
      <div>
        <h1 ref="titleElement" tabindex="-1">{{ account.name }}</h1>
        <div class="account-detail__metadata">
          <span v-if="institutionName">{{ institutionName }}</span>
          <span v-if="institutionName" aria-hidden="true">·</span>
          <span>{{ t(`accounts.kinds.${account.kind}`) }}</span>
          <BHBadge v-if="account.archivedAt" size="sm" variant="neutral">
            {{ t('accounts.detail.archived') }}
          </BHBadge>
        </div>
      </div>
    </header>

    <BHSurface
      as="section"
      class="account-detail__balance-card"
      :aria-label="t('accounts.detail.balance_summary')"
    >
      <div class="account-detail__current-balance">
        <span>{{ currentBalanceLabel }}</span>
        <BHCurrencyDisplay
          :amount="account.calculatedBalance"
          :currency="account.currency"
          size="lg"
        />
        <p>{{ t('accounts.detail.balance_explanation') }}</p>
      </div>

      <div class="account-detail__latest-balance">
        <span>{{ t('accounts.detail.latest_balance') }}</span>
        <template v-if="account.latestBalance && account.balanceDate">
          <BHCurrencyDisplay
            :amount="account.latestBalance"
            :currency="account.currency"
            size="lg"
          />
          <small>
            {{
              t('accounts.detail.as_of', {
                date: formatDate(account.balanceDate),
              })
            }}
          </small>
        </template>
        <p v-else>{{ t('accounts.detail.no_declared_balance') }}</p>
      </div>
    </BHSurface>

    <div class="account-detail__content-grid">
      <BHSurface
        as="section"
        class="account-detail__section"
        :aria-labelledby="transactionsTitleId"
      >
        <header class="account-detail__section-header">
          <h2 :id="transactionsTitleId">
            {{ t('accounts.detail.recent_transactions') }}
          </h2>
          <NuxtLink
            :to="transactionsTo"
            class="account-detail__all-transactions"
          >
            {{ t('accounts.detail.view_all_transactions') }}
            <LucideArrowRight :size="16" aria-hidden="true" />
          </NuxtLink>
        </header>

        <ul v-if="operationRows.length" class="account-detail__list">
          <li
            v-for="operation in operationRows"
            :key="operation.id"
            class="account-detail__operation"
          >
            <span class="account-detail__operation-details">
              <strong>{{ operation.label }}</strong>
              <small>
                {{ operation.context }} ·
                {{ formatDate(operation.bookingDate) }}
              </small>
            </span>
            <span class="account-detail__operation-amount">
              <BHCurrencyDisplay
                :amount="operation.amount"
                :currency="account.currency"
                show-sign
              />
            </span>
          </li>
        </ul>
        <p v-else class="account-detail__empty">
          {{ t('accounts.detail.no_transactions') }}
        </p>
      </BHSurface>

      <BHSurface
        as="section"
        class="account-detail__section"
        :aria-labelledby="balancesTitleId"
      >
        <header class="account-detail__section-header">
          <h2 :id="balancesTitleId">
            {{ t('accounts.detail.balance_history') }}
          </h2>
        </header>

        <ul v-if="balances.length" class="account-detail__list">
          <li
            v-for="balance in balances"
            :key="balance.id"
            class="account-detail__history-entry"
          >
            <span class="account-detail__history-details">
              <strong>{{ formatDate(balance.balanceDate) }}</strong>
              <small>
                {{ t(`accounts.detail.sources.${balance.source}`) }}
              </small>
            </span>
            <BHCurrencyDisplay
              :amount="balance.amount"
              :currency="account.currency"
            />
          </li>
        </ul>
        <p v-else class="account-detail__empty">
          {{ t('accounts.detail.no_balance_history') }}
        </p>
      </BHSurface>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Account, Balance } from '~/types/account';
import type { DateString, DecimalString } from '~/types/http';
import type { Operation } from '~/types/operation';

interface Props {
  account: Account;
  institutionName?: string;
  balances: Balance[];
  operations: Operation[];
  accountsTo: string;
  transactionsTo: string;
}

interface OperationRow {
  id: string;
  label: string;
  context: string;
  bookingDate: DateString;
  amount: DecimalString;
}

const props = defineProps<Props>();
const { locale, t } = useI18n();
const titleElement = ref<HTMLHeadingElement | null>(null);
const transactionsTitleId = useId();
const balancesTitleId = useId();

const liabilityKinds = ['credit_card', 'loan', 'other_liability'];

const currentBalanceLabel = computed(() => {
  if (props.account.kind === 'investment') {
    return t('accounts.detail.current_value');
  }

  if (liabilityKinds.includes(props.account.kind)) {
    return t('accounts.detail.amount_due');
  }

  return t('accounts.detail.current_balance');
});

const dateFormatter = computed(
  () =>
    new Intl.DateTimeFormat(locale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
);

const operationRows = computed<OperationRow[]>(() =>
  props.operations.map((operation) => {
    if (operation.operationType === 'transaction') {
      return {
        id: operation.id,
        label: operation.label,
        context: operation.category?.name ?? t('accounts.detail.uncategorized'),
        bookingDate: operation.bookingDate,
        amount: operation.accountAmount,
      };
    }

    const movement =
      [operation.source, operation.destination].find(
        ({ account }) => account.id === props.account.id,
      ) ?? operation.source;

    return {
      id: operation.id,
      label: movement.label,
      context: t('accounts.detail.transfer'),
      bookingDate: movement.bookingDate,
      amount: movement.accountAmount,
    };
  }),
);

const formatDate = (date: DateString) =>
  dateFormatter.value.format(new Date(`${date}T00:00:00Z`));

onMounted(() => {
  titleElement.value?.focus();
});
</script>

<style lang="css" scoped>
.account-detail {
  @apply mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8;
}

.account-detail__back,
.account-detail__all-transactions {
  @apply inline-flex min-h-11 items-center gap-2 rounded-md;
  @apply text-sm font-medium text-theme-accent-primary-strong no-underline;
  @apply hover:text-theme-accent-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.account-detail__back {
  @apply -ml-2 px-2;
}

.account-detail__header {
  @apply mb-6 mt-3 flex items-start justify-between gap-4;
}

.account-detail__header h1 {
  @apply font-poppins text-2xl font-semibold text-theme-text-primary md:text-3xl;
  @apply focus:outline-none;
}

.account-detail__metadata {
  @apply mt-2 flex flex-wrap items-center gap-2 text-sm text-theme-text-secondary;
}

.account-detail__balance-card {
  @apply grid overflow-hidden md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)];
}

.account-detail__current-balance,
.account-detail__latest-balance {
  @apply flex min-w-0 flex-col px-5 py-6 sm:px-6;
}

.account-detail__latest-balance {
  @apply border-t border-theme-border-secondary md:border-l md:border-t-0;
}

.account-detail__current-balance > span,
.account-detail__latest-balance > span {
  @apply text-sm font-medium text-theme-text-secondary;
}

.account-detail__current-balance :deep(.bh-currency-display),
.account-detail__latest-balance :deep(.bh-currency-display) {
  @apply mt-2 text-2xl font-semibold text-theme-text-primary sm:text-3xl;
}

.account-detail__current-balance p,
.account-detail__latest-balance p,
.account-detail__latest-balance small {
  @apply mt-2 text-sm leading-6 text-theme-text-muted;
}

.account-detail__content-grid {
  @apply mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)];
}

.account-detail__section {
  @apply overflow-hidden;
}

.account-detail__section-header {
  @apply flex min-h-16 items-center justify-between gap-4;
  @apply border-b border-theme-border-secondary px-5 py-3 sm:px-6;
}

.account-detail__section-header h2 {
  @apply font-poppins text-base font-semibold text-theme-text-primary sm:text-lg;
}

.account-detail__all-transactions {
  @apply shrink-0;
}

.account-detail__list {
  @apply divide-y divide-theme-border-secondary;
}

.account-detail__operation,
.account-detail__history-entry {
  @apply grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4;
  @apply px-5 py-3 sm:px-6;
}

.account-detail__operation-details,
.account-detail__history-details {
  @apply min-w-0;
}

.account-detail__operation-details strong,
.account-detail__operation-details small,
.account-detail__history-details strong,
.account-detail__history-details small {
  @apply block;
}

.account-detail__operation-details strong,
.account-detail__history-details strong {
  @apply truncate text-sm font-medium text-theme-text-primary;
}

.account-detail__operation-details small,
.account-detail__history-details small {
  @apply mt-1 truncate text-xs text-theme-text-muted;
}

.account-detail__operation-amount,
.account-detail__history-entry > :deep(.bh-currency-display) {
  @apply shrink-0 font-medium;
}

.account-detail__empty {
  @apply px-5 py-8 text-center text-sm text-theme-text-muted sm:px-6;
}

@media (max-width: 479px) {
  .account-detail__section-header {
    @apply items-start;
  }

  .account-detail__all-transactions {
    @apply -mr-2 px-2 text-xs;
  }
}
</style>
