import { describe, expect, it } from 'vitest';

import { ACTIVE_HOUSEHOLD_STATUS } from '../../src/constants/household';
import type { Household } from '../../src/types/household';
import { resolveActiveHousehold } from '../../src/utils/resolve-active-household';

const personalHousehold = createHousehold('household-personal', 'Personal');
const sharedHousehold = createHousehold('household-shared', 'Shared');

describe('resolveActiveHousehold', () => {
  it('requires creation when no household exists', () => {
    expect(resolveActiveHousehold([], null)).toEqual({
      status: ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION,
    });
  });

  it('automatically activates the only household', () => {
    expect(resolveActiveHousehold([personalHousehold], null)).toEqual({
      status: ACTIVE_HOUSEHOLD_STATUS.READY,
      household: personalHousehold,
    });
  });

  it('ignores an obsolete stored identifier when only one household exists', () => {
    expect(
      resolveActiveHousehold([personalHousehold], 'household-obsolete'),
    ).toEqual({
      status: ACTIVE_HOUSEHOLD_STATUS.READY,
      household: personalHousehold,
    });
  });

  it('restores a stored household from a collection', () => {
    expect(
      resolveActiveHousehold(
        [personalHousehold, sharedHousehold],
        sharedHousehold.id,
      ),
    ).toEqual({
      status: ACTIVE_HOUSEHOLD_STATUS.READY,
      household: sharedHousehold,
    });
  });

  it('requires selection when no stored identifier belongs to the collection', () => {
    expect(
      resolveActiveHousehold(
        [personalHousehold, sharedHousehold],
        'household-obsolete',
      ),
    ).toEqual({ status: ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION });
  });
});

function createHousehold(id: string, name: string): Household {
  return {
    id,
    name,
    baseCurrency: 'EUR',
    timezone: 'Europe/Paris',
    createdAt: '2026-09-02T08:00:00Z',
    updatedAt: '2026-09-02T08:00:00Z',
  };
}
