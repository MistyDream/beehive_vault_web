<template>
  <BHModal
    :model-value="modelValue"
    :title="t('nav.more')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="mobile-more-menu__household">
      <span class="mobile-more-menu__monogram" aria-hidden="true">
        {{ getHouseholdMonogram(household.name, locale) }}
      </span>
      <span class="mobile-more-menu__details">
        <strong>{{ household.name }}</strong>
        <small>{{ t('household.menu.active') }}</small>
      </span>
    </div>
    <div class="mobile-more-menu__actions">
      <BHButton
        variant="ghost"
        class="mobile-more-menu__action"
        @click="handleChange"
      >
        <LucideChevronsUpDown :size="20" aria-hidden="true" />
        <span>{{ t('household.menu.change') }}</span>
      </BHButton>

      <BHButton
        variant="ghost"
        class="mobile-more-menu__action"
        @click="handleCreate"
      >
        <LucidePlus :size="20" aria-hidden="true" />
        <span>{{ t('household.menu.create') }}</span>
      </BHButton>

      <BHButton
        variant="ghost"
        class="mobile-more-menu__action"
        @click="handleToggleTheme"
      >
        <LucideSun v-if="isDark" :size="20" aria-hidden="true" />
        <LucideMoon v-else :size="20" aria-hidden="true" />
        <span>
          {{
            isDark
              ? t('household.menu.switch_to_light')
              : t('household.menu.switch_to_dark')
          }}
        </span>
      </BHButton>
    </div>
  </BHModal>
</template>

<script setup lang="ts">
import type { Household } from '~/types/household';

interface Props {
  modelValue: boolean;
  household: Household;
  isDark: boolean;
}

interface Emits {
  'update:modelValue': [value: boolean];
  change: [];
  create: [];
  'toggle-theme': [];
}

defineProps<Props>();

const emit = defineEmits<Emits>();
const { t, locale } = useI18n();

const close = () => emit('update:modelValue', false);

const handleChange = () => {
  close();
  emit('change');
};

const handleCreate = () => {
  close();
  emit('create');
};

const handleToggleTheme = () => {
  close();
  emit('toggle-theme');
};
</script>

<style lang="css" scoped>
.mobile-more-menu__household {
  @apply flex items-center gap-3 border-b border-theme-border-secondary pb-4;
}

.mobile-more-menu__monogram {
  @apply grid h-12 w-12 shrink-0 place-items-center rounded-control;
  @apply bg-theme-bg-elevated text-base font-medium text-theme-accent-primary-strong;
}

.mobile-more-menu__details {
  @apply min-w-0;
}

.mobile-more-menu__details strong,
.mobile-more-menu__details small {
  @apply block truncate;
}

.mobile-more-menu__details strong {
  @apply text-base font-medium text-theme-text-primary;
}

.mobile-more-menu__details small {
  @apply mt-0.5 text-sm text-theme-text-muted;
}

.mobile-more-menu__actions {
  @apply mt-2 flex flex-col gap-1;
}

.mobile-more-menu__action {
  @apply min-h-12 w-full justify-start px-3 text-left;
  @apply focus-visible:ring-offset-0;
}

.mobile-more-menu__action :deep(svg) {
  @apply shrink-0 text-theme-text-muted;
}
</style>
