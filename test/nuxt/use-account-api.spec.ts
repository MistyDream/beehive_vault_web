import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';

import { useAccountApi } from '~/composables/useAccountApi';
import type { AccountCollection } from '~/types/account';

const collection: AccountCollection = {
  items: [],
  totals: {
    daily: '0',
    savings: '0',
    liabilities: '0',
  },
};

registerEndpoint(
  '/api/households/household-personal/accounts',
  () => collection,
);

describe('useAccountApi', () => {
  it('loads the active accounts for a household', async () => {
    const result = await useAccountApi().list('household-personal');

    expect(result).toEqual(collection);
  });
});
