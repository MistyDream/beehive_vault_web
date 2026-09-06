import type {
  Account,
  AccountCollection,
  AccountId,
  Balance,
  CreateAccountRequest,
} from '~/types/account';
import type { HouseholdId } from '~/types/household';

export function useAccountApi() {
  const { $api } = useNuxtApp();

  return {
    list: (householdId: HouseholdId) =>
      $api<AccountCollection>(`/households/${householdId}/accounts`),
    get: (householdId: HouseholdId, accountId: AccountId) =>
      $api<Account>(`/households/${householdId}/accounts/${accountId}`),
    listBalances: (householdId: HouseholdId, accountId: AccountId) =>
      $api<Balance[]>(
        `/households/${householdId}/accounts/${accountId}/balances`,
      ),
    create: (householdId: HouseholdId, request: CreateAccountRequest) =>
      $api<Account>(`/households/${householdId}/accounts`, {
        method: 'POST',
        body: request,
      }),
  };
}
