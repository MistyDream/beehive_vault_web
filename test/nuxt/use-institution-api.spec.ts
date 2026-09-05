import { describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';

import { useInstitutionApi } from '~/composables/useInstitutionApi';
import type { Institution } from '~/types/institution';

const institutions: Institution[] = [
  { id: 'institution-beehive-bank', name: 'Beehive Bank' },
  { id: 'institution-honey-credit', name: 'Honey Credit' },
];

registerEndpoint('/api/institutions', () => institutions);

describe('useInstitutionApi', () => {
  it('loads the global institution catalog', async () => {
    const result = await useInstitutionApi().list();

    expect(result).toEqual(institutions);
  });
});
