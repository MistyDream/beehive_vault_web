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
  PORTFOLIOS: {
    LIST: '/portfolios',
    CREATE: '/portfolios',
    DETAIL: (id: number) => `/portfolios/${id}`,
    UPDATE: (id: number) => `/portfolios/${id}`,
    DELETE: (id: number) => `/portfolios/${id}`,
    POSITIONS: (id: number) => `/portfolios/${id}/positions`,
    CASH: (id: number) => `/portfolios/${id}/cash`,
    SUMMARY: (id: number) => `/portfolios/${id}/summary`,
    PERFORMANCE: (id: number) => `/portfolios/${id}/performance`,
    SCORING: (id: number) => `/portfolios/${id}/scoring`,
    TRANSACTIONS: (id: number) => `/portfolios/${id}/transactions`,
    TRANSACTIONS_STATS: (id: number) => `/portfolios/${id}/transactions/stats`,
    TRANSACTION: (portfolioId: number, txId: number) =>
      `/portfolios/${portfolioId}/transactions/${txId}`,
  },
} as const;

export const REQUEST_TIMEOUT = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 30000, // 30 seconds
  DOWNLOAD: 60000, // 1 minute
} as const;
