export function useTheme() {
  const mode = useColorMode({
    storageKey: 'bh-theme',
    initialValue: 'dark',
    disableTransition: false,
    modes: {
      light: 'light',
      dark: 'dark',
    },
  });

  const isDark = computed(() => mode.value === 'dark');

  function toggle() {
    mode.value = isDark.value ? 'light' : 'dark';
  }

  return {
    theme: computed(() => mode.value),
    isDark,
    toggle,
  };
}
