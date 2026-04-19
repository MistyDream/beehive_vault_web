const STORAGE_KEY = 'bh-theme';

export function useDarkMode() {
  const isDark = ref(true);

  function apply(dark: boolean) {
    if (!import.meta.client) return;
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }

  function toggle() {
    isDark.value = !isDark.value;
    apply(isDark.value);
  }

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    isDark.value = stored === 'light' ? false : true;
    apply(isDark.value);
  });

  return {
    isDark: readonly(isDark),
    toggle,
  };
}
