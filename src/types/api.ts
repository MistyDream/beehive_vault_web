export type FetchOptions = {
  key?: string;
  server?: boolean;
  lazy?: boolean;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  transform?: (data: unknown) => unknown;
  pick?: string[];
  watch?: unknown[];
  baseURL?: string;
};
