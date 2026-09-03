<template>
  <ActiveHouseholdGate>
    <template #creation>
      <HouseholdCreationScreen
        :cancelable="!!activeHousehold"
        @cancel="cancelCreation"
      />
    </template>
    <template #selection="{ households }">
      <HouseholdCreationScreen
        v-if="isCreatingAdditionalHousehold"
        cancelable
        @cancel="closeHouseholdCreation"
        @created="closeHouseholdCreation"
      />
      <HouseholdSelectionScreen
        v-else
        :cancelable="!!activeHousehold"
        :households="households"
        :last-used-household-id="activeHousehold?.id"
        @cancel="cancelSelection"
        @create="openHouseholdCreation"
      />
    </template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ActiveHouseholdGate>
</template>

<script setup lang="ts">
const { locale } = useI18n();

const { activeHousehold, cancelCreation, cancelSelection } =
  useActiveHousehold();

useHead({
  htmlAttrs: computed(() => ({ lang: locale.value })),
});

const isCreatingAdditionalHousehold = ref(false);

function openHouseholdCreation(): void {
  isCreatingAdditionalHousehold.value = true;
}

function closeHouseholdCreation(): void {
  isCreatingAdditionalHousehold.value = false;
}
</script>
