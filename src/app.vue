<template>
  <ActiveHouseholdGate>
    <template #creation>
      <HouseholdCreationScreen />
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
        :households="households"
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
