<template>
  <div ref="menu-ref" class="bh-expendable">
    <BHButton class="bh-expendable--head" @click="toggleMenu">
      <LucideChevronDown :size="18" />
      Compte courants
    </BHButton>
    <BHSeparator />
    <Transition name="fade">
      <ul v-show="isOpen" class="bh-expendable--list">
        <li>Caisse d'Epargne</li>
        <li>Trade Republic</li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const [isOpen, toggleMenu] = useToggle(false);
const menuRef = useTemplateRef<HTMLElement>('menu-ref');

onClickOutside(menuRef, () => {
  isOpen.value = false;
});
</script>

<style lang="css" scoped>
.fade-enter-active {
  animation: bh-slideInDown 0.3s ease-out;
}

.fade-leave-active {
  animation: bh-slideOutUp 0.3s ease-in;
}

.bh-expendable {
  @apply flex flex-col grow;
  @apply bg-theme-bg-card border rounded-lg border-theme-border-primary;
}

.bh-expendable--head {
  @apply py-4 z-[2];
  @apply hover:bg-inherit;
}

.bh-expendable--list {
  @apply flex flex-col gap-2;
  /* animation: fadeOut; */
}

.bh-expendable--list li {
  @apply flex items-center;
  @apply min-h-10 px-3 py-2;
  @apply border-b border-b-theme-border-primary last:border-none;
}
</style>
