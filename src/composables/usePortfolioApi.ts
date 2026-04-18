import { API_ENDPOINTS } from '~/constants/http';
import type {
  CashBalance,
  CreatePortfolioPayload,
  PerformanceFilters,
  PerformanceReport,
  Portfolio,
  PortfolioScoring,
  PortfolioSummary,
  Position,
  UpdatePortfolioPayload,
} from '~/types/portfolio';

export const usePortfolioApi = () => {
  const $api = useNuxtApp().$api as typeof $fetch;

  const list = () =>
    useFetch<Portfolio[]>(API_ENDPOINTS.PORTFOLIOS.LIST, { $fetch: $api });

  const detail = (id: MaybeRefOrGetter<number>) =>
    useFetch<Portfolio>(() => API_ENDPOINTS.PORTFOLIOS.DETAIL(toValue(id)), {
      $fetch: $api,
    });

  const summary = (id: MaybeRefOrGetter<number>) =>
    useFetch<PortfolioSummary>(
      () => API_ENDPOINTS.PORTFOLIOS.SUMMARY(toValue(id)),
      { $fetch: $api },
    );

  const positions = (id: MaybeRefOrGetter<number>) =>
    useFetch<Position[]>(
      () => API_ENDPOINTS.PORTFOLIOS.POSITIONS(toValue(id)),
      { $fetch: $api },
    );

  const cash = (id: MaybeRefOrGetter<number>) =>
    useFetch<CashBalance>(() => API_ENDPOINTS.PORTFOLIOS.CASH(toValue(id)), {
      $fetch: $api,
    });

  const performance = (
    id: MaybeRefOrGetter<number>,
    filters?: MaybeRefOrGetter<PerformanceFilters | undefined>,
  ) =>
    useFetch<PerformanceReport>(
      () => API_ENDPOINTS.PORTFOLIOS.PERFORMANCE(toValue(id)),
      {
        $fetch: $api,
        query: computed(() => toValue(filters) ?? {}),
      },
    );

  const scoring = (id: MaybeRefOrGetter<number>) =>
    useFetch<PortfolioScoring>(
      () => API_ENDPOINTS.PORTFOLIOS.SCORING(toValue(id)),
      { $fetch: $api },
    );

  const create = (payload: CreatePortfolioPayload) =>
    $api<Portfolio>(API_ENDPOINTS.PORTFOLIOS.CREATE, {
      method: 'POST',
      body: payload,
    });

  const update = (id: number, payload: UpdatePortfolioPayload) =>
    $api<Portfolio>(API_ENDPOINTS.PORTFOLIOS.UPDATE(id), {
      method: 'PUT',
      body: payload,
    });

  const remove = (id: number) =>
    $api<void>(API_ENDPOINTS.PORTFOLIOS.DELETE(id), { method: 'DELETE' });

  return {
    list,
    detail,
    summary,
    positions,
    cash,
    performance,
    scoring,
    create,
    update,
    remove,
  };
};
