<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
await navigateTo(localePath(`/portfolios/${route.params.id}/resume`), {
  replace: true,
});
</script>

<template><span /></template>
