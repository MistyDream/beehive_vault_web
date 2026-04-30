import { API_ENDPOINTS } from '~/constants/http';
import type { StockSearchItem, StockSearchResult } from '~/types/portfolio';

export const useStockApi = () => {
  const $api = useNuxtApp().$api as typeof $fetch;

  const search = async (q: string): Promise<StockSearchResult> => {
    const response = await $api.raw<StockSearchItem[]>(API_ENDPOINTS.STOCKS.SEARCH, {
      query: { q },
    });
    return {
      items: response._data ?? [],
      truncated: response.headers.get('x-result-truncated') === 'true',
    };
  };

  return { search };
};
