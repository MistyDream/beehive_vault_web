import type { HouseholdId } from '~/types/household';
import type { MonthString } from '~/types/http';
import type { MonthlyFlowReport, NetWorthSummary } from '~/types/report';

export function useReportApi() {
  const { $api } = useNuxtApp();

  return {
    getNetWorthSummary: (householdId: HouseholdId) =>
      $api<NetWorthSummary>(`/households/${householdId}/summary`),
    getMonthlyFlowReport: (householdId: HouseholdId, month: MonthString) =>
      $api<MonthlyFlowReport>(
        `/households/${householdId}/monthly-flows/${month}`,
      ),
  };
}
