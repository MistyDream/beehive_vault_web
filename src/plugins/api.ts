import { REQUEST_TIMEOUT } from '~/constants/http';
import { ApiError, type ProblemDetail } from '~/types/api';

export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: '/api/v1',
    timeout: REQUEST_TIMEOUT.DEFAULT,
    headers: {
      Accept: 'application/json',
    },
    onRequest({ request, options }) {
      if (import.meta.dev) {
        console.log(`[API] ${options.method || 'GET'} ${request}`);
      }
    },
    onResponseError({ response }) {
      const body = response._data as unknown;

      if (isProblemDetail(body)) {
        throw new ApiError(body);
      }

      throw new ApiError({
        type: 'about:blank',
        title: response.statusText || 'Request failed',
        status: response.status,
        detail: typeof body === 'string' ? body : undefined,
      });
    },
  });

  return {
    provide: {
      api,
    },
  };
});

function isProblemDetail(value: unknown): value is ProblemDetail {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ProblemDetail).type === 'string' &&
    typeof (value as ProblemDetail).title === 'string' &&
    typeof (value as ProblemDetail).status === 'number'
  );
}
