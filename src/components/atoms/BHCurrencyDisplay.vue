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

// Normalize signed zero so the formatter never renders "-0,00 €".
const normalizedAmount = computed(() =>
  props.amount === 0 ? 0 : props.amount,
);

const formattedAmount = computed(() => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: props.currency,
    notation: props.compact ? 'compact' : 'standard',
  };

  const formatted = new Intl.NumberFormat(props.locale, options).format(
    normalizedAmount.value,
  );

  if (props.showSign && normalizedAmount.value > 0) {
    return `+${formatted}`;
  }

  return formatted;
});

const sizeClass = computed(() => `bh-currency-display--${props.size}`);

const colorClass = computed(() => {
  if (!props.showSign) return '';
  if (normalizedAmount.value > 0) return 'bh-currency-display--positive';
  if (normalizedAmount.value < 0) return 'bh-currency-display--negative';
  return '';
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
