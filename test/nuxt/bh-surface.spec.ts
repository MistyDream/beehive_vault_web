import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHSurface } from '#components';

describe('BHSurface', () => {
  it('renders its content in a neutral div by default', async () => {
    const wrapper = await mountSuspended(BHSurface, {
      slots: {
        default: 'Account summary',
      },
    });

    const surface = wrapper.get('div');

    expect(surface.text()).toBe('Account summary');
    expect(surface.classes()).toEqual(
      expect.arrayContaining(['bh-surface', 'tone-card']),
    );
  });

  it.each(['section', 'article', 'aside'] as const)(
    'renders as a semantic %s element',
    async (as) => {
      const wrapper = await mountSuspended(BHSurface, {
        props: { as },
      });

      expect(wrapper.get(as).exists()).toBe(true);
    },
  );

  it('uses the elevated tone when requested', async () => {
    const wrapper = await mountSuspended(BHSurface, {
      props: { tone: 'elevated' },
    });

    expect(wrapper.get('.bh-surface').classes()).toContain('tone-elevated');
  });

  it('adds a shadow only when requested', async () => {
    const flatWrapper = await mountSuspended(BHSurface);
    const raisedWrapper = await mountSuspended(BHSurface, {
      props: { shadow: true },
    });

    expect(flatWrapper.get('.bh-surface').classes()).not.toContain(
      'has-shadow',
    );
    expect(raisedWrapper.get('.bh-surface').classes()).toContain('has-shadow');
  });
});
