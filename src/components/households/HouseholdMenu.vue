<template>
  <BHDropdown
    class="household-menu__dropdown"
    placement="top-start"
    :items="menuItems"
  >
    <template #trigger="{ isOpen, toggle, open }">
      <button
        type="button"
        class="household-menu__trigger"
        aria-haspopup="menu"
        :aria-expanded="isOpen"
        @click="toggle"
        @keydown.down.prevent="open"
      >
        <span class="household-menu__monogram" aria-hidden="true">
          {{ getHouseholdMonogram(household.name, locale) }}
        </span>
        <span class="household-menu__details">
          <strong>{{ household.name }}</strong>
          <small>{{ t('household.menu.active') }}</small>
        </span>
        <LucideChevronUp
          :size="18"
          class="household-menu__chevron"
          :class="{ 'household-menu__chevron--open': isOpen }"
          aria-hidden="true"
        />
      </button>
    </template>
  </BHDropdown>
</template>

<script setup lang="ts">
import {
  LucideChevronsUpDown,
  LucidePlus,
  LucideSun,
  LucideMoon,
} from '#components';
import type { Household } from '~/types/household';
import type { NavigationLink } from '~/types/navigation-link';

const { t, locale } = useI18n();

interface Props {
  household: Household;
  isDark: boolean;
}

interface Emits {
  change: [];
  create: [];
  'toggle-theme': [];
}

const { isDark } = defineProps<Props>();
const emit = defineEmits<Emits>();

const menuItems = computed<NavigationLink[]>(() => [
  {
    text: t('household.menu.change'),
    icon: LucideChevronsUpDown,
    onClick: () => emit('change'),
  },
  {
    text: t('household.menu.create'),
    icon: LucidePlus,
    onClick: () => emit('create'),
  },
  {
    text: isDark
      ? t('household.menu.switch_to_light')
      : t('household.menu.switch_to_dark'),
    icon: isDark ? LucideSun : LucideMoon,
    onClick: () => emit('toggle-theme'),
  },
]);
</script>

<style lang="css" scoped>
.household-menu__dropdown {
  @apply w-full;
}

.household-menu__trigger {
  @apply grid min-h-14 w-full grid-cols-[auto_1fr_auto] items-center gap-3;
  @apply rounded-control border-0 bg-transparent px-2 py-2 text-left;
  @apply text-theme-sidebar-text;
  @apply transition-colors duration-150;
  @apply hover:bg-theme-sidebar-selected;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.household-menu__monogram {
  @apply grid h-10 w-10 shrink-0 place-items-center rounded-control;
  @apply bg-theme-sidebar-selected text-sm font-medium text-theme-accent-primary;
}

.household-menu__details {
  @apply min-w-0;
}

.household-menu__details strong,
.household-menu__details small {
  @apply block truncate;
}

.household-menu__details strong {
  @apply text-sm font-medium text-theme-sidebar-text;
}

.household-menu__details small {
  @apply mt-0.5 text-xs text-theme-sidebar-muted;
}

.household-menu__chevron {
  @apply shrink-0 rotate-180 text-theme-sidebar-muted;
  @apply transition-transform duration-200;
}

.household-menu__chevron--open {
  @apply rotate-0;
}
</style>
