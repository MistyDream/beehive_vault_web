<template>
  <section class="bh-perf-formula" :class="{ 'bh-perf-formula--open': isOpen }">
    <button
      :id="triggerId"
      type="button"
      class="bh-perf-formula__trigger"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      @click="toggle()"
    >
      <LucideInfo :size="16" class="bh-perf-formula__icon" aria-hidden="true" />
      <span class="bh-perf-formula__trigger-label">
        {{ t('portfolios.detail.performance.formula.title') }}
      </span>
      <span class="bh-perf-formula__toggle">
        {{
          isOpen
            ? t('portfolios.detail.performance.formula.toggle_hide')
            : t('portfolios.detail.performance.formula.toggle_show')
        }}
      </span>
      <LucideChevronDown
        :size="16"
        class="bh-perf-formula__chevron"
        :class="{ 'bh-perf-formula__chevron--open': isOpen }"
        aria-hidden="true"
      />
    </button>

    <div
      :id="panelId"
      role="region"
      :aria-labelledby="triggerId"
      class="bh-perf-formula__panel-wrap"
      :class="{ 'bh-perf-formula__panel-wrap--open': isOpen }"
      :aria-hidden="!isOpen || undefined"
    >
      <div class="bh-perf-formula__panel-inner">
        <div class="bh-perf-formula__panel">
          <code class="bh-perf-formula__expression">
            {{ t('portfolios.detail.performance.formula.expression') }}
          </code>
          <p class="bh-perf-formula__caption">
            {{ t('portfolios.detail.performance.formula.caption') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { LucideChevronDown, LucideInfo } from '#components';

const { t } = useI18n();

const [isOpen, toggle] = useToggle(false);

const baseId = useId();
const triggerId = `bh-perf-formula-trigger-${baseId}`;
const panelId = `bh-perf-formula-panel-${baseId}`;
</script>

<style lang="css" scoped>
.bh-perf-formula {
  @apply bg-theme-bg-card rounded-2xl border border-theme-border-primary;
  @apply overflow-hidden;
}

.bh-perf-formula__trigger {
  @apply w-full flex items-center gap-3;
  @apply p-4 md:px-5;
  @apply text-left;
  @apply hover:bg-theme-bg-elevated transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme-accent-primary;
}

.bh-perf-formula__icon {
  @apply text-theme-text-muted;
  @apply shrink-0;
}

.bh-perf-formula__trigger-label {
  @apply text-sm font-medium text-theme-text-primary;
  @apply flex-1;
}

.bh-perf-formula__toggle {
  @apply text-xs text-theme-text-muted;
  @apply hidden sm:inline;
}

.bh-perf-formula__chevron {
  @apply text-theme-text-muted;
  @apply shrink-0;
  @apply transition-transform duration-200;
}

.bh-perf-formula__chevron--open {
  @apply rotate-180;
}

.bh-perf-formula__panel-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.bh-perf-formula__panel-wrap--open {
  grid-template-rows: 1fr;
}

.bh-perf-formula__panel-inner {
  @apply overflow-hidden;
}

.bh-perf-formula__panel {
  @apply flex flex-col gap-2;
  @apply px-4 pb-4 md:px-5 md:pb-5;
  @apply border-t border-theme-border-secondary pt-4;
}

@media (prefers-reduced-motion: reduce) {
  .bh-perf-formula__panel-wrap {
    transition: none;
  }
}

.bh-perf-formula__expression {
  @apply font-space text-sm text-theme-text-primary;
  @apply bg-theme-bg-elevated rounded px-3 py-2;
  @apply w-fit;
}

.bh-perf-formula__caption {
  @apply text-xs text-theme-text-muted;
}
</style>
