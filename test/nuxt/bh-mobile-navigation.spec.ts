import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHMobileNavigation } from '#components';

const TestIcon = defineComponent({
  name: 'TestIcon',
  setup: () => () => h('svg', { 'data-testid': 'navigation-icon' }),
});

const navigationItems = [
  { label: 'Home', to: '/', icon: TestIcon },
  { label: 'Accounts', to: '/accounts', icon: TestIcon },
  { label: 'Transactions', to: '/transactions', icon: TestIcon },
];

describe('BHMobileNavigation', () => {
  it('renders an accessible link for every navigation destination', async () => {
    const wrapper = await mountSuspended(BHMobileNavigation, {
      props: {
        navigationLabel: 'Main navigation',
        items: navigationItems,
        moreLabel: 'More',
        moreIcon: TestIcon,
      },
    });

    const navigation = wrapper.get('nav');

    expect(navigation.attributes('aria-label')).toBe('Main navigation');
    expect(navigation.findAll('.bh-mobile-navigation__link')).toHaveLength(3);
    expect(navigation.get('a[href="/accounts"]').text()).toContain('Accounts');
  });

  it('renders More as a native button with a decorative icon', async () => {
    const wrapper = await mountSuspended(BHMobileNavigation, {
      props: {
        navigationLabel: 'Main navigation',
        items: navigationItems,
        moreLabel: 'More',
        moreIcon: TestIcon,
      },
    });

    const moreButton = wrapper.get('.bh-mobile-navigation__more');

    expect(moreButton.element.tagName).toBe('BUTTON');
    expect(moreButton.attributes('type')).toBe('button');
    expect(moreButton.text()).toContain('More');
    expect(
      moreButton
        .get('[aria-hidden="true"] [data-testid="navigation-icon"]')
        .exists(),
    ).toBe(true);
  });

  it('emits more when the More action is activated', async () => {
    const wrapper = await mountSuspended(BHMobileNavigation, {
      props: {
        navigationLabel: 'Main navigation',
        items: navigationItems,
        moreLabel: 'More',
        moreIcon: TestIcon,
      },
    });

    await wrapper.get('.bh-mobile-navigation__more').trigger('click');

    expect(wrapper.emitted('more')).toHaveLength(1);
  });
});
