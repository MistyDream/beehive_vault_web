import { describe, expect, it } from 'vitest';

import { getDateInTimeZone } from '~/utils/get-date-in-time-zone';

describe('getDateInTimeZone utility', () => {
  it('uses the household calendar date ahead of UTC', () => {
    expect(
      getDateInTimeZone('Pacific/Kiritimati', new Date('2026-01-31T12:30:00Z')),
    ).toBe('2026-02-01');
  });

  it('uses the household calendar date behind UTC', () => {
    expect(
      getDateInTimeZone('America/Adak', new Date('2026-02-01T01:30:00Z')),
    ).toBe('2026-01-31');
  });
});
