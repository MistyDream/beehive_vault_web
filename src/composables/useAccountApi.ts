import type { AccountCollection } from '~/types/account';
import type { HouseholdId } from '~/types/household';

export function useAccountApi() {
  const { $api } = useNuxtApp();

  return {
    list: (householdId: HouseholdId) =>
      $api<AccountCollection>(`/households/${householdId}/accounts`),
  };
}
