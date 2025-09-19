import { API_ENDPOINTS } from '~/constants/http';
import type { CreateStockPayload, Stock } from '~/types/stock';

export const useStockApi = () => {
  const $api = useNuxtApp().$api as typeof $fetch;

  const list = (page: number, limit: number) => {
    return useFetch<Stock[]>(API_ENDPOINTS.STOCKS.LIST, {
      query: {
        page,
        limit,
      },
      $fetch: $api,
    });
  };

  const create = (payload: CreateStockPayload) => {
    return useFetch<Stock>(API_ENDPOINTS.STOCKS.CREATE, {
      method: 'POST',
      body: payload,
      $fetch: $api,
    });
  };

  return {
    list,
    create,
  };
};
