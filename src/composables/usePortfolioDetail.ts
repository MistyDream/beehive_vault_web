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
