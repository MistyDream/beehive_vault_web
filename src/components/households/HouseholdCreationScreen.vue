<template>
  <main class="household-creation-screen">
    <div
      class="household-creation-screen__pattern bh-hex-pattern"
      aria-hidden="true"
    />
    <div class="household-creation-screen__content">
      <div class="household-creation-screen__brand">
        <BHLogo class="household-creation-screen__logo" />
        <span>Beehive Vault</span>
      </div>

      <HouseholdCreationForm
        :cancelable="cancelable"
        @cancel="emit('cancel')"
        @created="handleCreated"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Household } from '~/types/household';

interface Props {
  cancelable?: boolean;
}

interface Emits {
  cancel: [];
  created: [household: Household];
}

withDefaults(defineProps<Props>(), {
  cancelable: false,
});

const emit = defineEmits<Emits>();

function handleCreated(household: Household): void {
  emit('created', household);
}
</script>

<style lang="css" scoped>
.household-creation-screen {
  @apply relative isolate flex min-h-screen w-full items-center justify-center;
  @apply overflow-hidden bg-theme-bg-primary px-4 py-8 sm:px-6 sm:py-12;
}

.household-creation-screen__pattern {
  @apply pointer-events-none absolute inset-0 -z-10 opacity-[0.04];
}

.household-creation-screen__content {
  @apply flex w-full max-w-[470px] flex-col items-center gap-6;
}

.household-creation-screen__brand {
  @apply flex items-center gap-3 text-xl font-medium tracking-tight;
  @apply text-theme-text-primary;
}

.household-creation-screen__logo {
  @apply h-14 w-auto;
}
</style>
