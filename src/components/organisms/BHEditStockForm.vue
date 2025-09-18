<template>
  <div class="bh-edit-stock-form">
    <div class="bh-edit-stock-form__presentation">
      <BHImage
        v-if="logo"
        class="bh-edit-stock-form__image"
        :src="logo"
        alt="Stock"
      />
      <div v-else class="bh-edit-stock-form__image-placeholder">
        <LucideImageOff :size="24" />
      </div>
      <BHBaseInput
        id="companyName"
        v-model="companyName"
        label="Nom"
        type="text"
        placeholder="Apple Inc."
      />
    </div>
    <div class="bh-edit-stock-form__mandatory">
      <BHBaseInput
        id="symbol"
        v-model="symbol"
        label="Ticker"
        type="text"
        placeholder="AAPL"
      />
      <BHBaseInput
        id="isin"
        v-model="isin"
        label="ISIN"
        type="text"
        placeholder="US5949181045"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stock } from '~/types/stock';

interface Props {
  stock?: Stock;
}

const props = withDefaults(defineProps<Props>(), {
  stock: () => ({
    name: '',
    symbol: '',
    isin: '',
    logo: '',
    currency: '',
    market: '',
    sector: '',
    industry: '',
    country: '',
    badges: [],
    score: {
      valuation: 0,
      profitability: 0,
      growth: 0,
      solidity: 0,
      shareholderReturn: 0,
      total: 0,
      createdAt: '',
    },
    updatedAt: '',
  }),
});

const companyName = ref(props.stock.name);
const logo = ref(props.stock.logo);
const symbol = ref(props.stock.symbol);
const isin = ref(props.stock.isin);
// const logo = ref('https://picsum.photos/200');
</script>

<style lang="css" scoped>
.bh-edit-stock-form {
  @apply flex flex-col gap-6;
}

.bh-edit-stock-form__presentation {
  @apply flex flex-row gap-4;
}

.bh-edit-stock-form__image {
  @apply w-20 h-20 rounded-lg border border-deep-blue-600;
}

.bh-edit-stock-form__image-placeholder {
  @apply w-20 h-20 rounded-lg;
  @apply bg-dark-gray-600 border border-deep-blue-600;
  @apply flex items-center justify-center flex-shrink-0;
  @apply text-sm font-bold text-warm-white-500 cursor-not-allowed;
}

.bh-edit-stock-form__mandatory {
  @apply flex flex-row gap-4;
}
</style>
