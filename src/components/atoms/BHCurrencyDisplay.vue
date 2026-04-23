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
  locale: undefined,
  showSign: false,
  compact: false,
  size: 'md',
});

const { locale: i18nLocale } = useI18n();

// Zero is coerced to +0 so Intl never emits "-0,00 €" for a negative-signed zero.
const amount = computed(() => props.amount || 0);

// Compose manually: locale-aware number + space + currency symbol (always
// suffix). Using style:'currency' directly places the symbol per locale which
// breaks visual consistency when switching languages (e.g. "€10.00" in en
// vs "10,00 €" in fr).
const formattedAmount = computed(() => {
  const activeLocale = props.locale ?? i18nLocale.value;
  const number = new Intl.NumberFormat(activeLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: props.compact ? 'compact' : 'standard',
  }).format(amount.value);

  const symbol = getCurrencySymbol(props.currency, activeLocale);
  const signed = props.showSign && amount.value > 0 ? `+${number}` : number;
  return `${signed} ${symbol}`;
});

function getCurrencySymbol(currency: string, locale: string): string {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? currency;
}

const sizeClass = computed(() => `bh-currency-display--${props.size}`);

const colorClass = computed(() => {
  if (!props.showSign || amount.value === 0) return '';
  return amount.value > 0
    ? 'bh-currency-display--positive'
    : 'bh-currency-display--negative';
});
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

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
