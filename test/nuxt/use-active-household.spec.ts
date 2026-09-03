import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { clearNuxtState, defineComponent } from '#imports';

import {
  ACTIVE_HOUSEHOLD_STATUS,
  ACTIVE_HOUSEHOLD_STORAGE_KEY,
} from '~/constants/household';
import type { Household } from '~/types/household';

const listHouseholds = vi.fn<() => Promise<Household[]>>();

mockNuxtImport('useHouseholdApi', () => () => ({
  list: listHouseholds,
}));

const personalHousehold = createHousehold('household-personal', 'Personal');
const sharedHousehold = createHousehold('household-shared', 'Shared');

describe('useActiveHousehold', () => {
  beforeEach(() => {
    clearNuxtState();
    localStorage.clear();
    listHouseholds.mockReset();
  });

  it('hides any active context while the collection is loading', async () => {
    let resolveList!: (households: Household[]) => void;
    listHouseholds.mockReturnValue(
      new Promise((resolve) => {
        resolveList = resolve;
      }),
    );
    const context = await mountContext();

    const initialization = context.initialize();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.LOADING);
    expect(context.activeHousehold.value).toBeNull();

    resolveList([personalHousehold]);
    await initialization;
  });

  it('loads and persists the only household', async () => {
    listHouseholds.mockResolvedValue([personalHousehold]);
    const context = await mountContext();

    await context.initialize();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.READY);
    expect(context.activeHousehold.value).toEqual(personalHousehold);
    expect(localStorage.getItem(ACTIVE_HOUSEHOLD_STORAGE_KEY)).toBe(
      personalHousehold.id,
    );
  });

  it('requires creation and clears obsolete persistence for an empty collection', async () => {
    localStorage.setItem(ACTIVE_HOUSEHOLD_STORAGE_KEY, 'household-obsolete');
    listHouseholds.mockResolvedValue([]);
    const context = await mountContext();

    await context.initialize();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION);
    expect(context.activeHousehold.value).toBeNull();
    expect(localStorage.getItem(ACTIVE_HOUSEHOLD_STORAGE_KEY)).toBeNull();
  });

  it('requires selection and clears an invalid stored household', async () => {
    localStorage.setItem(ACTIVE_HOUSEHOLD_STORAGE_KEY, 'household-obsolete');
    listHouseholds.mockResolvedValue([personalHousehold, sharedHousehold]);
    const context = await mountContext();

    await context.initialize();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION);
    expect(context.households.value).toEqual([
      personalHousehold,
      sharedHousehold,
    ]);
    expect(localStorage.getItem(ACTIVE_HOUSEHOLD_STORAGE_KEY)).toBeNull();
  });

  it('preserves persistence when loading fails so a retry can restore it', async () => {
    const failure = new Error('Network unavailable');
    localStorage.setItem(ACTIVE_HOUSEHOLD_STORAGE_KEY, sharedHousehold.id);
    listHouseholds.mockRejectedValue(failure);
    const context = await mountContext();

    await context.initialize();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.ERROR);
    expect(context.error.value).toBe(failure);
    expect(localStorage.getItem(ACTIVE_HOUSEHOLD_STORAGE_KEY)).toBe(
      sharedHousehold.id,
    );
  });

  it('activates and persists a newly created household', async () => {
    listHouseholds.mockResolvedValue([]);
    const context = await mountContext();
    await context.initialize();

    context.activate(personalHousehold);

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.READY);
    expect(context.activeHousehold.value).toEqual(personalHousehold);
    expect(context.households.value).toEqual([personalHousehold]);
    expect(localStorage.getItem(ACTIVE_HOUSEHOLD_STORAGE_KEY)).toBe(
      personalHousehold.id,
    );
  });

  it('opens and cancels explicit household selection without losing context', async () => {
    localStorage.setItem(ACTIVE_HOUSEHOLD_STORAGE_KEY, personalHousehold.id);
    listHouseholds.mockResolvedValue([personalHousehold, sharedHousehold]);
    const context = await mountContext();
    await context.initialize();

    context.startSelection();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION);
    expect(context.activeHousehold.value).toEqual(personalHousehold);
    expect(localStorage.getItem(ACTIVE_HOUSEHOLD_STORAGE_KEY)).toBe(
      personalHousehold.id,
    );

    context.cancelSelection();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.READY);
    expect(context.activeHousehold.value).toEqual(personalHousehold);
  });

  it('opens and cancels additional household creation without losing context', async () => {
    listHouseholds.mockResolvedValue([personalHousehold]);
    const context = await mountContext();
    await context.initialize();

    context.startCreation();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION);
    expect(context.activeHousehold.value).toEqual(personalHousehold);

    context.cancelCreation();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.READY);
    expect(context.activeHousehold.value).toEqual(personalHousehold);
  });

  it('does not cancel initial selection without an active household', async () => {
    listHouseholds.mockResolvedValue([personalHousehold, sharedHousehold]);
    const context = await mountContext();
    await context.initialize();

    context.cancelSelection();

    expect(context.status.value).toBe(ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION);
    expect(context.activeHousehold.value).toBeNull();
  });
});

async function mountContext() {
  const wrapper = await mountSuspended(
    defineComponent({
      setup() {
        return { context: useActiveHousehold() };
      },
      template: '<div />',
    }),
  );

  return wrapper.vm.context as ReturnType<typeof useActiveHousehold>;
}

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
