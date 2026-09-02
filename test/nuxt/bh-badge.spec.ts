import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHBadge } from '#components';

describe('BHBadge', () => {
  it('renders its content in a non-interactive span', async () => {
    const wrapper = await mountSuspended(BHBadge, {
      slots: {
        default: 'Active',
      },
    });

    expect(wrapper.get('span').text()).toBe('Active');
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('uses the neutral medium visual defaults', async () => {
    const wrapper = await mountSuspended(BHBadge);

    expect(wrapper.get('.bh-badge').classes()).toEqual(
      expect.arrayContaining(['variant-neutral', 'size-md']),
    );
  });

  it.each([
    'neutral',
    'accent',
    'success',
    'warning',
    'error',
    'info',
  ] as const)('applies the %s variant', async (variant) => {
    const wrapper = await mountSuspended(BHBadge, {
      props: { variant },
    });

    expect(wrapper.get('.bh-badge').classes()).toContain(`variant-${variant}`);
  });

  it.each(['sm', 'md'] as const)('applies the %s size', async (size) => {
    const wrapper = await mountSuspended(BHBadge, {
      props: { size },
    });

    expect(wrapper.get('.bh-badge').classes()).toContain(`size-${size}`);
  });

  it('forwards accessible context to its root element', async () => {
    const wrapper = await mountSuspended(BHBadge, {
      attrs: {
        'aria-label': 'Account status',
      },
    });

    expect(wrapper.get('.bh-badge').attributes('aria-label')).toBe(
      'Account status',
    );
  });
});
