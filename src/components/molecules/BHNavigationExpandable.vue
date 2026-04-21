<template>
  <li class="bh-navigation-expandable">
    <BHButton
      class="bh-navigation-expandable--trigger"
      :class="{ 'is-expanded': isExpanded }"
      @click="toggleExpansion"
    >
      <div class="bh-navigation-expandable--trigger-content">
        <slot name="icon" :item="item" />
        {{ item.text }}
      </div>
      <LucideChevronDown
        :size="16"
        class="bh-navigation-expandable--icon"
        :class="{ 'is-rotated': isExpanded }"
      />
    </BHButton>

    <Transition name="expand">
      <ul v-show="isExpanded" class="bh-navigation-expandable--children">
        <li
          v-for="child in item.children"
          :key="child.to || child.href"
          class="bh-navigation-expandable--child"
        >
          <BHButton
            class="bh-navigation-expandable--child-button"
            :to="child.to"
            :href="child.href"
            :disabled="child.disabled"
          >
            <component :is="child.icon" v-if="child.icon" :size="18" />
            {{ child.text }}
          </BHButton>
        </li>
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import type { NavigationLink } from '~/types/navigation-link';

interface Props {
  item: NavigationLink;
}

const props = defineProps<Props>();

const [isExpanded, toggleExpansion] = useToggle(false);

// Auto-expand si une des routes enfants est active
const route = useRoute();
onMounted(() => {
  const hasActiveChild = props.item.children?.some(
    (child) => child.to && route.path.startsWith(child.to),
  );
  if (hasActiveChild) {
    isExpanded.value = true;
  }
});
</script>

<style lang="css" scoped>
.bh-navigation-expandable {
  @apply flex flex-col;
  @apply w-full;
}

.bh-navigation-expandable--trigger {
  @apply w-full py-2 px-4;
  @apply font-semibold;
  @apply justify-between;
}

.bh-navigation-expandable--trigger-content {
  @apply flex items-center gap-2;
}

.bh-navigation-expandable--icon {
  @apply transition-transform duration-200;
}

.bh-navigation-expandable--icon.is-rotated {
  @apply rotate-180;
}

.bh-navigation-expandable--children {
  @apply flex flex-col;
  @apply ml-4 mt-1;
  @apply border-l border-theme-border-primary;
}

.bh-navigation-expandable--child {
  @apply flex;
  @apply w-full;
}

.bh-navigation-expandable--child-button {
  @apply w-full py-1.5 px-4;
  @apply text-sm;
  @apply hover:bg-theme-bg-elevated;
}

.bh-navigation-expandable--child-button.exact-active-class {
  @apply bg-theme-accent-primary text-theme-text-on-accent-primary;
}

/* Animation d'expansion */
.expand-enter-active,
.expand-leave-active {
  @apply transition-all duration-200;
}

.expand-enter-from,
.expand-leave-to {
  @apply opacity-0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  @apply opacity-100;
  max-height: 200px;
}
</style>
