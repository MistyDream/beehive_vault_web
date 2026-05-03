import { API_ENDPOINTS } from '~/constants/http';
import type {
  CreateTransactionPayload,
  Paginated,
  Transaction,
  TransactionStats,
  TransactionsQuery,
  UpdateTransactionPayload,
} from '~/types/portfolio';

type TransactionsQueryWire = Omit<TransactionsQuery, 'transaction_types'> & {
  transaction_types?: string;
};

function toWireQuery(query: TransactionsQuery | undefined): TransactionsQueryWire {
  if (!query) return {};
  const { transaction_types, ...rest } = query;
  const wire: TransactionsQueryWire = { ...rest };
  if (transaction_types && transaction_types.length > 0) {
    wire.transaction_types = transaction_types.join(',');
  }
  return wire;
}

export const useTransactionApi = () => {
  const $api = useNuxtApp().$api as typeof $fetch;

  const list = (
    portfolioId: MaybeRefOrGetter<string>,
    query?: MaybeRefOrGetter<TransactionsQuery | undefined>,
  ) =>
    useFetch<Paginated<Transaction>>(
      () => API_ENDPOINTS.PORTFOLIOS.TRANSACTIONS(toValue(portfolioId)),
      {
        $fetch: $api,
        query: computed(() => toWireQuery(toValue(query))),
        key: computed(() => `portfolios:transactions:${toValue(portfolioId)}`),
      },
    );

  const stats = (portfolioId: MaybeRefOrGetter<string>) =>
    useFetch<TransactionStats>(
      () => API_ENDPOINTS.PORTFOLIOS.TRANSACTIONS_STATS(toValue(portfolioId)),
      {
        $fetch: $api,
        key: computed(() => `portfolios:transactions-stats:${toValue(portfolioId)}`),
      },
    );

  const detail = (
    portfolioId: MaybeRefOrGetter<string>,
    txId: MaybeRefOrGetter<string>,
  ) =>
    useFetch<Transaction>(
      () =>
        API_ENDPOINTS.PORTFOLIOS.TRANSACTION(toValue(portfolioId), toValue(txId)),
      {
        $fetch: $api,
        key: computed(() => `portfolios:transaction:${toValue(portfolioId)}:${toValue(txId)}`),
      },
    );

  const create = (portfolioId: string, payload: CreateTransactionPayload) =>
    $api<Transaction>(API_ENDPOINTS.PORTFOLIOS.TRANSACTIONS(portfolioId), {
      method: 'POST',
      body: payload,
    });

  const update = (
    portfolioId: string,
    txId: string,
    payload: UpdateTransactionPayload,
  ) =>
    $api<Transaction>(
      API_ENDPOINTS.PORTFOLIOS.TRANSACTION(portfolioId, txId),
      { method: 'PUT', body: payload },
    );

  const remove = (portfolioId: string, txId: string) =>
    $api<unknown>(API_ENDPOINTS.PORTFOLIOS.TRANSACTION(portfolioId, txId), {
      method: 'DELETE',
    });

  return {
    list,
    stats,
    detail,
    create,
    update,
    remove,
  };
};
