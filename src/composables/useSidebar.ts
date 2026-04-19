export function useSidebar() {
  const isOpen = useState('bh-sidebar-open', () => false);
  const toggle = useToggle(isOpen);
  const close = () => { isOpen.value = false; };

  return { isOpen, toggle, close };
}
