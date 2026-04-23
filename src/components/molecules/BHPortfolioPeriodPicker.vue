<template>
  <div class="bh-period-picker">
    <div
      class="bh-period-picker__row"
      role="radiogroup"
      :aria-label="t('portfolios.detail.performance.period.label')"
    >
      <div class="bh-period-picker__segment">
        <button
          v-for="preset in PRESET_LIST"
          :key="preset"
          type="button"
          role="radio"
          :aria-checked="modelValue.preset === preset"
          :class="[
            'bh-period-picker__pill',
            { 'bh-period-picker__pill--active': modelValue.preset === preset },
          ]"
          :tabindex="modelValue.preset === preset ? 0 : -1"
          @click="selectPreset(preset)"
          @keydown="onKeyNav($event, preset)"
        >
          {{ t(`portfolios.detail.performance.period.preset_${preset}`) }}
        </button>
      </div>
      <button
        type="button"
        role="radio"
        :aria-checked="modelValue.preset === 'custom'"
        :class="[
          'bh-period-picker__pill',
          'bh-period-picker__pill--custom',
          { 'bh-period-picker__pill--active': modelValue.preset === 'custom' },
        ]"
        :tabindex="modelValue.preset === 'custom' ? 0 : -1"
        @click="selectPreset('custom')"
        @keydown="onKeyNav($event, 'custom')"
      >
        <LucideCalendar :size="14" aria-hidden="true" />
        {{ t('portfolios.detail.performance.period.preset_custom') }}
      </button>
    </div>

    <Transition name="bh-period-picker__dates">
      <div v-if="modelValue.preset === 'custom'" class="bh-period-picker__dates-collapse">
        <div class="bh-period-picker__dates">
          <BHDateInput
            :label="t('portfolios.detail.performance.period.from_label')"
            :model-value="modelValue.from ?? ''"
            :max="modelValue.to || undefined"
            class="bh-period-picker__date"
            @update:model-value="onFromChange"
          />
          <BHDateInput
            :label="t('portfolios.detail.performance.period.to_label')"
            :model-value="modelValue.to ?? ''"
            :min="modelValue.from || undefined"
            class="bh-period-picker__date"
            @update:model-value="onToChange"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { LucideCalendar } from '#components';
import {
  PERIOD_PRESETS,
  type PeriodPreset,
  type PeriodState,
} from '~/utils/performance-period';

interface Props {
  modelValue: PeriodState;
}

interface Emits {
  'update:modelValue': [value: PeriodState];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const PRESET_LIST = PERIOD_PRESETS.filter(
  (p): p is Exclude<PeriodPreset, 'custom'> => p !== 'custom',
);
const ALL_PRESETS = PERIOD_PRESETS;

const selectPreset = (preset: PeriodPreset) => {
  if (preset === 'custom') {
    emit('update:modelValue', {
      preset,
      from: props.modelValue.from,
      to: props.modelValue.to,
    });
    return;
  }
  emit('update:modelValue', { preset });
};

const onFromChange = (value: string) => {
  emit('update:modelValue', {
    preset: 'custom',
    from: value || undefined,
    to: props.modelValue.to,
  });
};

const onToChange = (value: string) => {
  emit('update:modelValue', {
    preset: 'custom',
    from: props.modelValue.from,
    to: value || undefined,
  });
};

const onKeyNav = (event: KeyboardEvent, current: PeriodPreset) => {
  const key = event.key;
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
  event.preventDefault();
  const index = ALL_PRESETS.indexOf(current);
  let nextIndex = index;
  if (key === 'ArrowRight') nextIndex = (index + 1) % ALL_PRESETS.length;
  else if (key === 'ArrowLeft')
    nextIndex = (index - 1 + ALL_PRESETS.length) % ALL_PRESETS.length;
  else if (key === 'Home') nextIndex = 0;
  else if (key === 'End') nextIndex = ALL_PRESETS.length - 1;
  selectPreset(ALL_PRESETS[nextIndex]!);
};
</script>

<style lang="css" scoped>
.bh-period-picker {
  @apply flex flex-col gap-3;
}

.bh-period-picker__row {
  @apply flex flex-wrap items-center gap-2;
}

.bh-period-picker__segment {
  @apply inline-flex rounded-lg overflow-hidden;
  @apply border border-theme-border-secondary;
  @apply bg-theme-bg-card;
}

.bh-period-picker__pill {
  @apply inline-flex items-center gap-1.5;
  @apply px-3 py-1.5;
  @apply text-xs font-medium text-theme-text-secondary;
  @apply whitespace-nowrap;
  @apply transition-colors;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme-accent-primary;
}

.bh-period-picker__segment > .bh-period-picker__pill + .bh-period-picker__pill {
  @apply border-l border-theme-border-secondary;
}

.bh-period-picker__pill--custom {
  @apply rounded-lg border border-theme-border-secondary;
  @apply bg-theme-bg-card;
}

.bh-period-picker__pill--active {
  @apply bg-theme-accent-primary text-theme-text-on-accent-primary;
  @apply hover:bg-theme-accent-primary-strong hover:text-theme-text-on-accent-primary;
}

.bh-period-picker__dates-collapse {
  display: grid;
  grid-template-rows: 1fr;
}

.bh-period-picker__dates-collapse > .bh-period-picker__dates {
  overflow: hidden;
  min-height: 0;
}

.bh-period-picker__dates {
  @apply flex flex-col sm:flex-row sm:items-end gap-3;
}

.bh-period-picker__dates-enter-from,
.bh-period-picker__dates-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.bh-period-picker__dates-enter-active,
.bh-period-picker__dates-leave-active {
  transition: grid-template-rows 0.25s ease-out, opacity 0.2s ease-out;
}

.bh-period-picker__date {
  @apply min-w-[150px];
}
</style>
