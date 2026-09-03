import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { h } from 'vue';

import { BHFormField } from '#components';

describe('BHFormField', () => {
  it('associates its label with the slotted control', async () => {
    const wrapper = await mountSuspended(BHFormField, {
      props: {
        id: 'household-name',
        label: 'Household name',
      },
      slots: {
        default: ({ inputId }: { inputId: string }) =>
          h('input', { id: inputId }),
      },
    });

    expect(wrapper.get('label').attributes('for')).toBe('household-name');
    expect(wrapper.get('input').attributes('id')).toBe('household-name');
  });

  it('connects help and error messages to the control', async () => {
    const wrapper = await mountSuspended(BHFormField, {
      props: {
        id: 'household-name',
        label: 'Household name',
        help: 'Use a recognizable name.',
        error: 'Enter a household name.',
      },
      slots: {
        default: ({ inputId, describedBy, invalid }) =>
          h('input', {
            id: inputId,
            'aria-describedby': describedBy,
            'aria-invalid': invalid,
          }),
      },
    });

    expect(wrapper.get('input').attributes('aria-describedby')).toBe(
      'household-name-help household-name-error',
    );
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#household-name-help').text()).toBe(
      'Use a recognizable name.',
    );
    expect(wrapper.get('#household-name-error').attributes('role')).toBe(
      'alert',
    );
  });

  it('marks a required label without adding the marker to its accessible name', async () => {
    const wrapper = await mountSuspended(BHFormField, {
      props: {
        label: 'Household name',
        required: true,
      },
    });

    expect(wrapper.get('label span').attributes('aria-hidden')).toBe('true');
  });
});
