import { ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import { BHCurrencyDisplay } from '#components';

mockNuxtImport('useI18n', () => () => ({ locale: ref('fr-FR') }));

describe('BHCurrencyDisplay', () => {
  it('formats an exact decimal using the active locale', async () => {
    const wrapper = await mountSuspended(BHCurrencyDisplay, {
      props: { amount: '1234.50', currency: 'EUR' },
    });

    expect(wrapper.text()).toBe('1\u202f234,50 €');
  });

  it('formats large exact decimals without losing precision', async () => {
    const wrapper = await mountSuspended(BHCurrencyDisplay, {
      props: {
        amount: '12345678901234567890.12',
        currency: 'USD',
        locale: 'en-US',
      },
    });

    expect(wrapper.text()).toBe('12,345,678,901,234,567,890.12 $');
  });

  it('normalizes a negative zero', async () => {
    const wrapper = await mountSuspended(BHCurrencyDisplay, {
      props: { amount: '-0.0000', currency: 'EUR' },
    });

    expect(wrapper.text()).toBe('0,00 €');
    expect(wrapper.classes()).not.toContain('bh-currency-display--negative');
  });

  it('shows an explicit sign and semantic color when requested', async () => {
    const wrapper = await mountSuspended(BHCurrencyDisplay, {
      props: { amount: '42.00', currency: 'EUR', showSign: true },
    });

    expect(wrapper.text()).toBe('+42,00 €');
    expect(wrapper.classes()).toContain('bh-currency-display--positive');

    await wrapper.setProps({ amount: '-12.50' });

    expect(wrapper.text()).toBe('-12,50 €');
    expect(wrapper.classes()).toContain('bh-currency-display--negative');
  });
});
