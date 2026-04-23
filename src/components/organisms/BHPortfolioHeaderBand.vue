<template>
  <header class="bh-portfolio-header">
    <div class="bh-portfolio-header__main">
      <div class="bh-portfolio-header__title-row">
        <h1 class="bh-portfolio-header__name">{{ portfolio.name }}</h1>
        <div class="bh-portfolio-header__badges">
          <BHBadge
            :variant="portfolio.kind === 'real' ? 'accent-primary' : 'accent-secondary'"
            size="sm"
          >
            {{ kindLabel }}
          </BHBadge>
          <BHTag color="neutral">{{ portfolio.currency }}</BHTag>
        </div>
      </div>

      <p
        v-if="portfolio.description"
        class="bh-portfolio-header__description"
      >
        {{ portfolio.description }}
      </p>

      <p class="bh-portfolio-header__updated">
        <time :datetime="portfolio.updated_at">
          {{ t('portfolios.detail.updated_ago', { time: updatedAgo }) }}
        </time>
      </p>
    </div>

    <div class="bh-portfolio-header__actions">
      <BHButton variant="primary" size="md" @click="onAddTransaction">
        <LucidePlus :size="16" aria-hidden="true" />
        {{ t('portfolios.detail.actions.add_transaction') }}
      </BHButton>

      <BHDropdown placement="bottom-end" :items="menuItems">
        <template #trigger="{ toggle, isOpen }">
          <button
            type="button"
            class="bh-portfolio-header__menu-trigger"
            :aria-label="t('portfolios.detail.actions.menu')"
            aria-haspopup="true"
            :aria-expanded="isOpen"
            @click.stop="toggle"
          >
            <LucideEllipsisVertical :size="20" aria-hidden="true" />
          </button>
        </template>
      </BHDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  LucidePlus,
  LucideEllipsisVertical,
  LucidePencil,
  LucideTrash2,
} from '#components';
import type { Portfolio } from '~/types/portfolio';
import type { NavigationLink } from '~/types/navigation-link';

interface Props {
  portfolio: Portfolio;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'edit' | 'delete'): void;
}>();

const { t } = useI18n();
const toast = useToast();
const { formatRelative } = useLocaleFormatters();

const kindLabel = computed(() =>
  props.portfolio.kind === 'real'
    ? t('portfolios.form.kind_real')
    : t('portfolios.form.kind_virtual'),
);

const now = useNow({ interval: 60_000 });
const updatedAgo = computed(() =>
  formatRelative(props.portfolio.updated_at, now.value.getTime()),
);

function onAddTransaction() {
  toast.info(t('toast.coming_soon'));
}

const menuItems = computed<NavigationLink[]>(() => [
  {
    text: t('portfolios.detail.actions.edit'),
    icon: LucidePencil,
    onClick: () => emit('edit'),
  },
  {
    text: t('portfolios.detail.actions.delete'),
    icon: LucideTrash2,
    danger: true,
    onClick: () => emit('delete'),
  },
]);
</script>

<style lang="css" scoped>
.bh-portfolio-header {
  @apply flex flex-col gap-4;
  @apply md:flex-row md:items-start md:justify-between;
}

.bh-portfolio-header__main {
  @apply flex flex-col gap-2 min-w-0 flex-1;
}

.bh-portfolio-header__title-row {
  @apply flex flex-wrap items-center gap-3;
}

.bh-portfolio-header__name {
  @apply font-poppins text-2xl md:text-3xl font-semibold text-theme-text-primary;
  @apply truncate;
}

.bh-portfolio-header__badges {
  @apply flex items-center gap-2 flex-wrap;
}

.bh-portfolio-header__description {
  @apply text-sm text-theme-text-secondary;
  @apply max-w-prose;
}

.bh-portfolio-header__updated {
  @apply text-xs text-theme-text-muted;
}

.bh-portfolio-header__actions {
  @apply flex items-center gap-2;
  @apply flex-shrink-0;
}

.bh-portfolio-header__menu-trigger {
  @apply flex items-center justify-center;
  @apply w-11 h-11 rounded-lg;
  @apply text-theme-text-muted;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply transition-colors duration-150;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}
</style>
