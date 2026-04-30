<template>
  <div class="bh-searchable-select">
    <label v-if="label" :for="triggerId" class="bh-searchable-select__label">
      {{ label }}
    </label>
    <div ref="selectRef" class="bh-searchable-select__wrapper">
      <button
        :id="triggerId"
        type="button"
        role="combobox"
        class="bh-searchable-select__control"
        :class="{
          'bh-searchable-select__control--disabled': disabled,
          'bh-searchable-select__control--open': isOpen,
          'bh-searchable-select__control--error': !!error,
        }"
        :disabled="disabled"
        :aria-haspopup="'listbox'"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-describedby="error ? errorId : undefined"
        :aria-invalid="!!error || undefined"
        @click="toggleDropdown"
        @keydown.enter.prevent="openAndFocusSearch"
        @keydown.space.prevent="openAndFocusSearch"
        @keydown.down.prevent="openAndFocusSearch"
      >
        <span
          class="bh-searchable-select__value"
          :class="{ 'bh-searchable-select__placeholder': !hasValue }"
        >
          <slot v-if="hasValue" name="selected" :options="selectedOptions">
            {{ displayLabel }}
          </slot>
          <template v-else>{{ displayLabel }}</template>
        </span>
        <button
          v-if="clearable && hasValue && !disabled"
          type="button"
          class="bh-searchable-select__clear"
          :aria-label="resolvedClearLabel"
          @click.stop="onClear"
          @keydown.enter.stop.prevent="onClear"
          @keydown.space.stop.prevent="onClear"
        >
          <LucideX :size="14" aria-hidden="true" />
        </button>
        <LucideChevronDown
          class="bh-searchable-select__icon"
          :class="{ 'bh-searchable-select__icon--open': isOpen }"
          :size="16"
          aria-hidden="true"
        />
      </button>
    </div>
    <Teleport to="body">
      <Transition name="bh-searchable-select-dropdown">
        <div
          v-if="isOpen"
          ref="floatingRef"
          :style="[floatingStyles, !isPositioned && { visibility: 'hidden' }]"
          class="bh-searchable-select__panel"
        >
          <div class="bh-searchable-select__search">
            <LucideSearch
              :size="14"
              class="bh-searchable-select__search-icon"
              aria-hidden="true"
            />
            <input
              ref="searchRef"
              v-model="searchQuery"
              type="text"
              role="searchbox"
              class="bh-searchable-select__search-input"
              :placeholder="searchPlaceholder"
              :aria-controls="listboxId"
              :aria-activedescendant="
                activeIndex >= 0 ? optionId(activeIndex) : undefined
              "
              @keydown.down.prevent="onArrowDown"
              @keydown.up.prevent="onArrowUp"
              @keydown.home.prevent="onHome"
              @keydown.end.prevent="onEnd"
              @keydown.enter.prevent="onEnter"
              @keydown.escape.stop.prevent="closeDropdown"
            >
          </div>
          <ul
            :id="listboxId"
            class="bh-searchable-select__options"
            role="listbox"
            :aria-multiselectable="multiple"
            :aria-busy="remote && loading ? true : undefined"
          >
            <li
              v-if="belowMinSearch"
              class="bh-searchable-select__hint"
              role="presentation"
            >
              {{ minSearchHint }}
            </li>
            <li
              v-else-if="remote && loading"
              class="bh-searchable-select__hint bh-searchable-select__hint--loading"
              role="status"
              aria-live="polite"
            >
              <LucideLoader2
                :size="14"
                class="bh-searchable-select__spinner"
                aria-hidden="true"
              />
              <span>{{ t('common.loading') }}</span>
            </li>
            <template v-else>
              <li
                v-for="(option, index) in filteredOptions"
                :id="optionId(index)"
                :key="option.value"
                class="bh-searchable-select__option"
                :class="{
                  'bh-searchable-select__option--selected': isSelected(option.value),
                  'bh-searchable-select__option--active': index === activeIndex,
                }"
                role="option"
                :aria-selected="isSelected(option.value)"
                @click="onOptionSelect(option)"
                @mouseenter="activeIndex = index"
              >
                <span class="bh-searchable-select__option-body">
                  <slot name="option" :option="option" :selected="isSelected(option.value)">
                    <span class="bh-searchable-select__option-label">{{ option.label }}</span>
                    <span
                      v-if="option.description"
                      class="bh-searchable-select__option-description"
                    >
                      {{ option.description }}
                    </span>
                  </slot>
                </span>
                <LucideCheck
                  v-if="isSelected(option.value)"
                  :size="16"
                  aria-hidden="true"
                  class="bh-searchable-select__option-check"
                />
              </li>
              <li
                v-if="filteredOptions.length === 0"
                class="bh-searchable-select__empty"
                role="presentation"
              >
                {{ resolvedEmptyText }}
              </li>
              <li
                v-if="truncated && filteredOptions.length > 0"
                class="bh-searchable-select__truncated"
                role="note"
                aria-live="polite"
              >
                {{ truncatedHint }}
              </li>
            </template>
          </ul>
        </div>
      </Transition>
    </Teleport>
    <p v-if="error" :id="errorId" role="alert" class="bh-searchable-select__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  LucideCheck,
  LucideChevronDown,
  LucideLoader2,
  LucideSearch,
  LucideX,
} from '#components';
import {
  useFloating,
  offset as offsetMiddleware,
  flip,
  shift,
  size,
  autoUpdate,
} from '@floating-ui/vue';

