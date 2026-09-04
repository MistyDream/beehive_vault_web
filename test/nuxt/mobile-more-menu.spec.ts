import { defineComponent, h, ref } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import MobileMoreMenu from '~/components/layout/MobileMoreMenu.vue';
import type { Household } from '~/types/household';

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

enableAutoUnmount(afterEach);

const ModalStub = defineComponent({
  props: {
    modelValue: Boolean,
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      props.modelValue
        ? h('section', { 'data-title': props.title }, slots.default?.())
        : null;
  },
});

const household: Household = {
  id: 'household-personal',
  name: 'Personal household',
  baseCurrency: 'EUR',
  timezone: 'Europe/Paris',
  createdAt: '2026-09-04T08:00:00Z',
  updatedAt: '2026-09-04T08:00:00Z',
};

describe('MobileMoreMenu', () => {
  it('identifies the active household', async () => {
    const wrapper = await mountMenu();

    expect(wrapper.get('section').attributes('data-title')).toBe('nav.more');
    expect(wrapper.get('.mobile-more-menu__monogram').text()).toBe('PH');
    expect(wrapper.get('.mobile-more-menu__details').text()).toContain(
      household.name,
    );
    expect(wrapper.get('.mobile-more-menu__details').text()).toContain(
      'household.menu.active',
    );
  });

  it('closes before emitting each selected action', async () => {
    const wrapper = await mountMenu();
    const actions = wrapper.findAll('.mobile-more-menu__action');

    await actions[0]?.trigger('click');
    await actions[1]?.trigger('click');
    await actions[2]?.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [false],
      [false],
      [false],
    ]);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('create')).toHaveLength(1);
    expect(wrapper.emitted('toggle-theme')).toHaveLength(1);
  });

  it('describes the theme that will be activated', async () => {
    const wrapper = await mountMenu(true);

    expect(wrapper.findAll('.mobile-more-menu__action')[2]?.text()).toContain(
      'household.menu.switch_to_light',
    );

    await wrapper.setProps({ isDark: false });

    expect(wrapper.findAll('.mobile-more-menu__action')[2]?.text()).toContain(
      'household.menu.switch_to_dark',
    );
  });
});

function mountMenu(isDark = false) {
  return mountSuspended(MobileMoreMenu, {
    props: {
      modelValue: true,
      household,
      isDark,
    },
    global: {
      stubs: {
        BHModal: ModalStub,
      },
    },
  });
}
