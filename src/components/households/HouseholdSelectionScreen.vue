<template>
  <main class="household-selection-screen">
    <div
      class="household-selection-screen__pattern bh-hex-pattern"
      aria-hidden="true"
    />
    <div class="household-selection-screen__content">
      <div class="household-selection-screen__brand">
        <BHLogo class="household-selection-screen__logo" />
        <span>Beehive Vault</span>
      </div>

      <section class="household-selection-screen__panel">
        <h1 ref="titleElement" tabindex="-1">
          {{ t('household.selection.title') }}
        </h1>
        <p class="household-selection-screen__description">
          {{ t('household.selection.description') }}
        </p>

        <ul class="household-selection-screen__list">
          <li v-for="household in households" :key="household.id">
            <button
              type="button"
              class="household-selection-screen__choice"
              @click="selectHousehold(household)"
            >
              <span
                class="household-selection-screen__monogram"
                aria-hidden="true"
              >
                {{ getHouseholdMonogram(household.name, locale) }}
              </span>
              <span class="household-selection-screen__details">
                <strong>{{ household.name }}</strong>
                <span>
                  {{ household.baseCurrency }} · {{ household.timezone }}
                  <span
                    v-if="household.id === lastUsedHouseholdId"
                    class="household-selection-screen__last-used"
                  >
                    · {{ t('household.selection.last_used') }}
                  </span>
                </span>
              </span>
              <LucideArrowRight
                class="household-selection-screen__arrow"
                :size="18"
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>

        <div class="household-selection-screen__actions">
          <BHButton v-if="cancelable" variant="ghost" @click="emit('cancel')">
            {{ t('common.cancel') }}
          </BHButton>
          <BHButton
            class="household-selection-screen__create"
            variant="secondary"
            @click="emit('create')"
          >
            {{ t('household.selection.create') }}
          </BHButton>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Household, HouseholdId } from '~/types/household';

interface Props {
  cancelable?: boolean;
  households: readonly Household[];
  lastUsedHouseholdId?: HouseholdId;
}

interface Emits {
  cancel: [];
  create: [];
  selected: [household: Household];
}

withDefaults(defineProps<Props>(), {
  cancelable: false,
  lastUsedHouseholdId: undefined,
});
const emit = defineEmits<Emits>();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { activate } = useActiveHousehold();
const titleElement = ref<HTMLHeadingElement | null>(null);

onMounted(() => {
  titleElement.value?.focus();
});

async function selectHousehold(household: Household): Promise<void> {
  activate(household);
  emit('selected', household);
  await navigateTo(localePath('/'));
}
</script>

<style lang="css" scoped>
.household-selection-screen {
  @apply relative isolate flex min-h-screen w-full items-center justify-center;
  @apply overflow-hidden bg-theme-bg-primary px-4 py-8 sm:px-6 sm:py-12;
}

.household-selection-screen__pattern {
  @apply pointer-events-none absolute inset-0 -z-10 opacity-[0.04];
}

.household-selection-screen__content {
  @apply flex w-full max-w-[650px] flex-col items-center gap-6;
}

.household-selection-screen__brand {
  @apply flex items-center gap-3 text-xl font-medium tracking-tight;
  @apply text-theme-text-primary;
}

.household-selection-screen__logo {
  @apply h-14 w-auto;
}

.household-selection-screen__panel {
  @apply w-full rounded-surface border border-theme-border-primary;
  @apply bg-theme-bg-card p-6 shadow-surface sm:p-8;
}

.household-selection-screen__panel h1 {
  @apply text-2xl font-medium text-theme-text-primary focus:outline-none;
}

.household-selection-screen__description {
  @apply mb-6 mt-2 text-sm leading-6 text-theme-text-secondary;
}

.household-selection-screen__list {
  @apply grid gap-3;
}

.household-selection-screen__choice {
  @apply grid min-h-[68px] w-full grid-cols-[auto_1fr_auto] items-center gap-3;
  @apply rounded-control border border-theme-border-primary bg-theme-bg-primary;
  @apply px-3 py-3 text-left text-theme-text-primary;
  @apply enabled:hover:border-theme-accent-secondary;
  @apply focus-visible:border-transparent focus-visible:outline-none;
  @apply focus-visible:ring-2 focus-visible:ring-theme-accent-primary;
  transition:
    background-color 150ms ease-out,
    border-color 150ms ease-out,
    box-shadow 150ms ease-out;
}

.household-selection-screen__choice:hover {
  @apply bg-theme-bg-elevated;
}

.household-selection-screen__monogram {
  @apply grid h-11 w-11 place-items-center rounded-control;
  @apply bg-theme-bg-elevated-strong text-sm font-medium text-theme-text-primary;
}

.household-selection-screen__details {
  @apply min-w-0;
}

.household-selection-screen__details strong,
.household-selection-screen__details > span {
  @apply block;
}

.household-selection-screen__details strong {
  @apply truncate text-sm font-medium;
}

.household-selection-screen__details > span {
  @apply mt-1 break-words text-xs text-theme-text-secondary;
}

.household-selection-screen__last-used {
  @apply text-theme-accent-secondary-strong;
}

.household-selection-screen__arrow {
  @apply text-theme-text-muted;
}

.household-selection-screen__actions {
  @apply mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end;
}

.household-selection-screen__actions :deep(.bh-button) {
  @apply w-full sm:w-auto;
}

.household-selection-screen__actions :deep(.bh-button:only-child) {
  @apply sm:w-full;
}
</style>
