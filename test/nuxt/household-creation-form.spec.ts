import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';

import { HouseholdCreationForm } from '#components';
import { ApiError } from '~/types/api';
import type { Household } from '~/types/household';

const create = vi.fn();
const activate = vi.fn();

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

mockNuxtImport('useHouseholdApi', () => () => ({ create }));
mockNuxtImport('useActiveHousehold', () => () => ({ activate }));

enableAutoUnmount(afterEach);

const createdHousehold: Household = {
  id: 'household-personal',
  name: 'Personal household',
  baseCurrency: 'EUR',
  timezone: 'Europe/Paris',
  createdAt: '2026-09-03T08:00:00Z',
  updatedAt: '2026-09-03T08:00:00Z',
};

describe('HouseholdCreationForm', () => {
  beforeEach(() => {
    create.mockReset();
    activate.mockReset();
  });

  it('prefills the base currency and detected time zone', async () => {
    const wrapper = await mountSuspended(HouseholdCreationForm);

    expect(wrapper.get('#household-currency').element).toHaveProperty(
      'value',
      'EUR',
    );
    expect(wrapper.get('#household-timezone').element).toHaveProperty(
      'value',
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    );
  });

  it('moves focus to the form title when it opens', async () => {
    const focus = vi
      .spyOn(HTMLElement.prototype, 'focus')
      .mockImplementation(() => undefined);

    const wrapper = await mountSuspended(HouseholdCreationForm);
    const title = wrapper.get('h1');

    expect(title.attributes('tabindex')).toBe('-1');
    expect(focus).toHaveBeenCalledOnce();
    expect(focus.mock.instances[0]).toBe(title.element);

    focus.mockRestore();
  });

  it('creates and activates a household with normalized values', async () => {
    create.mockResolvedValue(createdHousehold);
    const wrapper = await mountSuspended(HouseholdCreationForm);

    await wrapper.get('#household-name').setValue('  Personal household  ');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(create).toHaveBeenCalledWith({
      name: 'Personal household',
      baseCurrency: 'EUR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    });
    expect(activate).toHaveBeenCalledWith(createdHousehold);
    expect(wrapper.emitted('created')).toEqual([[createdHousehold]]);
  });

  it('prevents submission and exposes a field error for a blank name', async () => {
    const wrapper = await mountSuspended(HouseholdCreationForm);

    await wrapper.get('form').trigger('submit');

    expect(create).not.toHaveBeenCalled();
    expect(wrapper.get('#household-name').attributes('aria-invalid')).toBe(
      'true',
    );
    expect(wrapper.get('#household-name-error').text()).toBe(
      'household.creation.error.name_required',
    );
  });

  it('maps stable API field codes and pointers without displaying API detail', async () => {
    create.mockRejectedValue(
      new ApiError({
        type: 'urn:beehive-vault:problem:validation-error',
        title: 'Request validation failed',
        status: 422,
        code: 'validation_error',
        detail: 'Untranslated API detail',
        errors: [
          {
            location: 'body',
            pointer: '#/timezone',
            code: 'invalid_timezone',
            detail: 'Untranslated field detail',
          },
        ],
      }),
    );
    const wrapper = await mountSuspended(HouseholdCreationForm);

    await wrapper.get('#household-name').setValue('Personal household');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('#household-timezone-error').text()).toBe(
      'household.creation.error.timezone_invalid',
    );
    expect(wrapper.text()).not.toContain('Untranslated');
  });

  it('falls back to a generic error for an unknown API field code', async () => {
    create.mockRejectedValue(
      new ApiError({
        type: 'urn:beehive-vault:problem:validation-error',
        title: 'Request validation failed',
        status: 422,
        code: 'validation_error',
        errors: [
          {
            location: 'body',
            pointer: '#/timezone',
            code: 'unknown_code',
            detail: 'Untranslated field detail',
          },
        ],
      }),
    );
    const wrapper = await mountSuspended(HouseholdCreationForm);

    await wrapper.get('#household-name').setValue('Personal household');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toBe(
      'household.creation.error.generic',
    );
    expect(wrapper.text()).not.toContain('Untranslated');
  });

  it('keeps values and allows retry after a network failure', async () => {
    create.mockRejectedValueOnce(new Error('Network unavailable'));
    const wrapper = await mountSuspended(HouseholdCreationForm);

    await wrapper.get('#household-name').setValue('Personal household');
    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('#household-name').element).toHaveProperty(
      'value',
      'Personal household',
    );
    expect(wrapper.get('[role="alert"]').text()).toBe(
      'household.creation.error.generic',
    );
    expect(
      wrapper.get('button[type="submit"]').attributes(),
    ).not.toHaveProperty('disabled');
  });

  it('offers cancellation only when requested', async () => {
    const initialWrapper = await mountSuspended(HouseholdCreationForm);
    expect(initialWrapper.findAll('button')).toHaveLength(1);
    initialWrapper.unmount();

    const additionalWrapper = await mountSuspended(HouseholdCreationForm, {
      props: { cancelable: true },
    });
    const cancelButton = additionalWrapper.findAll('button')[0];

    await cancelButton.trigger('click');

    expect(additionalWrapper.emitted('cancel')).toHaveLength(1);
  });
});
