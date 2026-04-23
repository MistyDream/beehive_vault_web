<script setup lang="ts">
definePageMeta({
  redirect: (to) => ({
    path: `${to.path.replace(/\/$/, '')}/resume`,
  }),
});
</script>

<template><span /></template>
