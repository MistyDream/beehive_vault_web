import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';
import { nextTick, readonly, ref } from 'vue';

import { ActiveHouseholdGate } from '#components';
import { ACTIVE_HOUSEHOLD_STATUS } from '~/constants/household';
import type { Household } from '~/types/household';

const status = ref(ACTIVE_HOUSEHOLD_STATUS.IDLE);
const households = ref<Household[]>([]);
const initialize = vi.fn<() => Promise<void>>();

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
}));

mockNuxtImport('useActiveHousehold', () => () => ({
  status: readonly(status),
  households: readonly(households),
  initialize,
}));

enableAutoUnmount(afterEach);

describe('ActiveHouseholdGate', () => {
  beforeEach(() => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.IDLE;
    households.value = [];
    initialize.mockReset();
    initialize.mockResolvedValue();
  });

  it('initializes the household context when mounted', async () => {
    await mountGate();

    expect(initialize).toHaveBeenCalledTimes(1);
  });

  it('announces loading without exposing application content', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.LOADING;

    const wrapper = await mountGate();
    const loading = wrapper.get('.active-household-gate__loading');

    expect(loading.attributes('role')).toBe('status');
    expect(loading.text()).toContain('household.loading');
    expect(wrapper.find('.application-content').exists()).toBe(false);
  });

  it('shows a full-screen error and retries initialization', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.ERROR;

    const wrapper = await mountGate();
    const error = wrapper.get('.active-household-gate__error');

    expect(error.attributes('role')).toBe('alert');
    expect(error.text()).toContain('household.load_error_title');
    expect(error.text()).toContain('household.load_error_description');

    await error.get('button').trigger('click');

    expect(initialize).toHaveBeenCalledTimes(2);
  });

  it('moves focus to the error title when loading fails', async () => {
    const focus = vi
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);
    status.value = ACTIVE_HOUSEHOLD_STATUS.LOADING;
    const wrapper = await mountGate();

    focus.mockClear();
    status.value = ACTIVE_HOUSEHOLD_STATUS.ERROR;
    await nextTick();
    await nextTick();

    const title = wrapper.get('h1');

    expect(title.attributes('tabindex')).toBe('-1');
    expect(focus).toHaveBeenCalledOnce();
    expect(focus.mock.instances[0]).toBe(title.element);

    focus.mockRestore();
  });

  it('renders the creation slot when no household exists', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION;

    const wrapper = await mountGate();

    expect(wrapper.get('.creation-state').text()).toBe('Create household');
    expect(wrapper.find('.application-content').exists()).toBe(false);
  });

  it('provides households to the selection slot', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION;
    households.value = [createHousehold('household-personal', 'Personal')];

    const wrapper = await mountGate();

    expect(wrapper.get('.selection-state').text()).toBe('Personal');
    expect(wrapper.find('.application-content').exists()).toBe(false);
  });

  it('renders application content only when a household is ready', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.READY;

    const wrapper = await mountGate();

    expect(wrapper.get('.application-content').text()).toBe('Application');
    expect(wrapper.find('.creation-state').exists()).toBe(false);
    expect(wrapper.find('.selection-state').exists()).toBe(false);
  });
});

function mountGate() {
  return mountSuspended(ActiveHouseholdGate, {
    slots: {
      default: '<div class="application-content">Application</div>',
      creation: '<div class="creation-state">Create household</div>',
      selection:
        '<div class="selection-state">{{ params.households[0]?.name }}</div>',
    },
  });
}

function createHousehold(id: string, name: string): Household {
  return {
    id,
    name,
    baseCurrency: 'EUR',
    timezone: 'Europe/Paris',
    createdAt: '2026-09-03T08:00:00Z',
    updatedAt: '2026-09-03T08:00:00Z',
  };
}
