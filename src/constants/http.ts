export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const API_ENDPOINTS = {
  STOCKS: {
    LIST: '/stocks/list',
    CREATE: '/stocks',
    DETAIL: (isin: string) => `/stocks/${isin}`,
  },
  SCORING: {
    GURUFOCUS: '/scores/gf',
  },
} as const;

export const REQUEST_TIMEOUT = {
  DEFAULT: 10000, // 10 secondes
  UPLOAD: 30000, // 30 secondes
  DOWNLOAD: 60000, // 1 minute
} as const;
