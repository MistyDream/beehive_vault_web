/**
 * RFC 9457 Problem Details object returned by the Rust API.
 */
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  code: string;
  detail?: string;
  instance?: string;
  errors?: FieldError[];
}

export type FieldErrorLocation = 'body' | 'path' | 'query';

export interface FieldError {
  location: FieldErrorLocation;
  pointer: string;
  code: string;
  detail: string;
}

/**
 * Typed error thrown by the API plugin when a response fails.
 * Wraps the RFC 9457 ProblemDetail payload.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly type: string;
  readonly code: string;
  readonly title: string;
  readonly detail?: string;
  readonly instance?: string;
  readonly errors?: FieldError[];

  constructor(problem: ProblemDetail) {
    super(problem.detail ?? problem.title);

    this.name = 'ApiError';
    this.status = problem.status;
    this.type = problem.type;
    this.code = problem.code;
    this.title = problem.title;
    this.detail = problem.detail;
    this.instance = problem.instance;
    this.errors = problem.errors;
  }
}
