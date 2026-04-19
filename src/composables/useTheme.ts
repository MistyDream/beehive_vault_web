export function useTheme() {
  const mode = useColorMode({
    initialValue: 'dark',
    modes: {
      light: 'light',
      dark: 'dark',
    },
  });

  const isDark = computed(() => mode.value === 'dark');

  function toggleTheme() {
    mode.value = isDark.value ? 'light' : 'dark';
  }

  return {
    theme: computed(() => mode.value),
    isDark,
    toggleTheme,
  };
}
