export function useLocaleFormatters() {
  const { locale } = useI18n();

  const formatQuantity = (value: number): string =>
    new Intl.NumberFormat(locale.value, { maximumFractionDigits: 4 }).format(value);

  const formatPercent = (value: number): string =>
    new Intl.NumberFormat(locale.value, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);

  const formatDate = (iso: string): string =>
    new Intl.DateTimeFormat(locale.value, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));

  return { formatQuantity, formatPercent, formatDate };
}
