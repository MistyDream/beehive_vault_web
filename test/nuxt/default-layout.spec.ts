import { describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHDesktopSidebar, BHMobileNavigation } from '#components';
import DefaultLayout from '~/layouts/default.vue';

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
}));

mockNuxtImport('useLocalePath', () => () => (path: string) => path);

describe('DefaultLayout', () => {
  it('renders page content in the accessible main region', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      shallow: true,
      slots: {
        default: '<h1>Account overview</h1>',
      },
    });

    const main = wrapper.get('#main-content');

    expect(main.attributes('tabindex')).toBe('-1');
    expect(main.text()).toContain('Account overview');
    expect(wrapper.get('.app-shell__skip-link').attributes('href')).toBe(
      '#main-content',
    );
  });

  it('configures the desktop navigation with localized destinations', async () => {
    const wrapper = await mountSuspended(DefaultLayout, { shallow: true });
    const sidebar = wrapper.getComponent(BHDesktopSidebar);

    expect(sidebar.props('homeTo')).toBe('/');
    expect(sidebar.props('navigationLabel')).toBe('nav.main');
    expect(
      sidebar.props('items').map((item: { label: string }) => item.label),
    ).toEqual(['nav.overview', 'nav.accounts', 'nav.transactions']);
  });

  it('configures the mobile navigation and its More action', async () => {
    const wrapper = await mountSuspended(DefaultLayout, { shallow: true });
    const navigation = wrapper.getComponent(BHMobileNavigation);

    expect(navigation.props('navigationLabel')).toBe('nav.main');
    expect(navigation.props('moreLabel')).toBe('nav.more');
    expect(
      navigation.props('items').map((item: { label: string }) => item.label),
    ).toEqual(['nav.home', 'nav.accounts', 'nav.transactions']);
  });
});
