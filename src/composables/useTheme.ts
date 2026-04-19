import {
  THEME_DEFAULT,
  THEME_STORAGE_KEY,
  THEME_SWITCH_CLASS,
  THEME_SWITCH_DURATION_MS,
} from '~/constants/theme';

export function useTheme() {
  const mode = useColorMode({
    storageKey: THEME_STORAGE_KEY,
    initialValue: THEME_DEFAULT,
    disableTransition: false,
    modes: {
      light: 'light',
      dark: 'dark',
    },
  });

  const isDark = computed(() => mode.value === 'dark');

  function toggle() {
    if (import.meta.client) {
      const html = document.documentElement;
      html.classList.add(THEME_SWITCH_CLASS);
      window.setTimeout(
        () => html.classList.remove(THEME_SWITCH_CLASS),
        THEME_SWITCH_DURATION_MS,
      );
    }
    mode.value = isDark.value ? 'light' : 'dark';
  }

  return {
    theme: computed(() => mode.value),
    isDark,
    toggle,
  };
}
