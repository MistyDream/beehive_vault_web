import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';

import { HouseholdSelectionScreen } from '#components';
import type { Household } from '~/types/household';

const { activate, navigateTo } = vi.hoisted(() => ({
  activate: vi.fn(),
  navigateTo: vi.fn(),
}));

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
mockNuxtImport('useLocalePath', () => () => (path: string) => `/en${path}`);
mockNuxtImport('useActiveHousehold', () => () => ({ activate }));
mockNuxtImport('navigateTo', () => navigateTo);

enableAutoUnmount(afterEach);

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

describe('HouseholdSelectionScreen', () => {
  beforeEach(() => {
    activate.mockReset();
    navigateTo.mockReset();
    navigateTo.mockResolvedValue(undefined);
  });

  it('renders every household as a named action', async () => {
    const wrapper = await mountSuspended(HouseholdSelectionScreen, {
      props: { households },
    });
    const choices = wrapper.findAll('.household-selection-screen__choice');

    expect(choices).toHaveLength(2);
    expect(choices[0]?.text()).toContain('Personal household');
    expect(choices[0]?.text()).toContain('EUR · Europe/Paris');
    expect(choices[1]?.text()).toContain('Rental project');
    expect(choices[1]?.text()).toContain('USD · America/New_York');
  });

  it('identifies the last-used household with visible text', async () => {
    const wrapper = await mountSuspended(HouseholdSelectionScreen, {
      props: {
        households,
        lastUsedHouseholdId: 'household-rental',
      },
    });
    const choices = wrapper.findAll('.household-selection-screen__choice');

    expect(choices[0]?.text()).not.toContain('household.selection.last_used');
    expect(choices[1]?.text()).toContain('household.selection.last_used');
  });

  it('activates the selected household and opens the overview', async () => {
    const wrapper = await mountSuspended(HouseholdSelectionScreen, {
      props: { households },
    });

    await wrapper
      .findAll('.household-selection-screen__choice')[1]
      ?.trigger('click');
    await flushPromises();

    expect(activate).toHaveBeenCalledWith(households[1]);
    expect(wrapper.emitted('selected')).toEqual([[households[1]]]);
    expect(navigateTo).toHaveBeenCalledWith('/en/');
  });

  it('requests creation of another household', async () => {
    const wrapper = await mountSuspended(HouseholdSelectionScreen, {
      props: { households },
    });

    await wrapper.get('.household-selection-screen__create').trigger('click');

    expect(wrapper.emitted('create')).toHaveLength(1);
  });

  it('moves focus to the title when it opens', async () => {
    const focus = vi
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);

    const wrapper = await mountSuspended(HouseholdSelectionScreen, {
      props: { households },
    });
    const title = wrapper.get('h1');

    expect(title.attributes('tabindex')).toBe('-1');
    expect(focus).toHaveBeenCalledOnce();
    expect(focus.mock.instances[0]).toBe(title.element);

    focus.mockRestore();
  });
});
