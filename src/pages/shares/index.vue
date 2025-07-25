<template>
  <section id="shares-overview">
    <div class="shares-overview--stats">
      <BHCard>
        <template #title>Statistiques du portefeuille</template>
        <div class="stats-grid">
          <div class="stat-item">
            <h3>Valeur totale</h3>
            <p class="stat-value">€125,450</p>
          </div>
          <div class="stat-item">
            <h3>Nombre d'actions</h3>
            <p class="stat-value">3</p>
          </div>
          <div class="stat-item">
            <h3>Performance</h3>
            <p class="stat-value text-green-500">+12.5%</p>
          </div>
        </div>
      </BHCard>
    </div>

    <div class="shares-overview--actions">
      <BHCard>
        <template #title>Actions rapides</template>
        <div class="actions-grid">
          <BHButton variant="primary" to="/shares/classifications">
            Voir les classifications
          </BHButton>
          <BHButton variant="secondary"> Ajouter une action </BHButton>
        </div>
      </BHCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUpdateHeader } from '~/composables/updateHeader';

const { updateHeader } = useUpdateHeader();

onMounted(() => {
  updateHeader({
    title: 'Actions & Valorisations',
    subtitle:
      "Vue d'ensemble de votre portefeuille d'actions et de leurs performances",
  });
});
</script>

<style lang="css" scoped>
.shares-overview--header {
  @apply mb-6;
}

.shares-overview--header h1 {
  @apply text-2xl font-bold mb-2;
}

.shares-overview--subtitle {
  @apply text-gray-400;
}

.shares-overview--stats,
.shares-overview--actions {
  @apply mb-6;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.stat-item {
  @apply text-center;
}

.stat-item h3 {
  @apply text-sm font-medium text-gray-400 mb-1;
}

.stat-value {
  @apply text-xl font-bold;
}

.actions-grid {
  @apply flex gap-4 flex-wrap;
}
</style>
