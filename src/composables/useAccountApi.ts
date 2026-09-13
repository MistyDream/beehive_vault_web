import type {
  Account,
  AccountCollection,
  AccountId,
  Balance,
  CreateAccountRequest,
  CreateBalanceRequest,
  UpdateAccountRequest,
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
    update: (
      householdId: HouseholdId,
      accountId: AccountId,
      request: UpdateAccountRequest,
    ) =>
      $api<Account>(`/households/${householdId}/accounts/${accountId}`, {
        method: 'PATCH',
        body: request,
      }),
    createBalance: (
      householdId: HouseholdId,
      accountId: AccountId,
      request: CreateBalanceRequest,
    ) =>
      $api<Balance>(
        `/households/${householdId}/accounts/${accountId}/balances`,
        {
          method: 'POST',
          body: request,
        },
      ),
  };
}
