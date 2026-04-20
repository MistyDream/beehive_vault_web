<template>
  <div class="portfolio-resume" role="tabpanel">
    <div class="portfolio-resume__grid">
      <div class="portfolio-resume__main">
        <BHPortfolioPositionsCard
          :portfolio-id="id"
          @row-click="onPositionClick"
        />
        <BHPortfolioAllocationCard :portfolio-id="id" />
      </div>
      <div class="portfolio-resume__side">
        <BHPortfolioCashCard :portfolio-id="id" />
        <BHPortfolioRecentTransactionsCard :portfolio-id="id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LucideChartCandlestick } from '#components';
import BHPortfolioStockDrawerContent from '~/components/organisms/BHPortfolioStockDrawerContent.vue';
import type { Position } from '~/types/portfolio';

const route = useRoute();
const id = computed(() => Number(route.params.id));

const drawer = useDrawer();

function onPositionClick(position: Position) {
  drawer.open(
    position.stock.symbol,
    LucideChartCandlestick,
    BHPortfolioStockDrawerContent,
    {
      portfolioId: id.value,
      stockId: position.stock.id,
      stockSymbol: position.stock.symbol,
    },
  );
}
</script>

<style lang="css" scoped>
.portfolio-resume__grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6;
}

.portfolio-resume__main {
  @apply lg:col-span-2 flex flex-col gap-4 lg:gap-6;
}

.portfolio-resume__side {
  @apply flex flex-col gap-4 lg:gap-6;
}
</style>
