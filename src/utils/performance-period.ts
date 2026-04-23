import type { PerformanceFilters } from '~/types/portfolio';

export const PERIOD_PRESETS = [
  '7d',
  '30d',
  'ytd',
  '12m',
  'all',
  'custom',
] as const;

export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

export interface PeriodState {
  preset: PeriodPreset;
  from?: string;
  to?: string;
}

export const DEFAULT_PERIOD_STATE: PeriodState = { preset: 'all' };

export function isPeriodPreset(value: unknown): value is PeriodPreset {
  return (
    typeof value === 'string' &&
    (PERIOD_PRESETS as readonly string[]).includes(value)
  );
}

export function toPerformanceFilters(
  state: PeriodState,
  now: Date = new Date(),
): PerformanceFilters {
  switch (state.preset) {
    case 'all':
      return {};
    case 'custom':
      return {
        from_date: state.from || undefined,
        to_date: state.to || undefined,
      };
    case '7d':
      return { from_date: toIsoDate(shiftDays(now, -7)) };
    case '30d':
      return { from_date: toIsoDate(shiftDays(now, -30)) };
    case 'ytd':
      return { from_date: toIsoDate(new Date(now.getFullYear(), 0, 1)) };
    case '12m': {
      const from = new Date(now);
      from.setFullYear(from.getFullYear() - 1);
      return { from_date: toIsoDate(from) };
    }
  }
}

function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
