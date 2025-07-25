<template>
  <div />
</template>

<script setup lang="ts">
import { useUpdateHeader } from '~/composables/updateHeader';

const { updateHeader } = useUpdateHeader();

onMounted(() => {
  updateHeader({
    title: 'Paramètres',
    subtitle: '',
  });
});
</script>
