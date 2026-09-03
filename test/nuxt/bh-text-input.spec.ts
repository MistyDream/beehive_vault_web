import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import { BHTextInput } from '#components';

describe('BHTextInput', () => {
  it('renders an identified native text input', async () => {
    const wrapper = await mountSuspended(BHTextInput, {
      props: {
        id: 'household-name',
        label: 'Household name',
        name: 'name',
        autocomplete: 'organization',
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('name')).toBe('name');
    expect(input.attributes('autocomplete')).toBe('organization');
    expect(wrapper.get('label').attributes('for')).toBe('household-name');
  });

  it('updates its model with the exact input string', async () => {
    const wrapper = await mountSuspended(BHTextInput, {
      props: {
        label: 'Household name',
        modelValue: '',
        'onUpdate:modelValue': (value: string) =>
          wrapper.setProps({ modelValue: value }),
      },
    });

    await wrapper.get('input').setValue('Personal household');

    expect(wrapper.props('modelValue')).toBe('Personal household');
  });

  it('exposes required, disabled, and readonly native states', async () => {
    const wrapper = await mountSuspended(BHTextInput, {
      props: {
        label: 'Household name',
        required: true,
        disabled: true,
        readonly: true,
      },
    });

    const attributes = wrapper.get('input').attributes();

    expect(attributes).toHaveProperty('required');
    expect(attributes).toHaveProperty('disabled');
    expect(attributes).toHaveProperty('readonly');
    expect(attributes['aria-required']).toBe('true');
  });

  it('connects help and error messages to the native input', async () => {
    const wrapper = await mountSuspended(BHTextInput, {
      props: {
        id: 'household-name',
        label: 'Household name',
        help: 'Use a recognizable name.',
        error: 'Enter a household name.',
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes('aria-describedby')).toBe(
      'household-name-help household-name-error',
    );
    expect(input.attributes('aria-invalid')).toBe('true');
  });

  it('forwards native input attributes', async () => {
    const wrapper = await mountSuspended(BHTextInput, {
      props: { label: 'Household name' },
      attrs: { maxlength: '100' },
    });

    expect(wrapper.get('input').attributes('maxlength')).toBe('100');
  });
});
