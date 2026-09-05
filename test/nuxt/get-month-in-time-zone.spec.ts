import { describe, expect, it } from 'vitest';

import { getMonthInTimeZone } from '~/utils/get-month-in-time-zone';

describe('getMonthInTimeZone', () => {
  it('uses the household time zone at a month boundary', () => {
    const instant = new Date('2026-09-01T00:30:00Z');

    expect(getMonthInTimeZone('Europe/Paris', instant)).toBe('2026-09');
    expect(getMonthInTimeZone('America/New_York', instant)).toBe('2026-08');
  });

  it('handles a year boundary independently from the device time zone', () => {
    const instant = new Date('2026-12-31T10:30:00Z');

    expect(getMonthInTimeZone('Pacific/Kiritimati', instant)).toBe('2027-01');
  });
});
