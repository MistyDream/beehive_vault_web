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
    DETAIL: (id: string) => `/portfolios/${id}`,
    UPDATE: (id: string) => `/portfolios/${id}`,
    DELETE: (id: string) => `/portfolios/${id}`,
    POSITIONS: (id: string) => `/portfolios/${id}/positions`,
    CASH: (id: string) => `/portfolios/${id}/cash`,
    SUMMARY: (id: string) => `/portfolios/${id}/summary`,
    PERFORMANCE: (id: string) => `/portfolios/${id}/performance`,
    SCORING: (id: string) => `/portfolios/${id}/scoring`,
    TRANSACTIONS: (id: string) => `/portfolios/${id}/transactions`,
    TRANSACTIONS_STATS: (id: string) => `/portfolios/${id}/transactions/stats`,
    TRANSACTION: (portfolioId: string, txId: string) =>
      `/portfolios/${portfolioId}/transactions/${txId}`,
  },
  STOCKS: {
    SEARCH: '/stocks',
  },
} as const;

export const REQUEST_TIMEOUT = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 30000, // 30 seconds
  DOWNLOAD: 60000, // 1 minute
} as const;
