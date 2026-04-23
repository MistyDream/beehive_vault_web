<template>
  <section class="bh-perf-wf">
    <header class="bh-perf-wf__header">
      <h2 class="bh-perf-wf__title">
        {{ t('portfolios.detail.performance.waterfall.title') }}
      </h2>
      <p class="bh-perf-wf__caption">
        {{ t('portfolios.detail.performance.waterfall.caption') }}
      </p>
    </header>

    <ClientOnly>
      <highcharts
        v-if="performance"
        :options="chartOptions"
        class="bh-perf-wf__chart"
      />
      <div v-else class="bh-perf-wf__skeleton bh-skeleton" />
      <template #fallback>
        <div class="bh-perf-wf__skeleton bh-skeleton" />
      </template>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import type Highcharts from 'highcharts';
import type { PerformanceReport } from '~/types/portfolio';

interface Props {
  performance: PerformanceReport | null | undefined;
}

const props = defineProps<Props>();

const { t, locale } = useI18n();
const theme = useChartTheme();

const chartOptions = computed<Highcharts.Options>(() => {
  const perf = props.performance;
  if (!perf) return {};

  const currency = perf.currency;
  const currencySymbol = getCurrencySymbol(currency, locale.value);

  const fmt = (value: number) =>
    new Intl.NumberFormat(locale.value, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return {
    chart: {
      type: 'waterfall',
      backgroundColor: 'transparent',
      height: 320,
      spacing: [16, 8, 8, 8],
      style: { fontFamily: 'inherit' },
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      type: 'category',
      lineColor: theme.borderSecondary,
      tickColor: theme.borderSecondary,
      labels: {
        style: { color: theme.textSecondary, fontSize: '12px' },
      },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: theme.borderSecondary,
      gridLineDashStyle: 'Dash',
      labels: {
        style: { color: theme.textMuted, fontSize: '11px' },
        formatter() {
          return `${fmt(Number(this.value))} ${currencySymbol}`;
        },
      },
    },
    tooltip: {
      backgroundColor: theme.bgElevated,
      borderColor: theme.borderSecondary,
      style: { color: theme.textPrimary, fontSize: '12px' },
      formatter() {
        const y = Number(this.y ?? 0);
        const sign = y > 0 ? '+' : '';
        return `<b>${this.key}</b><br/>${sign}${fmt(y)} ${currencySymbol}`;
      },
    },
    plotOptions: {
      waterfall: {
        lineColor: theme.borderSecondary,
        dashStyle: 'Dash',
        borderWidth: 0,
        pointPadding: 0.15,
        groupPadding: 0.1,
        dataLabels: {
          enabled: true,
          style: {
            color: theme.textPrimary,
            fontSize: '11px',
            fontWeight: '600',
            textOutline: 'none',
          },
          formatter() {
            const y = Number(this.y ?? 0);
            const sign = y > 0 ? '+' : '';
            return `${sign}${fmt(y)} ${currencySymbol}`;
          },
        },
      },
    },
    series: [
      {
        type: 'waterfall',
        name: t('portfolios.detail.performance.waterfall.title'),
        upColor: theme.success,
        color: theme.error,
        data: [
          {
            name: t('portfolios.detail.performance.waterfall.step.deposited'),
            y: perf.total_deposited,
            color: theme.accentPrimary,
          },
          {
            name: t('portfolios.detail.performance.waterfall.step.realized_pnl'),
            y: perf.realized_pnl,
          },
          {
            name: t('portfolios.detail.performance.waterfall.step.dividends'),
            y: perf.dividends_received,
          },
          {
            name: t('portfolios.detail.performance.waterfall.step.fees'),
            y: -perf.fees_paid,
          },
          {
            name: t('portfolios.detail.performance.waterfall.step.taxes'),
            y: -perf.taxes_paid,
          },
          {
            name: t('portfolios.detail.performance.waterfall.step.total'),
            isSum: true,
            color: theme.accentPrimary,
          },
        ],
      },
    ],
  };
});

function getCurrencySymbol(currency: string, activeLocale: string): string {
  const parts = new Intl.NumberFormat(activeLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? currency;
}
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-perf-wf {
  @apply flex flex-col gap-4;
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply p-5 md:p-6;
}

.bh-perf-wf__header {
  @apply flex flex-col gap-1;
}

.bh-perf-wf__title {
  @apply font-poppins text-lg font-semibold text-theme-text-primary;
}

.bh-perf-wf__caption {
  @apply text-xs text-theme-text-muted;
}

.bh-perf-wf__skeleton {
  @apply block h-80 rounded-lg;
}

.bh-perf-wf__chart {
  @apply w-full;
}
</style>
