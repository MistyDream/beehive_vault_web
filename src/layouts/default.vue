<template>
  <div class="app-shell flex flex-col min-h-screen bg-theme-bg-primary text-theme-text-primary">
    <a href="#main-content" class="app-shell__skip-link">
      {{ t('a11y.skip_to_main') }}
    </a>
    <BHDrawer />
    <BHHeader />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <BHSidebar />
    <footer />
    <BHToaster />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="css" scoped>
@reference "~/assets/css/main.css";

main {
  @apply ml-0 lg:ml-72 py-4;
}

.app-shell__skip-link {
  @apply fixed top-2 left-2 z-[100];
  @apply -translate-y-20 focus:translate-y-0;
  @apply px-4 py-2 rounded-md;
  @apply bg-theme-accent-primary text-theme-text-on-accent-primary;
  @apply font-medium text-sm no-underline;
  @apply transition-transform duration-150;
  @apply focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2;
}
</style>
