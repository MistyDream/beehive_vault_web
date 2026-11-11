import { defineComponent, h, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';

import CategoriesPage from '~/pages/categories.vue';
import CategoryForm from '~/components/categories/CategoryForm.vue';
import type { Category } from '~/types/category';
import { ApiError } from '~/types/api';

const household = { id: 'household-personal' };
const activeHousehold = ref(household);
const list = vi.fn();
const archive = vi.fn();
const success = vi.fn();
mockNuxtImport('useI18n', () => () => ({ t: (key: string) => key }));
mockNuxtImport('useCategoryApi', () => () => ({ list, archive }));
mockNuxtImport('useActiveHousehold', () => () => ({ activeHousehold }));
mockNuxtImport('useToast', () => () => ({ success }));
enableAutoUnmount(afterEach);

const categories: Category[] = [
  {
    id: 'category-food',
    householdId: household.id,
    name: 'Food',
    kind: 'expense',
    archivedAt: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'category-salary',
    householdId: household.id,
    name: 'Salary',
    kind: 'income',
    archivedAt: null,
    createdAt: '',
    updatedAt: '',
  },
];

const ModalStub = defineComponent({
  props: { modelValue: Boolean },
  setup(props, { slots }) {
    return () =>
      props.modelValue
        ? h('section', [slots.default?.(), slots.footer?.()])
        : null;
  },
});

beforeEach(() => {
  activeHousehold.value = household;
  list.mockReset().mockResolvedValue(categories);
  archive.mockReset().mockResolvedValue(undefined);
  success.mockReset();
  clearNuxtData();
});

async function mountPage() {
  const wrapper = await mountSuspended(CategoriesPage, {
    global: { stubs: { BHModal: ModalStub } },
  });
  await vi.waitFor(() => expect(list).toHaveBeenCalled());
  await flushPromises();
  return wrapper;
}

describe('CategoriesPage', () => {
  it('groups active categories by kind and uses the neutral icon', async () => {
    const wrapper = await mountPage();
    expect(list).toHaveBeenCalledWith(household.id);
    const groups = wrapper.findAll('.categories-page__group');
    expect(groups[0]?.text()).toContain('Food');
    expect(groups[0]?.text()).not.toContain('Salary');
    expect(groups[1]?.text()).toContain('Salary');
    expect(wrapper.findAll('.categories-page__group li > svg')).toHaveLength(2);
  });

  it('shows empty and recoverable error states', async () => {
    list
      .mockRejectedValueOnce(new Error('Connection failed'))
      .mockResolvedValueOnce([]);
    const wrapper = await mountPage();
    expect(wrapper.get('[role="alert"]').text()).toContain(
      'categories.error.load',
    );
    await wrapper.get('[role="alert"] button').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('categories.empty');
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it('refreshes after saving and sends the selected category to the rename form', async () => {
    const wrapper = await mountPage();
    await wrapper
      .get('[aria-label="categories.rename_named"]')
      .trigger('click');
    const form = wrapper.getComponent(CategoryForm);
    expect(form.props('category')).toEqual(categories[0]);
    form.vm.$emit('saved');
    await flushPromises();
    expect(list).toHaveBeenCalledTimes(2);
    expect(wrapper.findComponent(CategoryForm).exists()).toBe(false);
    expect(success).toHaveBeenCalledWith('categories.saved');
  });

  it('requires confirmation and preserves the dialog after an archive failure', async () => {
    archive.mockRejectedValueOnce(
      new ApiError({
        type: 'urn:beehive-vault:problem:category-not-found',
        status: 404,
        title: 'Not found',
        code: 'category_not_found',
      }),
    );
    const wrapper = await mountPage();
    await wrapper
      .get('[aria-label="categories.archive_named"]')
      .trigger('click');
    expect(archive).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('categories.archive_description');
    const confirm = () =>
      wrapper
        .findAll('button')
        .find((button) => button.classes().includes('danger'))!;
    await confirm().trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('categories.error.not_found');
    await confirm().trigger('click');
    await flushPromises();
    expect(archive).toHaveBeenCalledWith(household.id, categories[0]!.id);
    expect(list).toHaveBeenCalledTimes(2);
    expect(success).toHaveBeenCalledWith('categories.archived');
  });

  it('removes the previous household data and closes its form on household change', async () => {
    const wrapper = await mountPage();
    await wrapper.get('.categories-page__header button').trigger('click');
    expect(wrapper.findComponent(CategoryForm).exists()).toBe(true);
    let resolveList!: (value: Category[]) => void;
    list.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveList = resolve;
      }),
    );
    activeHousehold.value = { id: 'household-secondary' };
    await flushPromises();
    expect(wrapper.text()).not.toContain('Food');
    expect(wrapper.text()).not.toContain('Salary');
    expect(wrapper.findComponent(CategoryForm).exists()).toBe(false);
    expect(list).toHaveBeenLastCalledWith('household-secondary');
    resolveList([]);
    await flushPromises();
    expect(wrapper.text()).toContain('categories.empty');
  });
});
