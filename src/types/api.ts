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

/**
 * RFC 9457 Problem Details object returned by the Rust API.
 */
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Typed error thrown by the API plugin when a response fails.
 * Wraps the RFC 9457 ProblemDetail payload.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly type: string;
  readonly title: string;
  readonly detail?: string;
  readonly instance?: string;
  readonly errors?: FieldError[];

  constructor(problem: ProblemDetail) {
    super(problem.detail || problem.title);
    this.name = 'ApiError';
    this.status = problem.status;
    this.type = problem.type;
    this.title = problem.title;
    this.detail = problem.detail;
    this.instance = problem.instance;
    this.errors = problem.errors;
  }
}
