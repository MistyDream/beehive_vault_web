import type { HouseholdId } from '~/types/household';
import type { OperationPage } from '~/types/operation';
import type { TransactionListFilters } from '~/types/transaction';

export function useTransactionApi() {
  const { $api } = useNuxtApp();

  return {
    list: (householdId: HouseholdId, filters: TransactionListFilters = {}) =>
      $api<OperationPage>(`/households/${householdId}/transactions`, {
        query: filters,
      }),
  };
}
