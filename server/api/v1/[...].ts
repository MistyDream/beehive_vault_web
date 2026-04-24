import { proxyRequest } from 'h3';

const UPSTREAM_TIMEOUT_MS = 8_000;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (!config.apiBase) {
    console.error('[proxy] API_BASE_URL is not configured');
    throw createError({
      statusCode: 500,
      statusMessage: 'Proxy not configured',
    });
  }

  const origin = getRequestHeader(event, 'origin');
  const host = getRequestHeader(event, 'host');
  if (origin && host && new URL(origin).host !== host) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cross-origin proxy request rejected',
    });
  }

  const suffix = event.path.replace(/^\/api\/v1/, '');
  const base = config.apiBase.replace(/\/+$/, '');
  const target = `${base}${suffix}`;

  // Strip client-sent auth so only the server-injected bearer reaches upstream.
  delete event.node.req.headers.authorization;
  delete event.node.req.headers.cookie;
  delete event.node.req.headers['x-api-key'];

  const headers: Record<string, string> = {};
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  return proxyRequest(event, target, {
    headers,
    fetchOptions: { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) },
  });
});
