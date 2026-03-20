<template>
  <section id="share-detail">
    <div class="share-detail--header">
      <BHButton class="share-detail--header--button-return" @click="goBack">
        <LucideArrowLeft :size="16" />
        {{ $t('back') }}
      </BHButton>
      <div class="share-detail--header-content">
        <div class="share-detail--header-logo">
          <slot name="logo" />
        </div>
        <div class="share-detail--header-info">
          <h1 class="share-detail--header-info--name">
            <slot name="share-name" />
          </h1>
          <div class="share-detail--header-info--meta">
            <slot name="share-meta" />
          </div>
        </div>
      </div>
      <slot name="globale-note" />
    </div>
    <div class="share-detail--categories">
      <h2 class="share-detail--categories--title">
        {{ $t('detailed-analysis-title') }}
      </h2>
      <span class="share-detail--categories--description">
        {{ $t('detailed-analysis-description') }}
      </span>
      <div class="share-detail--categories--note">
        <slot name="share-categories" />
      </div>
    </div>
    <div class="share-detail--categories-details">
      <h2 class="share-detail--categories-details--title">
        {{ $t('detailed-indicators-analysis') }}
      </h2>
      <slot name="categories" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { LucideDollarSign } from '#components';

const router = useRouter();

// Function to go back to previous page
function goBack() {
  router.back();
}
</script>

<style lang="css" scoped>
#share-detail {
  @apply flex flex-col gap-10;
  @apply py-10;
}

.share-detail--header {
  @apply relative flex justify-between px-20;
}

.share-detail--header--button-return {
  @apply absolute -top-12 left-2 h-fit;
}

.share-detail--header-content {
  @apply flex gap-4;
}

.share-detail--header-info {
  @apply flex flex-col gap-2;
  @apply h-fit;
}

.share-detail--header-info--name {
  @apply text-3xl font-poppins font-semibold text-warm-white-500;
}

.share-detail--header-info--meta {
  @apply flex gap-3;
  @apply text-sm font-poppins text-dark-gray-400;
}

.share-detail--categories {
  @apply flex flex-col items-center gap-2;
  @apply py-6 px-20;
  @apply bg-dark-gray-800;
}

.share-detail--categories--title,
.share-detail--categories-details--title {
  @apply text-2xl font-poppins text-warm-white-500;
}

.share-detail--categories--description {
  @apply max-w-xl;
  @apply text-center text-dark-gray-400;
}

.share-detail--categories--note {
  @apply flex gap-6 pt-3;
}

.share-detail--categories-details {
  @apply flex flex-col items-center gap-10;
  @apply px-20;
}
</style>
