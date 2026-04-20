/**
 * Consolidates the three fetches needed across the portfolio detail view
 * (detail, summary, performance). Multiple call sites for the same id
 * share state via Nuxt's URL-based asyncData key — no duplicate requests.
 */
export function usePortfolioDetail(id: MaybeRefOrGetter<number>) {
  const { detail, summary, performance } = usePortfolioApi();

  const detailResult = detail(id);
  const summaryResult = summary(id);
  const performanceResult = performance(id);

  return {
    portfolio: detailResult.data,
    summary: summaryResult.data,
    performance: performanceResult.data,
    detailPending: detailResult.pending,
    summaryPending: summaryResult.pending,
    performancePending: performanceResult.pending,
    detailError: detailResult.error,
    refresh: () =>
      Promise.all([
        detailResult.refresh(),
        summaryResult.refresh(),
        performanceResult.refresh(),
      ]),
  };
}
