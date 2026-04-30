<template>
  <div class="bh-tx-delete">
    <p class="bh-tx-delete__message">
      {{ t('portfolios.detail.transactions.delete_confirm.message') }}
    </p>

    <div class="bh-tx-delete__preview">
      <div class="bh-tx-delete__row">
        <span class="bh-tx-delete__date">{{ formatDate(transaction.executed_at) }}</span>
        <span
          class="bh-tx-delete__type"
          :class="`bh-tx-delete__type--${transaction.transaction_type}`"
        >
          <component
            :is="iconForTransaction(transaction.transaction_type)"
            :size="12"
            aria-hidden="true"
          />
          {{ t(`portfolios.detail.resume.tx_type.${transaction.transaction_type}`) }}
        </span>
      </div>
      <div v-if="transaction.stock" class="bh-tx-delete__stock">
        <BHStockAvatar :symbol="transaction.stock.symbol" size="sm" />
        <span class="bh-tx-delete__stock-body">
          <span class="bh-tx-delete__stock-symbol">{{ transaction.stock.symbol }}</span>
          <span class="bh-tx-delete__stock-name">{{ transaction.stock.name }}</span>
        </span>
      </div>
      <BHCurrencyDisplay
        v-if="signedAmount(transaction) !== null"
        :amount="signedAmount(transaction)!"
        :currency="transaction.currency"
        show-sign
        size="md"
      />
    </div>

    <div class="bh-tx-delete__footer">
      <BHButton
        variant="ghost"
        type="button"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ t('portfolios.detail.transactions.delete_confirm.cancel') }}
      </BHButton>
      <BHButton variant="danger" type="button" :loading="loading" @click="$emit('confirm')">
        {{ t('portfolios.detail.transactions.delete_confirm.confirm') }}
      </BHButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types/portfolio';
import { iconForTransaction, signedAmount } from '~/utils/transaction';

interface Props {
  transaction: Transaction;
  loading?: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'confirm' | 'cancel'): void;
}>();

const { t } = useI18n();
const { formatDate } = useLocaleFormatters();
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-tx-delete {
  @apply flex flex-col gap-4;
}

.bh-tx-delete__message {
  @apply text-sm text-theme-text-secondary;
}

.bh-tx-delete__preview {
  @apply flex flex-col gap-2 p-3 rounded-lg bg-theme-bg-elevated/50 border border-theme-border-secondary/60;
}

.bh-tx-delete__row {
  @apply flex items-center justify-between gap-2;
}

.bh-tx-delete__date {
  @apply text-sm text-theme-text-secondary tabular-nums;
}

.bh-tx-delete__type {
  @apply inline-flex items-center gap-1 px-2 py-0.5 rounded;
  @apply text-xs font-medium;
  @apply bg-theme-bg-elevated text-theme-text-secondary;
}

.bh-tx-delete__type--buy {
  @apply bg-theme-status-success/15 text-theme-status-success-strong;
}

.bh-tx-delete__type--sell {
  @apply bg-theme-status-error/15 text-theme-status-error-strong;
}

.bh-tx-delete__type--dividend {
  @apply bg-theme-accent-primary/15 text-theme-accent-primary-strong;
}

.bh-tx-delete__type--fee {
  @apply bg-theme-status-warning/15 text-theme-status-warning-strong;
}

.bh-tx-delete__type--deposit {
  @apply bg-theme-accent-secondary/15 text-theme-accent-secondary-strong;
}

.bh-tx-delete__type--withdrawal,
.bh-tx-delete__type--split {
  @apply bg-theme-bg-elevated text-theme-text-muted;
}

.bh-tx-delete__stock {
  @apply flex items-center gap-2 min-w-0;
}

.bh-tx-delete__stock-body {
  @apply flex flex-col min-w-0 gap-0.5;
}

.bh-tx-delete__stock-symbol {
  @apply text-sm font-medium text-theme-text-primary;
}

.bh-tx-delete__stock-name {
  @apply text-xs text-theme-text-secondary truncate;
}

.bh-tx-delete__footer {
  @apply flex items-center justify-end gap-3 mt-2;
}
</style>
