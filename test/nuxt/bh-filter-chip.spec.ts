import { describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHFilterChip } from '#components';

mockNuxtImport('useI18n', () => () => ({
  t: (key: string, params?: { value?: string }) =>
    key === 'common.remove_value' ? `Remove ${params?.value}` : key,
}));

describe('BHFilterChip', () => {
  it('renders its label in a native button', async () => {
    const wrapper = await mountSuspended(BHFilterChip, {
      props: { label: 'Current account' },
    });

    const button = wrapper.get('button');

    expect(button.text()).toBe('Current account');
    expect(button.attributes('type')).toBe('button');
  });

  it('describes the removal action in its accessible name', async () => {
    const wrapper = await mountSuspended(BHFilterChip, {
      props: { label: 'Current account' },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe(
      'Remove Current account',
    );
  });

  it('hides its decorative icon from assistive technologies', async () => {
    const wrapper = await mountSuspended(BHFilterChip, {
      props: { label: 'Current account' },
    });

    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true');
  });

  it('emits a remove event when activated', async () => {
    const wrapper = await mountSuspended(BHFilterChip, {
      props: { label: 'Current account' },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('remove')).toHaveLength(1);
  });

  it('prevents removal when disabled', async () => {
    const wrapper = await mountSuspended(BHFilterChip, {
      props: {
        label: 'Current account',
        disabled: true,
      },
    });

    const button = wrapper.get('button');

    expect(button.attributes()).toHaveProperty('disabled');
    await button.trigger('click');
    expect(wrapper.emitted('remove')).toBeUndefined();
  });
});
