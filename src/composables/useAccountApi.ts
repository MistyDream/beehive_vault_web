import type {
  Account,
  AccountCollection,
  AccountId,
  AccountListFilters,
  Balance,
  BalanceId,
  CreateAccountRequest,
  CreateBalanceRequest,
  UpdateAccountRequest,
  UpdateBalanceRequest,
} from '~/types/account';
import type { HouseholdId } from '~/types/household';

export function useAccountApi() {
  const { $api } = useNuxtApp();

  return {
    list: (householdId: HouseholdId, filters: AccountListFilters = {}) =>
      $api<AccountCollection>(`/households/${householdId}/accounts`, {
        query: filters,
      }),
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
    archive: (householdId: HouseholdId, accountId: AccountId) =>
      $api<undefined>(`/households/${householdId}/accounts/${accountId}`, {
        method: 'DELETE',
      }),
    restore: (householdId: HouseholdId, accountId: AccountId) =>
      $api<Account>(
        `/households/${householdId}/accounts/${accountId}/restore`,
        {
          method: 'POST',
        },
      ),
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
    updateBalance: (
      householdId: HouseholdId,
      accountId: AccountId,
      balanceId: BalanceId,
      request: UpdateBalanceRequest,
    ) =>
      $api<Balance>(
        `/households/${householdId}/accounts/${accountId}/balances/${balanceId}`,
        { method: 'PATCH', body: request },
      ),
  };
}
