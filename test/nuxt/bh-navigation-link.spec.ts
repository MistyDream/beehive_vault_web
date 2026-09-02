import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHNavigationLink, NuxtLink } from '#components';

const TestIcon = defineComponent({
  name: 'TestIcon',
  setup: () => () => h('svg', { 'data-testid': 'navigation-icon' }),
});

describe('BHNavigationLink', () => {
  it('renders the navigation destination and label', async () => {
    const wrapper = await mountSuspended(BHNavigationLink, {
      props: {
        item: { label: 'Accounts', to: '/accounts', icon: TestIcon },
      },
    });

    const link = wrapper.get('a');

    expect(link.attributes('href')).toBe('/accounts');
    expect(link.text()).toContain('Accounts');
    expect(link.classes()).toContain('bh-navigation-link');
  });

  it('hides its icon from assistive technologies', async () => {
    const wrapper = await mountSuspended(BHNavigationLink, {
      props: {
        item: { label: 'Accounts', to: '/accounts', icon: TestIcon },
      },
    });

    expect(
      wrapper
        .get('[aria-hidden="true"] [data-testid="navigation-icon"]')
        .exists(),
    ).toBe(true);
  });

  it('configures the active navigation classes', async () => {
    const wrapper = await mountSuspended(BHNavigationLink, {
      props: {
        item: { label: 'Overview', to: '/', icon: TestIcon },
      },
    });

    const link = wrapper.getComponent(NuxtLink);

    expect(link.props('activeClass')).toBe('is-active');
    expect(link.props('exactActiveClass')).toBe('is-active');
  });
});
