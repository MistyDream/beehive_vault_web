import type { TimeZoneId } from '~/types/household';
import type { MonthString } from '~/types/http';

export function getMonthInTimeZone(
  timeZone: TimeZoneId,
  instant = new Date(),
): MonthString {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(instant);
  const year = parts.find(({ type }) => type === 'year')?.value;
  const month = parts.find(({ type }) => type === 'month')?.value;

  if (!year || !month) {
    throw new Error('Unable to determine the calendar month');
  }

  return `${year}-${month}`;
}
