<script setup lang="ts">
const route = useRoute();
await navigateTo(`/portfolios/${route.params.id}/resume`, { replace: true });
</script>

<template><span /></template>
