<template>
  <section class="flex flex-col gap-4">
    <!-- <BHCard>
      <template #title>Titre</template>
      <BHExpendable />
    </BHCard>
    <BHCard>
      <template #title>Titre</template>
      <BHExpendable />
    </BHCard> -->
  </section>
</template>

<script setup lang="ts">
import { useUpdateHeader } from '~/composables/updateHeader';

const { updateHeader } = useUpdateHeader();

onMounted(() => {
  updateHeader({
    title: 'Comptes bancaires',
    subtitle: 'Gérez vos comptes bancaires',
  });
});
</script>
