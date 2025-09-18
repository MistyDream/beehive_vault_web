<template>
  <tr class="bh-share-row">
    <!-- Nom et logo -->
    <td class="bh-share-row--name">
      <div class="share-info">
        <div
          v-if="share.logo"
          class="share-logo"
          :style="{ backgroundImage: `url(${share.logo})` }"
        />
        <div
          v-else
          class="share-logo-placeholder"
          :style="{ backgroundColor: '#6B7280' }"
        >
          {{ share.name.charAt(0).toUpperCase()
          }}{{ share.name.charAt(1)?.toUpperCase() || '' }}
        </div>
        <div class="share-details">
          <div class="share-symbol">{{ share.symbol }}</div>
          <div class="share-name">{{ share.name }}</div>
        </div>
      </div>
    </td>

    <!-- Note globale -->
    <td class="bh-share-row--score">
      <BHScoreBadge :score="share.score.total" :is-global-score="true" />
    </td>

    <!-- Valorisation -->
    <td class="bh-share-row--rating">
      <BHScoreBadge :score="share.score.valuation" />
    </td>

    <!-- Croissance -->
    <td class="bh-share-row--rating">
      <BHScoreBadge :score="share.score.growth" />
    </td>

    <!-- Profitabilité -->
    <td class="bh-share-row--rating">
      <BHScoreBadge :score="share.score.profitability" />
    </td>

    <!-- Santé Financière -->
    <td class="bh-share-row--rating">
      <BHScoreBadge :score="share.score.solidity" />
    </td>

    <!-- Retour aux investisseurs -->
    <td class="bh-share-row--rating">
      <BHScoreBadge :score="share.score.shareholderReturn" />
    </td>

    <!-- Actions -->
    <td class="bh-share-row--actions">
      <BHDropdown>
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
import { LucideMoreVertical } from '#components';

interface Props {
  share: Stock;
}

defineProps<Props>();
</script>

<style lang="css" scoped>
.bh-share-row {
  @apply border-b border-dark-gray-450 hover:bg-dark-gray-700/50;
  @apply transition-colors duration-200;
}

.bh-share-row--name {
  @apply px-6 py-4;
}

.share-info {
  @apply flex items-center gap-3;
}

.share-logo {
  @apply w-10 h-10 rounded-full bg-cover bg-center;
  @apply border border-border-dark;
}

.share-logo-placeholder {
  @apply w-10 h-10 rounded-full;
  @apply border border-border-dark;
  @apply flex items-center justify-center;
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
