<template>
  <div
    v-if="
      status === ACTIVE_HOUSEHOLD_STATUS.IDLE ||
      status === ACTIVE_HOUSEHOLD_STATUS.LOADING
    "
    class="active-household-gate__loading"
    role="status"
  >
    {{ t('household.loading') }}
  </div>
  <div
    v-else-if="status === ACTIVE_HOUSEHOLD_STATUS.ERROR"
    class="active-household-gate__error"
    role="alert"
  >
    <h1 ref="errorTitle" tabindex="-1">
      {{ t('household.load_error_title') }}
    </h1>
    <p>{{ t('household.load_error_description') }}</p>
    <BHButton @click="initialize">
      {{ t('common.retry') }}
    </BHButton>
  </div>
  <slot
    v-else-if="status === ACTIVE_HOUSEHOLD_STATUS.NEEDS_CREATION"
    name="creation"
  />
  <slot
    v-else-if="status === ACTIVE_HOUSEHOLD_STATUS.NEEDS_SELECTION"
    name="selection"
    :households="households"
  />
  <slot v-else-if="status === ACTIVE_HOUSEHOLD_STATUS.READY" />
</template>

<script setup lang="ts">
import { ACTIVE_HOUSEHOLD_STATUS } from '~/constants/household';

const { t } = useI18n();

const { status, households, initialize } = useActiveHousehold();

onMounted(async () => {
  await initialize();
});

const errorTitle = ref<HTMLElement | null>(null);

watch(status, async (currentStatus) => {
  if (currentStatus !== ACTIVE_HOUSEHOLD_STATUS.ERROR) {
    return;
  }

  await nextTick();
  errorTitle.value?.focus();
});
</script>

<style lang="css" scoped>
@keyframes household-loading {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.active-household-gate__loading,
.active-household-gate__error {
  @apply flex min-h-screen w-full flex-col items-center justify-center;
  @apply bg-theme-bg-primary px-6 py-10 text-center;
}

.active-household-gate__loading {
  @apply gap-4 text-sm font-medium text-theme-text-secondary;
}

.active-household-gate__loading::before {
  content: '';
  @apply h-10 w-10 rounded-full border-2;
  @apply border-theme-border-primary border-t-theme-accent-primary;
  animation: household-loading 800ms linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .active-household-gate__loading::before {
    animation: none;
  }
}

.active-household-gate__error {
  @apply text-theme-text-primary;
}

.active-household-gate__error h1 {
  @apply text-2xl font-medium focus:outline-none;
}

.active-household-gate__error p {
  @apply mt-3 max-w-md text-sm text-theme-text-secondary;
}

.active-household-gate__error button {
  @apply mt-6;
}
</style>
