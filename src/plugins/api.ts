import { REQUEST_TIMEOUT } from '~/constants/http';

export default defineNuxtPlugin((): { provide: { $api: typeof $fetch } } => {
  const { public: config } = useRuntimeConfig();

  // Create a configured fetch instance
  const api = $fetch.create({
    baseURL: config.apiBase,
    timeout: REQUEST_TIMEOUT.DEFAULT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // Add response interceptor for error handling
    onResponseError({ response }) {
      console.error('API Error:', response.status, response.statusText);

      // Global error handling
      if (response.status === 401) {
        console.warn('Unauthorized access');
      }
    },
    // Add request interceptor for debugging
    onRequest({ request, options }) {
      if (import.meta.dev) {
        console.log(`[API] ${options.method || 'GET'} ${request}`);
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
