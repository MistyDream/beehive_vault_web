import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/types/api';

describe('ApiError', () => {
  it('uses the problem detail as its message', () => {
    const error = new ApiError({
      type: 'urn:beehive-vault:problem:validation',
      title: 'Validation failed',
      status: 422,
      code: 'validation_failed',
      detail: 'Request contains invalid fields.',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Request contains invalid fields.');
    expect(error.status).toBe(422);
    expect(error.code).toBe('validation_failed');
  });

  it('uses the title as its message if detail is missing', () => {
    const error = new ApiError({
      type: 'urn:beehive-vault:problem:validation',
      title: 'Validation failed',
      status: 422,
      code: 'validation_failed',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Validation failed');
    expect(error.status).toBe(422);
    expect(error.code).toBe('validation_failed');
  });
});
