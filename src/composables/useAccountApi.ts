import type {
  Account,
  AccountCollection,
  CreateAccountRequest,
} from '~/types/account';
import type { HouseholdId } from '~/types/household';

export function useAccountApi() {
  const { $api } = useNuxtApp();

  return {
    list: (householdId: HouseholdId) =>
      $api<AccountCollection>(`/households/${householdId}/accounts`),
    create: (householdId: HouseholdId, request: CreateAccountRequest) =>
      $api<Account>(`/households/${householdId}/accounts`, {
        method: 'POST',
        body: request,
      }),
  };
}
