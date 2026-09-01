import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHIconButton } from '#components';

describe('BHIconButton', () => {
  it('renders an accessible native button with a decorative icon', async () => {
    const wrapper = await mountSuspended(BHIconButton, {
      props: { label: 'Open menu' },
      slots: {
        default: '<svg data-testid="icon" />',
      },
    });

    const button = wrapper.get('button');

    expect(button.attributes('aria-label')).toBe('Open menu');
    expect(
      button.get('[aria-hidden="true"] [data-testid="icon"]').exists(),
    ).toBe(true);
  });

  it('uses button as the safe default type', async () => {
    const wrapper = await mountSuspended(BHIconButton, {
      props: { label: 'Open menu' },
    });

    expect(wrapper.get('button').attributes('type')).toBe('button');
  });

  it('forwards an explicit native button type', async () => {
    const wrapper = await mountSuspended(BHIconButton, {
      props: { label: 'Submit form', type: 'submit' },
    });

    expect(wrapper.get('button').attributes('type')).toBe('submit');
  });

  it('uses the ghost variant by default', async () => {
    const wrapper = await mountSuspended(BHIconButton, {
      props: { label: 'Open menu' },
    });

    expect(wrapper.get('button').classes()).toEqual(
      expect.arrayContaining(['bh-icon-button', 'ghost']),
    );
  });

  it.each(['secondary', 'danger'] as const)(
    'applies the %s variant',
    async (variant) => {
      const wrapper = await mountSuspended(BHIconButton, {
        props: { label: 'Icon action', variant },
      });

      expect(wrapper.get('button').classes()).toContain(variant);
    },
  );

  it('emits a click event when activated', async () => {
    const wrapper = await mountSuspended(BHIconButton, {
      props: { label: 'Open menu' },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('prevents interaction when disabled', async () => {
    const wrapper = await mountSuspended(BHIconButton, {
      props: { label: 'Open menu', disabled: true },
    });

    const button = wrapper.get('button');

    expect(button.attributes()).toHaveProperty('disabled');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
