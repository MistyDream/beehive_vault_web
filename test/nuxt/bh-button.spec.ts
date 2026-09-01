import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHButton } from '#components';

describe('BHButton', () => {
  it('renders its label in a native button by default', async () => {
    const wrapper = await mountSuspended(BHButton, {
      slots: {
        default: 'Save',
      },
    });

    expect(wrapper.get('button').text()).toBe('Save');
  });

  it('uses button as the safe default type', async () => {
    const wrapper = await mountSuspended(BHButton);

    expect(wrapper.get('button').attributes('type')).toBe('button');
  });

  it('forwards an explicit native button type', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { type: 'submit' },
    });

    expect(wrapper.get('button').attributes('type')).toBe('submit');
  });

  it('uses the primary medium visual defaults', async () => {
    const wrapper = await mountSuspended(BHButton);

    expect(wrapper.get('button').classes()).toEqual(
      expect.arrayContaining(['primary', 'size-md']),
    );
  });

  it.each([
    ['secondary', 'sm'],
    ['ghost', 'md'],
    ['danger', 'lg'],
  ] as const)('applies the %s variant and %s size', async (variant, size) => {
    const wrapper = await mountSuspended(BHButton, {
      props: { variant, size },
    });

    expect(wrapper.get('button').classes()).toEqual(
      expect.arrayContaining([variant, `size-${size}`]),
    );
  });

  it('emits a click event when activated', async () => {
    const wrapper = await mountSuspended(BHButton);

    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('prevents interaction when disabled', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { disabled: true },
    });

    expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('exposes its loading state and prevents interaction', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { loading: true },
    });

    expect(wrapper.get('button').attributes('aria-busy')).toBe('true');
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('renders an internal navigation link', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { to: '/accounts' },
      slots: {
        default: 'Account',
      },
    });

    expect(wrapper.get('a').attributes('href')).toBe('/accounts');
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('renders an external link with safe attributes', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { href: 'https://example.com' },
      slots: {
        default: 'Account',
      },
    });

    expect(wrapper.get('a').attributes('href')).toBe('https://example.com');
    expect(wrapper.get('a').attributes('target')).toBe('_blank');
    expect(wrapper.get('a').attributes('rel')).toBe('noopener noreferrer');
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('exposes a disabled internal link to assistive technologies', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { to: '/accounts', disabled: true },
      slots: {
        default: 'Account',
      },
    });

    const link = wrapper.get('a');

    expect(link.attributes('aria-disabled')).toBe('true');
    expect(link.attributes('tabindex')).toBe('-1');
    await link.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ] as const)('applies the shared disabled style when %s', async (_, props) => {
    const wrapper = await mountSuspended(BHButton, { props });

    expect(wrapper.get('button').classes()).toContain('is-disabled');
  });

  it('exposes a disabled external link to assistive technologies', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { href: 'https://example.com', disabled: true },
      slots: {
        default: 'External resource',
      },
    });

    const link = wrapper.get('a');

    expect(link.attributes('aria-disabled')).toBe('true');
    expect(link.attributes('tabindex')).toBe('-1');
    await link.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('exposes a loading link as busy and disabled', async () => {
    const wrapper = await mountSuspended(BHButton, {
      props: { to: '/accounts', loading: true },
      slots: {
        default: 'Loading accounts',
      },
    });

    const link = wrapper.get('a');

    expect(link.attributes('aria-busy')).toBe('true');
    expect(link.attributes('aria-disabled')).toBe('true');
    expect(link.attributes('tabindex')).toBe('-1');
    await link.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
