import { defineComponent, h, ref, type PropType } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import HouseholdMenu from '~/components/households/HouseholdMenu.vue';
import type { Household } from '~/types/household';
import type { NavigationLink } from '~/types/navigation-link';

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

enableAutoUnmount(afterEach);

const DropdownStub = defineComponent({
  props: {
    items: {
      type: Array as PropType<NavigationLink[]>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const isOpen = ref(false);
    const open = () => {
      isOpen.value = true;
    };
    const toggle = () => {
      isOpen.value = !isOpen.value;
    };

    return () =>
      h('div', [
        slots.trigger?.({ isOpen: isOpen.value, open, toggle }),
        ...props.items.map((item) =>
          h(
            'button',
            {
              class: 'dropdown-stub__item',
              type: 'button',
              onClick: item.onClick,
            },
            item.text,
          ),
        ),
      ]);
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

describe('HouseholdMenu', () => {
  it('identifies the active household in its trigger', async () => {
    const wrapper = await mountMenu();

    expect(wrapper.get('.household-menu__monogram').text()).toBe('PH');
    expect(wrapper.get('.household-menu__details').text()).toContain(
      household.name,
    );
    expect(wrapper.get('.household-menu__details').text()).toContain(
      'household.menu.active',
    );
  });

  it('exposes the menu state on its trigger', async () => {
    const wrapper = await mountMenu();
    const trigger = wrapper.get('.household-menu__trigger');

    expect(trigger.attributes('aria-haspopup')).toBe('menu');
    expect(trigger.attributes('aria-expanded')).toBe('false');

    await trigger.trigger('keydown', { key: 'ArrowDown' });

    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('.household-menu__chevron').classes()).toContain(
      'household-menu__chevron--open',
    );
  });

  it('emits the selected household actions', async () => {
    const wrapper = await mountMenu();
    const items = wrapper.findAll('.dropdown-stub__item');

    await items[0]?.trigger('click');
    await items[1]?.trigger('click');
    await items[2]?.trigger('click');

    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('create')).toHaveLength(1);
    expect(wrapper.emitted('toggle-theme')).toHaveLength(1);
  });

  it('describes the theme that will be activated', async () => {
    const wrapper = await mountMenu(true);

    expect(wrapper.findAll('.dropdown-stub__item')[2]?.text()).toBe(
      'household.menu.switch_to_light',
    );

    await wrapper.setProps({ isDark: false });

    expect(wrapper.findAll('.dropdown-stub__item')[2]?.text()).toBe(
      'household.menu.switch_to_dark',
    );
  });
});

function mountMenu(isDark = true) {
  return mountSuspended(HouseholdMenu, {
    props: { household, isDark },
    global: {
      stubs: {
        BHDropdown: DropdownStub,
      },
    },
  });
}
