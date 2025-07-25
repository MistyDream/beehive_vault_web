<template>
  <ul class="bh-vertical-navigation">
    <template v-for="(item, key) in props.items" :key="key">
      <!-- Menu expendable -->
      <BHNavigationExpandable
        v-if="item.isExpandable && item.children"
        :item="item"
      >
        <template #icon="{ item: childItem }">
          <slot name="icon" :item="childItem" />
        </template>
      </BHNavigationExpandable>

      <!-- Item de navigation simple -->
      <li v-else class="bh-vertical-navigation--items">
        <BHButton
          class="bh-vertical-navigation--items__button"
          :to="item.to"
          :href="item.href"
        >
          <slot name="icon" :item="item" />
          {{ item.text }}
        </BHButton>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import type { NavigationLink } from '~/types/navigation-link';

interface Props {
  items: NavigationLink[];
}

const props = withDefaults(defineProps<Props>(), {});
</script>

<style lang="css" scoped>
.bh-vertical-navigation {
  @apply flex flex-col gap-2;
  @apply w-full;
}

.bh-vertical-navigation--items {
  @apply flex;
  @apply w-full;
}

.bh-vertical-navigation--items__button {
  @apply w-full py-2 px-4;
  @apply font-semibold;
}

.bh-vertical-navigation--items__button.exact-active-class {
  @apply bg-golden-yellow-500 text-dark-gray-900;
}
</style>
