<template>
  <div
    class="flex flex-col min-h-screen bg-background-dark text-warm-white-500"
  >
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
  @apply ml-72 p-4;
}
</style>
