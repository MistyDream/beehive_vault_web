export interface ListApi<T> {
  total: number;
  page: number;
  limit: number;
  items: T[];
}
