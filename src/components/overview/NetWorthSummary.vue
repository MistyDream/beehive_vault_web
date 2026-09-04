<template>
  <BHSurface as="section" class="net-worth-summary" :aria-labelledby="titleId">
    <h2 :id="titleId" class="net-worth-summary__title">
      {{ t('overview.net_worth.title') }}
    </h2>

    <dl class="net-worth-summary__values">
      <div class="net-worth-summary__primary">
        <dt>{{ t('overview.net_worth.net') }}</dt>
        <dd>
          <BHCurrencyDisplay
            :amount="summary.netWorth"
            :currency="summary.currency"
            size="lg"
          />
        </dd>
      </div>

      <div class="net-worth-summary__metric">
        <dt>{{ t('overview.net_worth.assets') }}</dt>
        <dd>
          <BHCurrencyDisplay
            :amount="summary.assets"
            :currency="summary.currency"
          />
        </dd>
      </div>

      <div class="net-worth-summary__metric">
        <dt>{{ t('overview.net_worth.liabilities') }}</dt>
        <dd>
          <BHCurrencyDisplay
            :amount="summary.liabilities"
            :currency="summary.currency"
          />
        </dd>
      </div>
    </dl>
  </BHSurface>
</template>

<script setup lang="ts">
import type { NetWorthSummary } from '~/types/report';
import { BHCurrencyDisplay, BHSurface } from '#components';

interface Props {
  summary: NetWorthSummary;
}

defineProps<Props>();

const { t } = useI18n();
const titleId = useId();
</script>

<style lang="css" scoped>
.net-worth-summary {
  @apply overflow-hidden p-5 md:p-6;
}

.net-worth-summary__title {
  @apply font-poppins text-base font-semibold text-theme-text-primary;
}

.net-worth-summary__values {
  @apply mt-4 grid grid-cols-2;
}

.net-worth-summary__primary {
  @apply col-span-2 border-b border-theme-border-secondary pb-5;
}

.net-worth-summary__primary dt,
.net-worth-summary__metric dt {
  @apply text-sm text-theme-text-muted;
}

.net-worth-summary__primary dd,
.net-worth-summary__metric dd {
  @apply mt-1;
}

.net-worth-summary__primary :deep(.bh-currency-display) {
  @apply text-3xl font-semibold text-theme-text-primary md:text-4xl;
}

.net-worth-summary__metric {
  @apply min-w-0 pt-4;
}

.net-worth-summary__metric + .net-worth-summary__metric {
  @apply border-l border-theme-border-secondary pl-4;
}

.net-worth-summary__primary + .net-worth-summary__metric {
  @apply pr-4;
}

.net-worth-summary__metric :deep(.bh-currency-display) {
  @apply text-base font-medium text-theme-text-primary md:text-lg;
}
</style>
