import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';
import { ref } from 'vue';

import App from '~/app.vue';
import { ACTIVE_HOUSEHOLD_STATUS } from '~/constants/household';
import type { Household } from '~/types/household';

const { activate, create, initialize, status } = vi.hoisted(() => ({
  activate: vi.fn(),
  create: vi.fn(),
  initialize: vi.fn(),
  status: {
    __v_isRef: true,
    value: 'idle',
  },
}));

const households: Household[] = [
  {
    id: 'household-personal',
    name: 'Personal household',
    baseCurrency: 'EUR',
    timezone: 'Europe/Paris',
    createdAt: '2026-09-03T08:00:00Z',
    updatedAt: '2026-09-03T08:00:00Z',
  },
  {
    id: 'household-rental',
    name: 'Rental project',
    baseCurrency: 'USD',
    timezone: 'America/New_York',
    createdAt: '2026-09-03T09:00:00Z',
    updatedAt: '2026-09-03T09:00:00Z',
  },
];

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useLocalePath', () => () => (path: string) => path);
mockNuxtImport('useHouseholdApi', () => () => ({ create }));
mockNuxtImport('useActiveHousehold', () => () => ({
  status,
  households: ref(households),
  activeHousehold: ref(null),
  error: ref(null),
  initialize,
  activate,
}));

enableAutoUnmount(afterEach);

describe('active household app flow', () => {
  beforeEach(() => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.IDLE;
    activate.mockReset();
    create.mockReset();
    initialize.mockReset();
  });

  it('shows the initial creation screen when no household exists', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION;

    const wrapper = await mountSuspended(App);

    expect(wrapper.find('.household-creation-screen').exists()).toBe(true);
    expect(wrapper.find('.household-selection-screen').exists()).toBe(false);
    expect(wrapper.find('button[type="button"]').exists()).toBe(false);
  });

  it('shows the household choices when selection is required', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION;

    const wrapper = await mountSuspended(App);

    expect(wrapper.findAll('.household-selection-screen__choice')).toHaveLength(
      2,
    );
    expect(wrapper.text()).toContain('Personal household');
    expect(wrapper.text()).toContain('Rental project');
  });

  it('opens and cancels additional household creation', async () => {
    status.value = ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION;
    const wrapper = await mountSuspended(App);

    await wrapper.get('.household-selection-screen__create').trigger('click');

    expect(wrapper.find('.household-selection-screen').exists()).toBe(false);
    expect(wrapper.find('.household-creation-screen').exists()).toBe(true);

    const buttons = wrapper.findAll('button[type="button"]');
    expect(buttons).toHaveLength(1);

    await buttons[0]?.trigger('click');

    expect(wrapper.find('.household-selection-screen').exists()).toBe(true);
    expect(wrapper.find('.household-creation-screen').exists()).toBe(false);
  });
});
