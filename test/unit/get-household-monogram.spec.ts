import { describe, expect, it } from 'vitest';

import { getHouseholdMonogram } from '../../src/utils/get-household-monogram';

describe('getHouseholdMonogram', () => {
  it('uses the first character of the first two words', () => {
    expect(getHouseholdMonogram('Personal household', 'en')).toBe('PH');
  });

  it('uses the first two characters of a single word', () => {
    expect(getHouseholdMonogram('Épargne', 'fr')).toBe('ÉP');
  });

  it('ignores surrounding and repeated spaces', () => {
    expect(getHouseholdMonogram('  Rental   project  ', 'en')).toBe('RP');
  });

  it('returns an empty monogram for an empty name', () => {
    expect(getHouseholdMonogram('   ', 'en')).toBe('');
  });
});
