export function useLocaleFormatters() {
  const { locale } = useI18n();

  const quantityFmt = computed(
    () => new Intl.NumberFormat(locale.value, { maximumFractionDigits: 4 }),
  );
  const percentFmt = computed(
    () =>
      new Intl.NumberFormat(locale.value, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
  );
  const dateFmt = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  );
  const relativeFmt = computed(
    () => new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }),
  );

  const formatQuantity = (value: number) => quantityFmt.value.format(value);
  const formatPercent = (value: number) => percentFmt.value.format(value);
  const formatDate = (iso: string) => dateFmt.value.format(new Date(iso));

  const relativeUnits: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  const formatRelative = (iso: string, fromMs = Date.now()) => {
    const diffSeconds = Math.round((new Date(iso).getTime() - fromMs) / 1000);
    for (const [unit, seconds] of relativeUnits) {
      if (Math.abs(diffSeconds) >= seconds || unit === 'second') {
        return relativeFmt.value.format(Math.round(diffSeconds / seconds), unit);
      }
    }
    return relativeFmt.value.format(0, 'second');
  };

  return { formatQuantity, formatPercent, formatDate, formatRelative };
}
