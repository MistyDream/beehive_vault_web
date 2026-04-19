export function useSidebar() {
  const isOpen = useState('bh-sidebar-open', () => false);

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return {
    isOpen: readonly(isOpen),
    toggle,
    open,
    close,
  };
}
