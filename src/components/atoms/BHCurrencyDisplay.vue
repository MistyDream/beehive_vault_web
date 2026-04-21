<template>
  <span class="bh-currency-display" :class="[sizeClass, colorClass]">
    {{ formattedAmount }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  amount: number;
  currency?: string;
  locale?: string;
  showSign?: boolean;
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'EUR',
  locale: 'fr-FR',
  showSign: false,
  compact: false,
  size: 'md',
});

// Zero is coerced to +0 so Intl never emits "-0,00 €" for a negative-signed zero.
const amount = computed(() => props.amount || 0);

const formattedAmount = computed(() => {
  const formatted = new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
    notation: props.compact ? 'compact' : 'standard',
  }).format(amount.value);

  return props.showSign && amount.value > 0 ? `+${formatted}` : formatted;
});

const sizeClass = computed(() => `bh-currency-display--${props.size}`);

const colorClass = computed(() => {
  if (!props.showSign || amount.value === 0) return '';
  return amount.value > 0
    ? 'bh-currency-display--positive'
    : 'bh-currency-display--negative';
});
</script>

<style lang="css" scoped>
.bh-currency-display {
  @apply font-space tabular-nums;
}

.bh-currency-display--sm {
  @apply text-xs;
}

.bh-currency-display--md {
  @apply text-sm;
}

.bh-currency-display--lg {
  @apply text-lg font-semibold;
}

.bh-currency-display--positive {
  @apply text-theme-status-success;
}

.bh-currency-display--negative {
  @apply text-theme-status-error;
}
</style>
