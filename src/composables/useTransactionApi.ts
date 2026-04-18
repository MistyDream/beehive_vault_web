import { API_ENDPOINTS } from '~/constants/http';
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  UpdateTransactionPayload,
} from '~/types/portfolio';

export const useTransactionApi = () => {
  const $api = useNuxtApp().$api as typeof $fetch;

  const list = (
    portfolioId: MaybeRefOrGetter<number>,
    filters?: MaybeRefOrGetter<TransactionFilters | undefined>,
  ) =>
    useFetch<Transaction[]>(
      () => API_ENDPOINTS.PORTFOLIOS.TRANSACTIONS(toValue(portfolioId)),
      {
        $fetch: $api,
        query: computed(() => toValue(filters) ?? {}),
      },
    );

  const detail = (
    portfolioId: MaybeRefOrGetter<number>,
    txId: MaybeRefOrGetter<number>,
  ) =>
    useFetch<Transaction>(
      () =>
        API_ENDPOINTS.PORTFOLIOS.TRANSACTION(toValue(portfolioId), toValue(txId)),
      { $fetch: $api },
    );

  const create = (portfolioId: number, payload: CreateTransactionPayload) =>
    $api<Transaction>(API_ENDPOINTS.PORTFOLIOS.TRANSACTIONS(portfolioId), {
      method: 'POST',
      body: payload,
    });

  const update = (
    portfolioId: number,
    txId: number,
    payload: UpdateTransactionPayload,
  ) =>
    $api<Transaction>(
      API_ENDPOINTS.PORTFOLIOS.TRANSACTION(portfolioId, txId),
      { method: 'PUT', body: payload },
    );

  const remove = (portfolioId: number, txId: number) =>
    $api<void>(API_ENDPOINTS.PORTFOLIOS.TRANSACTION(portfolioId, txId), {
      method: 'DELETE',
    });

  return {
    list,
    detail,
    create,
    update,
    remove,
  };
};
