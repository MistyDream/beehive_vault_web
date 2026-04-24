import { proxyRequest } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (!config.apiBase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API_BASE_URL is not configured',
    });
  }

  const suffix = event.path.replace(/^\/api\/v1/, '');
  const target = `${config.apiBase}${suffix}`;

  const headers: Record<string, string> = {};
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  return proxyRequest(event, target, { headers });
});
