<template>
  <span class="bh-percent-display" :class="[sizeClass, colorClass]">
    {{ formattedValue }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  value: number;
  precision?: number;
  showSign?: boolean;
  colorCoded?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  precision: 2,
  showSign: true,
  colorCoded: true,
  size: 'md',
});

const { locale } = useI18n();

const formattedValue = computed(() => {
  const formatted = new Intl.NumberFormat(locale.value, {
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision,
  }).format(Math.abs(props.value));

  const sign = props.value > 0 && props.showSign ? '+' : props.value < 0 ? '-' : '';

  return `${sign}${formatted} %`;
});

const sizeClass = computed(() => `bh-percent-display--${props.size}`);

const colorClass = computed(() => {
  if (!props.colorCoded) return '';
  if (props.value > 0) return 'bh-percent-display--positive';
  if (props.value < 0) return 'bh-percent-display--negative';
  return 'bh-percent-display--neutral';
});
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-percent-display {
  @apply font-space tabular-nums;
}

.bh-percent-display--sm {
  @apply text-xs;
}

.bh-percent-display--md {
  @apply text-sm;
}

.bh-percent-display--lg {
  @apply text-lg font-semibold;
}

.bh-percent-display--positive {
  @apply text-theme-status-success;
}

.bh-percent-display--negative {
  @apply text-theme-status-error;
}

.bh-percent-display--neutral {
  @apply text-theme-text-muted;
}
</style>
