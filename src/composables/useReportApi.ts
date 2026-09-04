import type { HouseholdId } from '~/types/household';
import type { NetWorthSummary } from '~/types/report';

export function useReportApi() {
  const { $api } = useNuxtApp();

  return {
    getNetWorthSummary: (householdId: HouseholdId) =>
      $api<NetWorthSummary>(`/households/${householdId}/summary`),
  };
}
