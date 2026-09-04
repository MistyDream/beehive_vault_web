<template>
  <BHSurface
    as="section"
    class="account-composition"
    :aria-labelledby="titleId"
  >
    <header class="account-composition__header">
      <div>
        <p>{{ t('overview.composition.overline') }}</p>
        <h2 :id="titleId">{{ t('overview.composition.title') }}</h2>
      </div>
      <NuxtLink :to="accountsTo" class="account-composition__all-link">
        {{ t('overview.composition.view_all') }}
        <LucideArrowRight :size="16" aria-hidden="true" />
      </NuxtLink>
    </header>

    <p v-if="groups.length === 0" class="account-composition__empty">
      {{ t('overview.composition.empty') }}
    </p>

    <ul v-else class="account-composition__list">
      <li v-for="group in groups" :key="group.key">
        <NuxtLink :to="accountsTo" class="account-composition__row">
          <span class="account-composition__icon" aria-hidden="true">
            <component :is="presentations[group.key].icon" :size="20" />
          </span>
          <span class="account-composition__details">
            <strong>{{ t(presentations[group.key].labelKey) }}</strong>
            <small>{{ accountNames(group) }}</small>
          </span>
          <BHCurrencyDisplay
            :amount="group.total"
            :currency="currency"
            class="account-composition__amount"
          />
          <LucideChevronRight
            :size="18"
            class="account-composition__chevron"
            aria-hidden="true"
          />
        </NuxtLink>
      </li>
    </ul>
  </BHSurface>
</template>

<script setup lang="ts">
import {
  LucideArrowRight,
  LucideChevronRight,
  LucideCreditCard,
  LucideLandmark,
  LucidePiggyBank,
} from '#components';
import type { Component } from 'vue';
import type { AccountCollection } from '~/types/account';
import type { CurrencyCode } from '~/types/household';
import {
  getAccountComposition,
  type AccountCompositionGroup,
  type AccountCompositionKey,
} from '~/utils/get-account-composition';

interface Props {
  collection: AccountCollection;
  currency: CurrencyCode;
  accountsTo: string;
}

interface GroupPresentation {
  labelKey: string;
  icon: Component;
}

const props = defineProps<Props>();
const { t } = useI18n();
const titleId = useId();

const groups = computed(() => getAccountComposition(props.collection));

const presentations: Record<AccountCompositionKey, GroupPresentation> = {
  daily: {
    labelKey: 'overview.composition.daily',
    icon: LucideLandmark,
  },
  savings: {
    labelKey: 'overview.composition.savings',
    icon: LucidePiggyBank,
  },
  liabilities: {
    labelKey: 'overview.composition.liabilities',
    icon: LucideCreditCard,
  },
};

const accountNames = (group: AccountCompositionGroup): string =>
  group.accounts.map(({ name }) => name).join(' · ');
</script>

<style lang="css" scoped>
.account-composition {
  @apply overflow-hidden p-5 md:p-6;
}

.account-composition__header {
  @apply flex items-start justify-between gap-4;
}

.account-composition__header p {
  @apply text-xs font-medium uppercase tracking-widest text-theme-text-muted;
}

.account-composition__header h2 {
  @apply mt-1 font-poppins text-lg font-semibold text-theme-text-primary md:text-xl;
}

.account-composition__all-link {
  @apply inline-flex shrink-0 items-center gap-1 rounded-md;
  @apply text-sm font-medium text-theme-accent-primary-strong no-underline;
  @apply hover:text-theme-accent-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.account-composition__empty {
  @apply mt-5 rounded-control bg-theme-bg-elevated px-4 py-6;
  @apply text-center text-sm text-theme-text-secondary;
}

.account-composition__list {
  @apply mt-4 divide-y divide-theme-border-secondary;
}

.account-composition__row {
  @apply grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3;
  @apply -mx-2 rounded-control px-2 py-3 text-theme-text-primary no-underline;
  @apply hover:bg-theme-bg-elevated;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.account-composition__icon {
  @apply grid h-10 w-10 shrink-0 place-items-center rounded-control;
  @apply bg-theme-bg-elevated text-theme-accent-primary-strong;
}

.account-composition__details {
  @apply min-w-0;
}

.account-composition__details strong,
.account-composition__details small {
  @apply block truncate;
}

.account-composition__details strong {
  @apply text-sm font-medium;
}

.account-composition__details small {
  @apply mt-0.5 text-xs text-theme-text-muted;
}

.account-composition__amount {
  @apply text-sm font-medium text-theme-text-primary;
}

.account-composition__chevron {
  @apply shrink-0 text-theme-text-muted;
}

@media (max-width: 479px) {
  .account-composition__header {
    @apply flex-col;
  }

  .account-composition__row {
    @apply grid-cols-[auto_minmax(0,1fr)_auto] gap-2;
  }

  .account-composition__amount {
    @apply col-start-2 row-start-2;
  }

  .account-composition__chevron {
    @apply col-start-3 row-span-2 row-start-1;
  }

  .account-composition__details {
    @apply self-end;
  }

  .account-composition__details small {
    @apply hidden;
  }

  .account-composition__icon {
    @apply row-span-2;
  }
}
</style>
