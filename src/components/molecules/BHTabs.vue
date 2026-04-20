<template>
  <div
    class="bh-tabs"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <button
      v-for="(tab, index) in tabs"
      :key="tab.id"
      :ref="(el) => registerTab(el as HTMLElement | null, index)"
      type="button"
      role="tab"
      :aria-selected="tab.id === modelValue"
      :aria-disabled="tab.disabled || undefined"
      :tabindex="tab.id === modelValue ? 0 : -1"
      :disabled="tab.disabled"
      :title="tab.tooltip || undefined"
      class="bh-tabs__tab"
      :class="{
        'bh-tabs__tab--active': tab.id === modelValue,
        'bh-tabs__tab--muted': tab.muted,
        'bh-tabs__tab--disabled': tab.disabled,
      }"
      @click="select(tab)"
      @keydown.left.prevent="move(-1)"
      @keydown.right.prevent="move(1)"
      @keydown.home.prevent="move('start')"
      @keydown.end.prevent="move('end')"
    >
      <span>{{ tab.label }}</span>
      <BHBadge
        v-if="typeof tab.count === 'number'"
        variant="neutral"
        size="sm"
      >
        {{ tab.count }}
      </BHBadge>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
  muted?: boolean;
  tooltip?: string;
}

interface Props {
  modelValue: string;
  tabs: TabItem[];
  ariaLabel?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const tabRefs = ref<Array<HTMLElement | null>>([]);

function registerTab(el: HTMLElement | null, index: number) {
  tabRefs.value[index] = el;
}

function select(tab: TabItem) {
  if (tab.disabled || tab.muted || tab.id === props.modelValue) return;
  emit('update:modelValue', tab.id);
}

function firstEnabledFrom(start: number, direction: 1 | -1): number {
  const len = props.tabs.length;
  if (len === 0) return -1;
  let i = start;
  for (let step = 0; step < len; step++) {
    if (i < 0) i = len - 1;
    if (i >= len) i = 0;
    const candidate = props.tabs[i];
    if (!candidate.disabled && !candidate.muted) return i;
    i += direction;
  }
  return -1;
}

function move(action: -1 | 1 | 'start' | 'end') {
  const currentIndex = props.tabs.findIndex((t) => t.id === props.modelValue);
  if (currentIndex === -1) return;

  let targetIndex: number;
  if (action === 'start') {
    targetIndex = firstEnabledFrom(0, 1);
  } else if (action === 'end') {
    targetIndex = firstEnabledFrom(props.tabs.length - 1, -1);
  } else {
    targetIndex = firstEnabledFrom(currentIndex + action, action);
  }

  if (targetIndex >= 0 && targetIndex !== currentIndex) {
    emit('update:modelValue', props.tabs[targetIndex].id);
    nextTick(() => tabRefs.value[targetIndex]?.focus());
  }
}
</script>

<style lang="css" scoped>
.bh-tabs {
  @apply flex items-stretch gap-1;
  @apply border-b border-theme-border-secondary;
  @apply overflow-x-auto overflow-y-hidden;
}

.bh-tabs__tab {
  @apply relative flex items-center gap-2;
  @apply px-4 py-3;
  @apply text-sm font-medium whitespace-nowrap;
  @apply text-theme-text-secondary;
  @apply border-b-2 border-transparent;
  @apply -mb-px;
  @apply transition-colors duration-150;
  @apply hover:text-theme-text-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:rounded-md;
}

.bh-tabs__tab--active {
  @apply text-theme-text-primary;
  @apply border-theme-accent-primary;
}

.bh-tabs__tab--muted {
  @apply text-theme-text-muted cursor-default;
  @apply hover:text-theme-text-muted;
}

.bh-tabs__tab--disabled {
  @apply cursor-not-allowed opacity-50;
  @apply hover:text-theme-text-secondary;
}
</style>
