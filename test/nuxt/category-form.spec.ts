import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';

import CategoryForm from '~/components/categories/CategoryForm.vue';
import { ApiError } from '~/types/api';
import type { Category } from '~/types/category';

const create = vi.fn();
const update = vi.fn();
mockNuxtImport('useI18n', () => () => ({ t: (key: string) => key }));
mockNuxtImport('useCategoryApi', () => () => ({ create, update }));
enableAutoUnmount(afterEach);

const category: Category = {
  id: 'category-food',
  householdId: 'household-personal',
  name: 'Food',
  kind: 'expense',
  archivedAt: null,
  createdAt: '2026-09-01T08:00:00Z',
  updatedAt: '2026-09-01T08:00:00Z',
};

beforeEach(() => {
  create.mockReset().mockResolvedValue(category);
  update.mockReset().mockResolvedValue(category);
});

describe('CategoryForm', () => {
  it('creates a category with a trimmed name and explicit kind', async () => {
    const wrapper = await mountSuspended(CategoryForm, {
      props: { householdId: category.householdId },
    });
    await wrapper.get('#category-name').setValue('  Salary  ');
    await wrapper.get('#category-kind').setValue('income');
    await wrapper.get('form').trigger('submit');
    await flushPromises();
    expect(create).toHaveBeenCalledWith(category.householdId, {
      name: 'Salary',
      kind: 'income',
    });
    expect(wrapper.emitted('saved')).toHaveLength(1);
  });

  it('renames a category without sending or exposing a kind change', async () => {
    const wrapper = await mountSuspended(CategoryForm, {
      props: { householdId: category.householdId, category },
    });
    expect(wrapper.find('#category-kind').exists()).toBe(false);
    await wrapper.get('#category-name').setValue('Groceries');
    await wrapper.get('form').trigger('submit');
    await flushPromises();
    expect(update).toHaveBeenCalledWith(category.householdId, category.id, {
      name: 'Groceries',
    });
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects empty or excessive names before sending a request', async () => {
    const wrapper = await mountSuspended(CategoryForm, {
      props: { householdId: category.householdId },
    });
    for (const name of ['   ', 'x'.repeat(101)]) {
      await wrapper.get('#category-name').setValue(name);
      await wrapper.get('form').trigger('submit');
      expect(wrapper.get('#category-name').attributes('aria-invalid')).toBe(
        'true',
      );
    }
    expect(create).not.toHaveBeenCalled();
  });

  it('uses the duplicate code and preserves the entered name for retry', async () => {
    create.mockRejectedValueOnce(
      new ApiError({
        type: 'urn:beehive-vault:problem:duplicate-category-name',
        title: 'Technical title',
        detail: 'Untranslated internal message',
        status: 409,
        code: 'duplicate_category_name',
      }),
    );
    const wrapper = await mountSuspended(CategoryForm, {
      props: { householdId: category.householdId },
    });
    await wrapper.get('#category-name').setValue('Food');
    await wrapper.get('form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('categories.error.duplicate_name');
    expect(wrapper.text()).not.toContain('Untranslated internal message');
    expect(wrapper.get('#category-name').element).toHaveProperty(
      'value',
      'Food',
    );
    expect(wrapper.emitted('saved')).toBeUndefined();
    await wrapper.get('form').trigger('submit');
    await flushPromises();
    expect(wrapper.emitted('saved')).toHaveLength(1);
  });

  it('maps name validation and prevents repeated submission while pending', async () => {
    let rejectRequest!: (reason: unknown) => void;
    create.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectRequest = reject;
      }),
    );
    const wrapper = await mountSuspended(CategoryForm, {
      props: { householdId: category.householdId },
    });
    await wrapper.get('#category-name').setValue('Food');
    await wrapper.get('form').trigger('submit');
    await wrapper.get('form').trigger('submit');
    expect(create).toHaveBeenCalledTimes(1);
    expect(wrapper.get('#category-name').attributes('disabled')).toBeDefined();
    rejectRequest(
      new ApiError({
        type: 'urn:beehive-vault:problem:validation-error',
        title: 'Validation error',
        status: 422,
        code: 'validation_error',
        errors: [
          {
            location: 'body',
            pointer: '#/name',
            code: 'invalid_length',
            detail: 'Internal description',
          },
        ],
      }),
    );
    await flushPromises();
    expect(wrapper.get('#category-name').attributes('aria-invalid')).toBe(
      'true',
    );
    expect(
      wrapper.get('#category-name').attributes('disabled'),
    ).toBeUndefined();
  });
});
