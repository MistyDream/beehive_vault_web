<template>
  <nav v-if="isNavMode" class="bh-tabs" :aria-label="ariaLabel">
    <template v-for="tab in tabs" :key="tab.id">
      <button
        v-if="tab.disabled"
        :id="`tab-${tab.id}`"
        type="button"
        aria-disabled="true"
        :aria-describedby="tab.tooltip ? `tab-${tab.id}-desc` : undefined"
        class="bh-tabs__tab bh-tabs__tab--disabled"
        @click.prevent
      >
        <span>{{ tab.label }}</span>
        <BHBadge
          v-if="typeof tab.count === 'number'"
          variant="neutral"
          size="sm"
        >
          {{ tab.count }}
        </BHBadge>
        <span
          v-if="tab.tooltip"
          :id="`tab-${tab.id}-desc`"
          class="sr-only"
        >
          {{ tab.tooltip }}
        </span>
      </button>
      <NuxtLink
        v-else
        :id="`tab-${tab.id}`"
        :to="tab.to ?? ''"
        :aria-current="isTabActive(tab) ? 'page' : undefined"
        :aria-describedby="tab.tooltip ? `tab-${tab.id}-desc` : undefined"
        active-class="bh-tabs__tab--active"
        class="bh-tabs__tab"
        :class="{ 'bh-tabs__tab--muted': tab.muted }"
      >
        <span>{{ tab.label }}</span>
        <BHBadge
          v-if="typeof tab.count === 'number'"
          variant="neutral"
          size="sm"
        >
          {{ tab.count }}
        </BHBadge>
        <span
          v-if="tab.tooltip"
          :id="`tab-${tab.id}-desc`"
          class="sr-only"
        >
          {{ tab.tooltip }}
        </span>
      </NuxtLink>
    </template>
  </nav>

  <div
    v-else
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
  to?: string;
}

interface Props {
  modelValue?: string;
  tabs: TabItem[];
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  ariaLabel: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isNavMode = computed(() => props.tabs.some((t) => typeof t.to === 'string'));

const route = useRoute();
function isTabActive(tab: TabItem): boolean {
  return !!tab.to && route.path === tab.to;
}

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
  @apply no-underline;
  @apply hover:text-theme-text-primary;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme-accent-primary;
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