type PrimitiveValue = string | number;
type SelectValue = PrimitiveValue | null | undefined;

export interface SearchableOption {
  label: string;
  value: PrimitiveValue;
  description?: string;
}

interface Props {
  label?: string;
  id?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearLabel?: string;
  modelValue?: SelectValue | PrimitiveValue[];
  disabled?: boolean;
  options?: SearchableOption[];
  multiple?: boolean;
  clearable?: boolean;
  error?: string;
  remote?: boolean;
  loading?: boolean;
  truncated?: boolean;
  truncatedHint?: string;
  minSearchChars?: number;
  minSearchHint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  placeholder: '',
  searchPlaceholder: '',
  emptyText: '',
  clearLabel: '',
  modelValue: null,
  disabled: false,
  options: () => [],
  multiple: false,
  clearable: true,
  error: '',
  remote: false,
  loading: false,
  truncated: false,
  truncatedHint: '',
  minSearchChars: 0,
  minSearchHint: '',
});

const { t } = useI18n();
const resolvedEmptyText = computed(() => props.emptyText || t('common.no_results'));
const resolvedClearLabel = computed(() => props.clearLabel || t('common.clear_selection'));

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue | PrimitiveValue[]): void;
  (e: 'search', query: string): void;
}>();

const selectRef = ref<HTMLElement | null>(null);
const floatingRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref('');
const debouncedQuery = refDebounced(searchQuery, 150);
const activeIndex = ref(-1);

const { triggerId, listboxId, errorId, optionId } = useSelectIds(() => props.id);

// When this select opens inside a BHModal, the modal's focus trap would
// intercept the search input focus (the panel is teleported to body, outside
// the trap container). Pause the trap while the dropdown is open.
const pauseModalTrap = inject<(() => void) | null>('bh-modal-trap-pause', null);
const unpauseModalTrap = inject<(() => void) | null>(
  'bh-modal-trap-unpause',
  null,
);
watch(isOpen, (open) => {
  if (open) pauseModalTrap?.();
  else unpauseModalTrap?.();
});

