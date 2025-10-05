<template>
  <tr class="bh-share-row">
    <!-- Nom et logo -->
    <td class="bh-share-row--name">
      <div class="share-info">
        <div
          v-if="share.logo"
          class="share-logo"
          :style="{ backgroundImage: `url(${share.logo})` }"
        >
          <BHBadge v-if="isDataOutdated" class="share-badge" type="warning">
            <LucideTriangleAlert :size="14" />
          </BHBadge>
        </div>
        <div
          v-else
          class="share-logo-placeholder"
          :style="{ backgroundColor: '#6B7280' }"
        >
          {{ share.name.charAt(0).toUpperCase()
          }}{{ share.name.charAt(1)?.toUpperCase() || '' }}
          <BHBadge v-if="isDataOutdated" class="share-badge" type="warning">
            <LucideTriangleAlert :size="14" />
          </BHBadge>
        </div>
        <div class="share-details">
          <div class="share-symbol">{{ share.symbol }}</div>
          <div class="share-name">{{ share.name }}</div>
        </div>
      </div>
    </td>

    <!-- Note globale -->
    <td class="bh-share-row--score">
      <BHScoreBadge
        :score="share.score?.total ?? 0"
        :is-global-score="true"
        :disabled="!share.score"
      />
    </td>

    <!-- Valorisation -->
    <td class="bh-share-row--rating">
      <BHScoreBadge
        :score="share.score?.valuation ?? 0"
        :disabled="!share.score"
      />
    </td>

    <!-- Croissance -->
    <td class="bh-share-row--rating">
      <BHScoreBadge
        :score="share.score?.growth ?? 0"
        :disabled="!share.score"
      />
    </td>

    <!-- Profitabilité -->
    <td class="bh-share-row--rating">
      <BHScoreBadge
        :score="share.score?.profitability ?? 0"
        :disabled="!share.score"
      />
    </td>

    <!-- Santé Financière -->
    <td class="bh-share-row--rating">
      <BHScoreBadge
        :score="share.score?.solidity ?? 0"
        :disabled="!share.score"
      />
    </td>

    <!-- Retour aux investisseurs -->
    <td class="bh-share-row--rating">
      <BHScoreBadge
        :score="share.score?.shareholderReturn ?? 0"
        :disabled="!share.score"
      />
    </td>

    <!-- Actions -->
    <td class="bh-share-row--actions">
      <BHDropdown :items="dropdownItems">
        <template #trigger>
          <BHButton class="bh-share-row--menu">
            <LucideMoreVertical :size="16" />
          </BHButton>
        </template>
      </BHDropdown>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Stock } from '~/types/stock';
import BHEditStockForm from '~/components/organisms/BHEditStockForm.vue';
import useDrawer from '~/composables/useDrawer';
import { useI18n } from '#imports';
import {
  LucideBuilding2,
  LucideEye,
  LucideMoreVertical,
  LucidePencil,
} from '#components';
import { computed } from 'vue';
import type { NavigationLink } from '~/types/navigation-link';

interface Props {
  share: Stock;
  onDrawerClose?: () => void;
}
const props = defineProps<Props>();

const { t } = useI18n();
const { open } = useDrawer();

// Check if the stock data is older than 1 month
const isDataOutdated = computed(() => {
  if (!props.share.updatedAt) return false;

  const updatedDate = new Date(props.share.updatedAt);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return updatedDate < oneMonthAgo;
});

const handleEditShare = () => {
  open(
    t('shares-edit'),
    LucideBuilding2,
    BHEditStockForm,
    {
      stock: props.share,
    },
    props.onDrawerClose,
  );
};

const dropdownItems = computed<NavigationLink[]>(() => [
  {
    text: t('shares-detail'),
    icon: LucideEye,
    to: `/shares/${props.share.isin}`,
  },
  {
    text: t('shares-edit'),
    icon: LucidePencil,
    onClick: handleEditShare,
  },
]);
</script>

<style lang="css" scoped>
.bh-share-row {
  @apply border-b border-dark-gray-450 hover:bg-dark-gray-700/50;
  @apply transition-colors duration-200;
}

.bh-share-row--name {
  @apply px-6 py-4;
}

.share-badge {
  @apply -bottom-2 left-6;
}

.share-info {
  @apply flex items-center gap-3;
}

.share-logo {
  @apply relative;
  @apply w-10 h-10 rounded-full bg-cover bg-center;
  @apply border border-border-dark;
}

.share-logo-placeholder {
  @apply relative;
  @apply w-10 h-10 rounded-full;
  @apply border border-border-dark;
  @apply flex flex-shrink-0 items-center justify-center;
  @apply text-sm font-bold text-warm-white-500;
}

.share-details {
  @apply flex flex-col;
}

.share-symbol {
  @apply font-semibold text-warm-white-500;
}

.share-name {
  @apply text-sm text-gray-400;
}

.bh-share-row--score {
  @apply px-6 py-4 text-center;
}

.bh-share-row--rating {
  @apply px-6 py-4 text-center;
}

.bh-share-row--actions {
  @apply flex justify-center items-center;
  @apply h-20 px-6 py-4;
}

.bh-share-row--menu {
  @apply p-2 hover:bg-dark-gray-600;
  @apply rounded-lg;
}
</style>
