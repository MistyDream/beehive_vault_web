import type { TimeZoneId } from '~/types/household';
import type { DateString } from '~/types/http';

export function getDateInTimeZone(
  timeZone: TimeZoneId,
  instant = new Date(),
): DateString {
  const parts = new Intl.DateTimeFormat('en', {
    calendar: 'iso8601',
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const year = parts.find(({ type }) => type === 'year')?.value;
  const month = parts.find(({ type }) => type === 'month')?.value;
  const day = parts.find(({ type }) => type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Unable to determine the calendar date');
  }

  return `${year}-${month}-${day}`;
}