const { floatingStyles, isPositioned } = useFloating(selectRef, floatingRef, {
  placement: 'bottom-start',
  middleware: [
    offsetMiddleware(8),
    flip({ padding: 8 }),
    shift({ padding: 8 }),
    size({
      apply({ rects, elements, availableHeight }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${Math.min(availableHeight - 8, 320)}px`,
        });
      },
      padding: 8,
    }),
  ],
  strategy: 'fixed',
  transform: false,
  whileElementsMounted: autoUpdate,
});

const normalizedValues = computed<PrimitiveValue[]>(() => {
  if (props.modelValue === null || props.modelValue === undefined) return [];
  if (Array.isArray(props.modelValue)) return props.modelValue as PrimitiveValue[];
  return [props.modelValue as PrimitiveValue];
});

const selectedOptions = computed(() =>
  props.options.filter((option) => normalizedValues.value.includes(option.value)),
);

const hasValue = computed(() => selectedOptions.value.length > 0);

const displayLabel = computed(() => {
  if (!hasValue.value) return props.placeholder;
  if (!props.multiple) return selectedOptions.value[0]!.label;
  const count = selectedOptions.value.length;
  if (count === 1) return selectedOptions.value[0]!.label;
  return t('common.select_n_selected', count);
});

const trimmedQueryLength = computed(() => debouncedQuery.value.trim().length);
const belowMinSearch = computed(
  () => props.remote && props.minSearchChars > 0 && trimmedQueryLength.value < props.minSearchChars,
);

const filteredOptions = computed(() => {
  if (props.remote) return props.options;
  const q = debouncedQuery.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((opt) => {
    const label = opt.label.toLowerCase();
    const desc = opt.description?.toLowerCase() ?? '';
    return label.includes(q) || desc.includes(q);
  });
});

watch(debouncedQuery, (q) => {
  if (!props.remote) return;
  const trimmed = q.trim();
  if (props.minSearchChars > 0 && trimmed.length < props.minSearchChars) return;
  emit('search', trimmed);
});

function isSelected(value: PrimitiveValue) {
  return normalizedValues.value.includes(value);
}

function onClear() {
  if (props.disabled) return;
  emit('update:modelValue', props.multiple ? [] : null);
}

function onOptionSelect(option: SearchableOption) {
  if (props.multiple) {
    const current = [...normalizedValues.value];
    const idx = current.indexOf(option.value);
    if (idx === -1) current.push(option.value);
    else current.splice(idx, 1);
    emit('update:modelValue', current);
    return;
  }
  emit('update:modelValue', isSelected(option.value) ? null : option.value);
  closeDropdown();
}

function toggleDropdown() {
  if (props.disabled) return;
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function openAndFocusSearch() {
  if (props.disabled) return;
  openDropdown();
}

function openDropdown() {
  isOpen.value = true;
  syncActiveIndexToSelection();
  nextTick(() => searchRef.value?.focus());
}

function closeDropdown() {
  isOpen.value = false;
  searchQuery.value = '';
}

function syncActiveIndexToSelection() {
  const idx = filteredOptions.value.findIndex((opt) =>
    normalizedValues.value.includes(opt.value),
  );
  activeIndex.value = idx >= 0 ? idx : filteredOptions.value.length > 0 ? 0 : -1;
}

function onArrowDown() {
  const len = filteredOptions.value.length;
  if (len === 0) return;
  activeIndex.value = activeIndex.value < len - 1 ? activeIndex.value + 1 : 0;
}

function onArrowUp() {
  const len = filteredOptions.value.length;
  if (len === 0) return;
  activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : len - 1;
}

function onHome() {
  if (filteredOptions.value.length > 0) activeIndex.value = 0;
}

function onEnd() {
  const len = filteredOptions.value.length;
  if (len > 0) activeIndex.value = len - 1;
}

function onEnter() {
  const option = filteredOptions.value[activeIndex.value];
  if (option) onOptionSelect(option);
}

watch(filteredOptions, () => {
  if (activeIndex.value >= filteredOptions.value.length) {
    activeIndex.value = filteredOptions.value.length > 0 ? 0 : -1;
  }
});

onClickOutside(
  selectRef,
  () => {
    if (isOpen.value) closeDropdown();
  },
  { ignore: [floatingRef] },
);
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

.bh-searchable-select {
  @apply flex flex-col gap-2 w-full;
}

.bh-searchable-select__label {
  @apply text-sm text-theme-text-primary font-medium;
}

.bh-searchable-select__wrapper {
  @apply relative;
}

.bh-searchable-select__control {
  @apply w-full px-4 py-2 rounded-lg cursor-pointer;
  @apply bg-theme-bg-card;
  @apply border border-theme-border-secondary;
  @apply text-sm text-theme-text-primary font-medium;
  @apply flex items-center justify-between gap-2 text-left;
  @apply transition-colors duration-150 ease-out;
  @apply focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-searchable-select__control--disabled {
  @apply cursor-not-allowed text-theme-text-muted;
}

.bh-searchable-select__control--open {
  @apply border-theme-accent-secondary;
}

.bh-searchable-select__control--error {
  @apply border-theme-status-error;
}

.bh-searchable-select__value {
  @apply flex-1 min-w-0 truncate;
}

.bh-searchable-select__placeholder {
  @apply text-theme-text-muted;
}

.bh-searchable-select__clear {
  @apply inline-flex items-center justify-center;
  @apply w-6 h-6 rounded-full shrink-0;
  @apply text-theme-text-muted;
  @apply hover:bg-theme-bg-elevated hover:text-theme-text-primary;
  @apply transition-colors duration-100;
  @apply focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-searchable-select__icon {
  @apply text-theme-text-primary pointer-events-none;
  @apply transition-transform duration-150 ease-out;
}

.bh-searchable-select__icon--open {
  @apply rotate-180;
}

.bh-searchable-select__panel {
  @apply z-80;
  @apply bg-theme-bg-card border border-theme-border-secondary rounded-lg shadow-xl;
  @apply overflow-hidden flex flex-col;
}

.bh-searchable-select__search {
  @apply relative px-3 py-2 border-b border-theme-border-primary;
}

.bh-searchable-select__search-icon {
  @apply absolute left-5 top-1/2 -translate-y-1/2 text-theme-text-muted pointer-events-none;
}

.bh-searchable-select__search-input {
  @apply w-full pl-7 pr-2 py-1 rounded-md;
  @apply bg-transparent text-sm text-theme-text-primary;
  @apply placeholder:text-theme-text-muted;
  @apply focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
}

.bh-searchable-select__options {
  @apply flex-1 overflow-auto;
}

.bh-searchable-select__option {
  @apply flex items-center justify-between gap-2;
  @apply px-4 py-2 text-sm text-theme-text-primary cursor-pointer;
  @apply transition-colors duration-100;
}

.bh-searchable-select__option:hover,
.bh-searchable-select__option--active {
  @apply bg-theme-bg-elevated text-theme-accent-primary-strong;
}

.bh-searchable-select__option--selected,
.bh-searchable-select__option--selected:hover {
  @apply bg-theme-accent-secondary/15 text-theme-accent-secondary-strong font-semibold;
}

.bh-searchable-select__option-body {
  @apply flex flex-col min-w-0 gap-0.5 flex-1;
}

.bh-searchable-select__option-label {
  @apply truncate;
}

.bh-searchable-select__option-description {
  @apply text-xs text-theme-text-secondary truncate;
}

.bh-searchable-select__option-check {
  @apply shrink-0 text-theme-accent-secondary-strong;
}

.bh-searchable-select__empty {
  @apply px-4 py-6 text-sm text-theme-text-muted text-center;
}

.bh-searchable-select__hint {
  @apply px-4 py-6 text-sm text-theme-text-muted text-center;
}

.bh-searchable-select__hint--loading {
  @apply inline-flex items-center justify-center gap-2 w-full;
}

.bh-searchable-select__spinner {
  @apply animate-spin;
}

.bh-searchable-select__truncated {
  @apply px-4 py-2 text-xs text-theme-text-muted text-center;
  @apply border-t border-theme-border-secondary/60;
}

.bh-searchable-select__error {
  @apply text-theme-status-error text-xs mt-1;
}

.bh-searchable-select-dropdown-enter-active,
.bh-searchable-select-dropdown-leave-active {
  @apply transition ease-out duration-150;
}

.bh-searchable-select-dropdown-enter-from,
.bh-searchable-select-dropdown-leave-to {
  @apply opacity-0 translate-y-2;
}

.bh-searchable-select-dropdown-enter-to,
.bh-searchable-select-dropdown-leave-from {
  @apply opacity-100 translate-y-0;
}
</style>
