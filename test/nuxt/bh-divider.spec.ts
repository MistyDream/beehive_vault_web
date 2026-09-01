import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHDivider } from '#components';

describe('BHDivider', () => {
  it('renders a horizontal separator by default', async () => {
    const wrapper = await mountSuspended(BHDivider);
    const divider = wrapper.get('[role="separator"]');

    expect(divider.attributes('aria-orientation')).toBe('horizontal');
    expect(divider.classes()).toEqual(
      expect.arrayContaining(['bh-divider', 'orientation-horizontal']),
    );
  });

  it('renders a vertical separator when requested', async () => {
    const wrapper = await mountSuspended(BHDivider, {
      props: { orientation: 'vertical' },
    });
    const divider = wrapper.get('[role="separator"]');

    expect(divider.attributes('aria-orientation')).toBe('vertical');
    expect(divider.classes()).toContain('orientation-vertical');
  });
});
