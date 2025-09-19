<template>
  <div v-if="showWrapper" class="bh-drawer-wrapper">
    <div class="bh-drawer-overlay" @click="close" />

    <Transition name="drawer" @after-leave="toggleWrapper">
      <div v-if="showDrawer" class="bh-drawer">
        <div class="bh-drawer--header">
          <BHButton class="absolute top-0 left-0 text-dark-gray-400">
            <LucideChevronsRight :size="20" />
          </BHButton>
          <component :is="icon" :size="24" class="bh-drawer--header__icon" />
          <h1>{{ title }}</h1>
        </div>
        <div class="bh-drawer--content">
          <component :is="content" v-bind="props" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const {
  showWrapper,
  showDrawer,
  title,
  icon,
  content,
  props,
  toggleWrapper,
  close,
} = useDrawer();
</script>

<style lang="css" scoped>
.drawer-enter-active {
  animation: slideInRight;
  animation-duration: 0.3s;
}

.drawer-leave-active {
  animation: slideOutRight;
  animation-duration: 0.3s;
}

/* Wrapper qui contient l'overlay et le drawer */
.bh-drawer-wrapper {
  @apply fixed inset-0 z-50;
}

/* Overlay sombre qui couvre toute la page */
.bh-drawer-overlay {
  @apply absolute inset-0;
  @apply bg-black bg-opacity-50;
  @apply cursor-pointer;
}

/* Le drawer lui-même */
.bh-drawer {
  @apply absolute top-0 right-0;
  @apply w-1/2 h-screen p-4;
  @apply bg-dark-gray-500;
  @apply shadow-2xl;
}

.bh-drawer--header {
  @apply flex gap-2 items-center justify-start;
  @apply p-4;
  @apply font-poppins text-xl font-bold text-warm-white-500;
}

.bh-drawer--header__icon {
  @apply text-warm-white-500;
}

.bh-drawer--content {
  @apply p-4;
}
</style>
