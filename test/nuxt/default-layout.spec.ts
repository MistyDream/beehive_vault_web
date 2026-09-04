import { nextTick } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHDesktopSidebar, BHMobileNavigation } from '#components';
import DefaultLayout from '~/layouts/default.vue';
import MobileMoreMenu from '~/components/layout/MobileMoreMenu.vue';

const { startCreation, startSelection, toggleTheme } = vi.hoisted(() => ({
  startCreation: vi.fn(),
  startSelection: vi.fn(),
  toggleTheme: vi.fn(),
}));

const activeHousehold = {
  __v_isRef: true,
  value: {
    id: 'household-personal',
    name: 'Personal household',
    baseCurrency: 'EUR',
    timezone: 'Europe/Paris',
    createdAt: '2026-09-04T08:00:00Z',
    updatedAt: '2026-09-04T08:00:00Z',
  },
};

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
}));

mockNuxtImport('useLocalePath', () => () => (path: string) => path);
mockNuxtImport('useActiveHousehold', () => () => ({
  activeHousehold,
  startCreation,
  startSelection,
}));
mockNuxtImport('useTheme', () => () => ({
  isDark: { __v_isRef: true, value: true },
  toggle: toggleTheme,
}));

describe('DefaultLayout', () => {
  beforeEach(() => {
    startCreation.mockReset();
    startSelection.mockReset();
    toggleTheme.mockReset();
  });

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

  it('opens the mobile More panel and delegates its actions', async () => {
    const wrapper = await mountSuspended(DefaultLayout, { shallow: true });
    const navigation = wrapper.getComponent(BHMobileNavigation);

    expect(navigation.props('moreExpanded')).toBe(false);

    navigation.vm.$emit('more');
    await nextTick();

    expect(navigation.props('moreExpanded')).toBe(true);

    const menu = wrapper.getComponent(MobileMoreMenu);
    expect(menu.props('modelValue')).toBe(true);

    menu.vm.$emit('change');
    menu.vm.$emit('create');
    menu.vm.$emit('toggle-theme');

    expect(startSelection).toHaveBeenCalledOnce();
    expect(startCreation).toHaveBeenCalledOnce();
    expect(toggleTheme).toHaveBeenCalledOnce();
  });
});
