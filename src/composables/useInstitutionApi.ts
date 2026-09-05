import type { Institution } from '~/types/institution';

export function useInstitutionApi() {
  const { $api } = useNuxtApp();

  return {
    list: () => $api<Institution[]>('/institutions'),
  };
}
