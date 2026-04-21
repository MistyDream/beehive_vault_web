<template>
  <span
    class="bh-stock-avatar"
    :class="sizeClass"
    :style="{ backgroundColor: bg, color: fg }"
    :aria-hidden="ariaHidden || undefined"
    :role="ariaHidden ? undefined : 'img'"
    :aria-label="ariaHidden ? undefined : t('a11y.stock_avatar_label', { symbol })"
  >
    {{ initials }}
  </span>
</template>

<script setup lang="ts">
import { colorFromSymbol, foregroundFromSymbol } from '~/utils/stringToColor';

interface Props {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  ariaHidden?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  ariaHidden: true,
});

const { t } = useI18n();

const bg = computed(() => colorFromSymbol(props.symbol));
const fg = computed(() => foregroundFromSymbol(props.symbol));
const sizeClass = computed(() => `bh-stock-avatar--${props.size}`);
const initials = computed(() => props.symbol.slice(0, 2).toUpperCase());
</script>

<style lang="css" scoped>
.bh-stock-avatar {
  @apply inline-flex items-center justify-center;
  @apply rounded-full;
  @apply font-poppins font-semibold;
  @apply select-none shrink-0;
  @apply tabular-nums;
}

.bh-stock-avatar--sm {
  @apply w-6 h-6 text-2xs;
}

.bh-stock-avatar--md {
  @apply w-8 h-8 text-xs;
}

.bh-stock-avatar--lg {
  @apply w-10 h-10 text-sm;
}
</style>
