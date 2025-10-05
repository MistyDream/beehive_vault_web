import { API_ENDPOINTS } from '~/constants/http';

export const useScoringApi = () => {
  const $api = useNuxtApp().$api as typeof $fetch;

  const gfScore = (payload: any) => {
    return useFetch(API_ENDPOINTS.SCORING.GURUFOCUS, {
      method: 'POST',
      body: payload,
      $fetch: $api,
    });
  };

  return {
    gfScore,
  };
};
