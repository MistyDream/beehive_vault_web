import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHDesktopSidebar, BHLogo } from '#components';

const TestIcon = defineComponent({
  name: 'TestIcon',
  setup: () => () => h('svg', { 'data-testid': 'navigation-icon' }),
});

const navigationItems = [
  { label: 'Overview', to: '/', icon: TestIcon },
  { label: 'Accounts', to: '/accounts', icon: TestIcon },
  { label: 'Transactions', to: '/transactions', icon: TestIcon },
];

describe('BHDesktopSidebar', () => {
  it('renders the Beehive Vault brand as a home link', async () => {
    const wrapper = await mountSuspended(BHDesktopSidebar, {
      props: {
        homeTo: '/',
        navigationLabel: 'Main navigation',
        items: navigationItems,
      },
    });

    const brand = wrapper.get('.bh-desktop-sidebar__brand');

    expect(brand.attributes('href')).toBe('/');
    expect(brand.text()).toContain('Beehive Vault');
    expect(brand.getComponent(BHLogo).exists()).toBe(true);
  });

  it('renders an accessible link for every navigation item', async () => {
    const wrapper = await mountSuspended(BHDesktopSidebar, {
      props: {
        homeTo: '/',
        navigationLabel: 'Main navigation',
        items: navigationItems,
      },
    });

    const navigation = wrapper.get('nav');

    expect(navigation.attributes('aria-label')).toBe('Main navigation');
    expect(navigation.findAll('.bh-desktop-sidebar__link')).toHaveLength(3);
    expect(navigation.get('a[href="/accounts"]').text()).toContain('Accounts');
  });

  it('renders the household area in its footer slot', async () => {
    const wrapper = await mountSuspended(BHDesktopSidebar, {
      props: {
        homeTo: '/',
        navigationLabel: 'Main navigation',
        items: navigationItems,
      },
      slots: {
        footer: '<button type="button">Household menu</button>',
      },
    });

    expect(wrapper.get('.bh-desktop-sidebar__footer button').text()).toBe(
      'Household menu',
    );
  });
});
