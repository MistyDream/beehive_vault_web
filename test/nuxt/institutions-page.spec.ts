import { ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from '@nuxt/test-utils/runtime';
import { enableAutoUnmount } from '@vue/test-utils';

import InstitutionsPage from '~/pages/institutions.vue';
import type { Institution } from '~/types/institution';

const institutions: Institution[] = [
  { id: 'institution-zeta', name: 'Zeta Bank' },
  { id: 'institution-alpha', name: 'Alpha Bank' },
];

let response: Institution[] = institutions;
let shouldFail = false;
let requestBarrier: Promise<void> | undefined;

registerEndpoint('/api/institutions', {
  method: 'GET',
  handler: async () => {
    await requestBarrier;
    if (shouldFail) {
      throw createError({ statusCode: 500, statusMessage: 'Request failed' });
    }
    return response;
  },
});

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
  t: (key: string) => key,
}));

enableAutoUnmount(afterEach);

beforeEach(() => {
  response = institutions;
  shouldFail = false;
  requestBarrier = undefined;
  clearNuxtData();
});

describe('InstitutionsPage', () => {
  it('shows the read-only catalog in API order and focuses the heading', async () => {
    const wrapper = await mountSuspended(InstitutionsPage, {
      attachTo: document.body,
    });
    await vi.waitFor(() => expect(wrapper.findAll('li')).toHaveLength(2));

    expect(wrapper.findAll('li').map((item) => item.text())).toEqual([
      'Zeta Bank',
      'Alpha Bank',
    ]);
    expect(wrapper.find('button').exists()).toBe(false);
    expect(wrapper.find('input').exists()).toBe(false);
    expect(document.activeElement).toBe(wrapper.get('h1').element);
  });

  it('announces loading until the catalog is available', async () => {
    let releaseRequest = () => undefined;
    requestBarrier = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });
    const wrapper = await mountSuspended(InstitutionsPage);
    expect(wrapper.get('[role="status"]').text()).toContain(
      'institutions.loading',
    );

    releaseRequest();
    await vi.waitFor(() => expect(wrapper.findAll('li')).toHaveLength(2));
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it('explains that accounts remain available with an empty catalog', async () => {
    response = [];
    const wrapper = await mountSuspended(InstitutionsPage);
    await vi.waitFor(() =>
      expect(wrapper.text()).toContain('institutions.empty_title'),
    );

    expect(wrapper.text()).toContain('institutions.empty_description');
    expect(wrapper.find('ul').exists()).toBe(false);
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('keeps navigation available and retries a failed catalog request', async () => {
    shouldFail = true;
    const wrapper = await mountSuspended(InstitutionsPage);
    await vi.waitFor(() =>
      expect(wrapper.find('[role="alert"]').exists()).toBe(true),
    );
    expect(wrapper.get('h1').text()).toBe('institutions.title');
    expect(wrapper.get('[role="alert"]').text()).toContain(
      'institutions.load_error_title',
    );

    shouldFail = false;
    await wrapper.get('[role="alert"] button').trigger('click');
    await vi.waitFor(() => expect(wrapper.findAll('li')).toHaveLength(2));
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});
