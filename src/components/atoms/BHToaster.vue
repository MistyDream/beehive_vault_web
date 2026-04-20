<template>
  <ClientOnly>
    <Toaster
      :theme="isDark ? 'dark' : 'light'"
      position="bottom-right"
      :close-button="true"
      rich-colors
      :toast-options="{
        style: {
          background: 'rgb(var(--color-bg-card))',
          color: 'rgb(var(--color-text-primary))',
          border: '1px solid rgb(var(--color-border-secondary))',
          fontFamily: 'Nunito, sans-serif',
        },
      }"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner';

const { isDark } = useTheme();
</script>
