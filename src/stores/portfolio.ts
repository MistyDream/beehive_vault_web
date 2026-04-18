import { defineStore } from 'pinia';
import type { Portfolio } from '~/types/portfolio';

export const usePortfolioStore = defineStore('portfolio', () => {
  const activeId = ref<number | null>(null);
  const active = ref<Portfolio | null>(null);

  function setActive(portfolio: Portfolio) {
    activeId.value = portfolio.id;
    active.value = portfolio;
  }

  function clear() {
    activeId.value = null;
    active.value = null;
  }

  return {
    activeId,
    active,
    setActive,
    clear,
  };
});
