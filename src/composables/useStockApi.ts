import { API_ENDPOINTS } from '~/constants/http';
import type { Stock } from '~/types/stock';

export const useStockApi = () => {
  const list = (page: number, limit: number) => {
    return useFetch<Stock[]>(API_ENDPOINTS.STOCKS.LIST, {
      query: {
        page,
        limit,
      },
      $fetch: useNuxtApp().$api as typeof $fetch,
    });
  };

  return {
    list,
  };
};
