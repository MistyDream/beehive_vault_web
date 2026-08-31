/**
 * Exact base-10 decimal value exchanged with the API.
 */
export type DecimalString = string;

/**
 * Calendar date serialized as YYYY-MM-DD.
 */
export type DateString = string;

/**
 * UTC timestamp serialized according to RFC 3339.
 */
export type DateTimeString = string;

/**
 * Calendar month serialized as YYYY-MM.
 */
export type MonthString = string;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}
