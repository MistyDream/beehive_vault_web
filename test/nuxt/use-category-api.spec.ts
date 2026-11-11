import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { readBody } from 'h3';

import { useCategoryApi } from '~/composables/useCategoryApi';

const category = {
  id: 'category-food',
  householdId: 'household-personal',
  name: 'Food',
  kind: 'expense',
  archivedAt: null,
  createdAt: '',
  updatedAt: '',
};
const requests: unknown[] = [];
registerEndpoint('/api/households/household-personal/categories', () => [
  category,
]);
registerEndpoint('/api/households/household-personal/categories', {
  method: 'POST',
  handler: async (event) => {
    requests.push(await readBody(event));
    return category;
  },
});
registerEndpoint(
  '/api/households/household-personal/categories/category-food',
  {
    method: 'PATCH',
    handler: async (event) => {
      requests.push(await readBody(event));
      return category;
    },
  },
);
registerEndpoint(
  '/api/households/household-personal/categories/category-food',
  {
    method: 'DELETE',
    handler: () => null,
  },
);

describe('useCategoryApi', () => {
  it('uses the same-origin API for household-scoped category operations', async () => {
    const api = useCategoryApi();
    expect(await api.list(category.householdId)).toEqual([category]);
    expect(
      await api.create(category.householdId, { name: 'Food', kind: 'expense' }),
    ).toEqual(category);
    expect(
      await api.update(category.householdId, category.id, {
        name: 'Groceries',
      }),
    ).toEqual(category);
    await api.archive(category.householdId, category.id);
    expect(requests).toEqual([
      { name: 'Food', kind: 'expense' },
      { name: 'Groceries' },
    ]);
  });
});
