<template>
  <NuxtImg :src="src" :alt="alt" class="bh-image" />
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  alt: string;
}>();
</script>

<style lang="css" scoped></style>
