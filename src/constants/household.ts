export const ACTIVE_HOUSEHOLD_STORAGE_KEY = 'bh-active-household-id';

export const ACTIVE_HOUSEHOLD_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  NEEDS_CREATION: 'needs-creation',
  NEEDS_SELECTION: 'needs-selection',
  READY: 'ready',
  ERROR: 'error',
} as const;
