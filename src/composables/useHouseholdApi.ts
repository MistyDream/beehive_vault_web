import type {
  CreateHouseholdRequest,
  Household,
  HouseholdId,
} from '~/types/household';

export function useHouseholdApi() {
  const { $api } = useNuxtApp();

  return {
    list: () => $api<Household[]>('/households'),
    get: (householdId: HouseholdId) =>
      $api<Household>(`/households/${householdId}`),
    create: (request: CreateHouseholdRequest) =>
      $api<Household>('/households', {
        method: 'POST',
        body: request,
      }),
  };
}
