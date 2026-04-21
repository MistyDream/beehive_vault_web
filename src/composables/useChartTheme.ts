export function useChartTheme() {
  const color = (token: string) => `rgb(var(--color-${token}))`;

  return {
    accentPrimary: color('accent-primary'),
    accentPrimaryStrong: color('accent-primary-strong'),
    accentSecondary: color('accent-secondary'),
    accentSecondaryStrong: color('accent-secondary-strong'),
    success: color('status-success'),
    warning: color('status-warning'),
    error: color('status-error'),
    info: color('status-info'),
    textPrimary: color('text-primary'),
    textSecondary: color('text-secondary'),
    textMuted: color('text-muted'),
    bgCard: color('bg-card'),
    bgElevated: color('bg-elevated'),
    borderSecondary: color('border-secondary'),
  };
}
