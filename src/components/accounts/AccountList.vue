<template>
  <div class="account-list">
    <BHSurface
      v-for="group in groups"
      :key="group.key"
      as="section"
      class="account-list__group"
      :aria-labelledby="`account-group-${group.key}`"
    >
      <header class="account-list__group-header">
        <h2 :id="`account-group-${group.key}`">
          {{ t(`accounts.groups.${group.key}`) }}
        </h2>

        <div class="account-list__group-total">
          <BHCurrencyDisplay
            :amount="group.total"
            :currency="currencyForGroup(group)"
            size="lg"
          />
        </div>
      </header>

      <ul class="account-list__rows">
        <li v-for="account in group.accounts" :key="account.id">
          <NuxtLink :to="props.accountTo(account.id)" class="account-list__row">
            <span class="account-list__details">
              <strong>{{ account.name }}</strong>
              <span class="account-list__metadata">
                <span v-if="institutionName(account)">
                  {{ institutionName(account) }}
                </span>
                <span>{{ t(`accounts.kinds.${account.kind}`) }}</span>
              </span>
            </span>

            <BHCurrencyDisplay
              :amount="account.calculatedBalance"
              :currency="account.currency"
              class="account-list__amount"
            />
            <LucideChevronRight
              :size="18"
              class="account-list__chevron"
              aria-hidden="true"
            />
          </NuxtLink>
        </li>
      </ul>
    </BHSurface>
  </div>
</template>

<script setup lang="ts">
import type { Account, AccountCollection, AccountId } from '~/types/account';
import type { CurrencyCode } from '~/types/household';
import type { Institution } from '~/types/institution';
import {
  getAccountComposition,
  type AccountCompositionGroup,
} from '~/utils/get-account-composition';

interface Props {
  collection: AccountCollection;
  institutions: Institution[];
  accountTo: (accountId: AccountId) => string;
}

const props = defineProps<Props>();
const { t } = useI18n();

const groups = computed(() => getAccountComposition(props.collection));

const institutionNames = computed(
  () =>
    new Map(
      props.institutions.map((institution) => [
        institution.id,
        institution.name,
      ]),
    ),
);

const institutionName = (account: Account) =>
  account.institutionId
    ? institutionNames.value.get(account.institutionId)
    : undefined;

const currencyForGroup = (group: AccountCompositionGroup): CurrencyCode => {
  const [firstAccount] = group.accounts;

  if (!firstAccount) {
    throw new Error('Account groups must not be empty');
  }

  return firstAccount.currency;
};
</script>

<style lang="css" scoped>
.account-list {
  @apply grid gap-6;
}

.account-list__group {
  @apply overflow-hidden;
}

.account-list__group-header {
  @apply flex items-center justify-between gap-4 px-5 py-4 md:px-6;
  @apply border-b border-theme-border-secondary;
}

.account-list__group-header h2 {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.account-list__group-total {
  @apply shrink-0 text-theme-text-primary;
}

.account-list__rows {
  @apply divide-y divide-theme-border-secondary;
}

.account-list__row {
  @apply grid min-h-16 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3;
  @apply px-5 py-3 text-theme-text-primary no-underline md:px-6;
  @apply hover:bg-theme-bg-elevated;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme-accent-primary;
}

.account-list__details,
.account-list__details strong {
  @apply min-w-0;
}

.account-list__details strong {
  @apply block truncate text-sm font-medium;
}

.account-list__metadata {
  @apply mt-1 flex min-w-0 flex-wrap gap-x-3 gap-y-1;
  @apply text-xs text-theme-text-muted;
}

.account-list__metadata span {
  @apply truncate;
}

.account-list__amount {
  @apply shrink-0 font-medium;
}

.account-list__chevron {
  @apply shrink-0 text-theme-text-muted;
}

@media (max-width: 479px) {
  .account-list__group-header {
    @apply items-start;
  }

  .account-list__row {
    @apply grid-cols-[minmax(0,1fr)_auto] gap-2;
  }

  .account-list__chevron {
    @apply hidden;
  }

  .account-list__metadata {
    @apply flex-col;
  }
}
</style>
