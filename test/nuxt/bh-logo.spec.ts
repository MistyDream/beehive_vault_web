import { afterEach, describe, expect, it } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import { BHLogo } from '#components';

mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
}));

enableAutoUnmount(afterEach);

describe('BHLogo', () => {
  it('is decorative by default', async () => {
    const wrapper = await mountSuspended(BHLogo);
    const logo = wrapper.get('svg');

    expect(logo.attributes('aria-hidden')).toBe('true');
    expect(logo.attributes()).not.toHaveProperty('role');
    expect(logo.attributes()).not.toHaveProperty('aria-label');
  });

  it('exposes an accessible name when informative', async () => {
    const wrapper = await mountSuspended(BHLogo, {
      props: { ariaHidden: false },
    });
    const logo = wrapper.get('svg');

    expect(logo.attributes('role')).toBe('img');
    expect(logo.attributes('aria-label')).toBe('a11y.logo_label');
    expect(logo.attributes()).not.toHaveProperty('aria-hidden');
  });
});
