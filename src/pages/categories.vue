<template>
  <CategoryCollectionScreen
    v-if="activeHousehold"
    :key="activeHousehold.id"
    :household-id="activeHousehold.id"
  />
</template>

<script setup lang="ts">
const { activeHousehold } = useActiveHousehold();
</script>
