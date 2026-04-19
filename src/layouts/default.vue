<template>
  <div class="app-shell flex flex-col min-h-screen bg-theme-bg-primary text-theme-text-primary">
    <BHDrawer />
    <BHHeader />
    <BHSidebar />
    <main>
      <slot />
    </main>
    <footer />
  </div>
</template>


<style lang="css" scoped>
main {
  @apply ml-0 lg:ml-72 py-4;
}
</style>
