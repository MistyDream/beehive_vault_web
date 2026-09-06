import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { getQuery } from 'h3';

import { useTransactionApi } from '~/composables/useTransactionApi';
import type { OperationPage } from '~/types/operation';

const operations: OperationPage = {
  items: [],
  page: 1,
  limit: 5,
  total: 0,
};

let receivedQuery: ReturnType<typeof getQuery>;

registerEndpoint('/api/households/household-personal/transactions', {
  method: 'GET',
  handler: (event) => {
    receivedQuery = getQuery(event);
    return operations;
  },
});

describe('useTransactionApi', () => {
  it('loads filtered operations without changing their monetary values', async () => {
    const result = await useTransactionApi().list('household-personal', {
      accountId: 'account-checking',
      page: 1,
      limit: 5,
    });

    expect(receivedQuery).toEqual({
      accountId: 'account-checking',
      page: '1',
      limit: '5',
    });
    expect(result).toEqual(operations);
  });
});
