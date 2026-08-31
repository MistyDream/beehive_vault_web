export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({
      statusCode: 404,
      statusMessage: 'API route not found',
    });
  }

  const config = useRuntimeConfig(event);
  if (!config.apiBase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API upstream is not configured',
    });
  }

  const requestUrl = getRequestURL(event);
  const target = new URL(`/v1/${path}`, config.apiBase);

  target.search = requestUrl.search;

  return proxyRequest(event, target.toString());
});
