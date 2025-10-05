<template>
  <div
    class="flex flex-col min-h-screen bg-background-dark text-warm-white-500"
  >
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
  @apply ml-72 py-4;
}
</style>
