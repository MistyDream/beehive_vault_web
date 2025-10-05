import { API_ENDPOINTS } from '~/constants/http';
import type { ListApi } from '~/types/list';
import type {
  CreateStockPayload,
  Stock,
  StockFilters,
  UpdateStockPayload,
} from '~/types/stock';

// ---- helper: object -> bracketed query ----
function toBracketQuery(root: string, obj: Record<string, any>) {
  const out: Record<string, string> = {};
  const walk = (o: any, path: string[]) => {
    for (const [k, v] of Object.entries(o)) {
      const next = [...path, k];
      if (v != null && typeof v === 'object' && !Array.isArray(v))
        walk(v, next);
      else out[`${root}${next.map((p) => `[${p}]`).join('')}`] = String(v);
    }
  };
  walk(obj, []);
  return out;
}

export const useStockApi = () => {
  const $api = useNuxtApp().$api as typeof $fetch;

  const detail = (isin: string) => {
    return useFetch<Stock>(API_ENDPOINTS.STOCKS.DETAIL(isin), {
      method: 'GET',
      $fetch: $api,
    });
  };

  const list = (
    page: Ref<number>,
    limit: Ref<number>,
    sort: Ref<StockFilters>,
  ) => {
    return useFetch<ListApi<Stock>>(API_ENDPOINTS.STOCKS.LIST, {
      query: {
        page,
        limit,
        ...toBracketQuery('sort', sort.value),
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

  const update = (isin: string, payload: UpdateStockPayload) => {
    return useFetch<Stock>(API_ENDPOINTS.STOCKS.DETAIL(isin), {
      method: 'PUT',
      body: payload,
      $fetch: $api,
    });
  };

  return {
    detail,
    list,
    create,
    update,
  };
};
