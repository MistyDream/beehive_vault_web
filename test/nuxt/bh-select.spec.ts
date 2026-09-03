import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHSelect } from '#components';

const options = [
  { label: 'Euro — EUR', value: 'EUR' },
  { label: 'US Dollar — USD', value: 'USD' },
] as const;

describe('BHSelect', () => {
  it('renders labelled native options', async () => {
    const wrapper = await mountSuspended(BHSelect, {
      props: {
        id: 'household-currency',
        label: 'Base currency',
        name: 'baseCurrency',
        options,
      },
    });

    expect(wrapper.get('label').attributes('for')).toBe('household-currency');
    expect(wrapper.get('select').attributes('name')).toBe('baseCurrency');
    expect(wrapper.findAll('option').map((option) => option.text())).toEqual([
      'Euro — EUR',
      'US Dollar — USD',
    ]);
  });

  it('updates its model with the selected string value', async () => {
    const wrapper = await mountSuspended(BHSelect, {
      props: {
        label: 'Base currency',
        options,
        modelValue: 'EUR',
        'onUpdate:modelValue': (value: string) =>
          wrapper.setProps({ modelValue: value }),
      },
    });

    await wrapper.get('select').setValue('USD');

    expect(wrapper.props('modelValue')).toBe('USD');
  });

  it('renders a disabled placeholder for a required selection', async () => {
    const wrapper = await mountSuspended(BHSelect, {
      props: {
        label: 'Base currency',
        options,
        placeholder: 'Select a currency',
        required: true,
      },
    });

    const placeholder = wrapper.get('option[value=""]');

    expect(placeholder.text()).toBe('Select a currency');
    expect(placeholder.attributes()).toHaveProperty('disabled');
  });

  it('connects help and error messages to the native select', async () => {
    const wrapper = await mountSuspended(BHSelect, {
      props: {
        id: 'household-currency',
        label: 'Base currency',
        options,
        help: 'Used by every account.',
        error: 'Select a currency.',
      },
    });

    const select = wrapper.get('select');

    expect(select.attributes('aria-describedby')).toBe(
      'household-currency-help household-currency-error',
    );
    expect(select.attributes('aria-invalid')).toBe('true');
  });

  it('forwards disabled and native select attributes', async () => {
    const wrapper = await mountSuspended(BHSelect, {
      props: {
        label: 'Base currency',
        options,
        disabled: true,
      },
      attrs: { 'data-testid': 'currency' },
    });

    const select = wrapper.get('select');

    expect(select.attributes()).toHaveProperty('disabled');
    expect(select.attributes('data-testid')).toBe('currency');
  });
});
